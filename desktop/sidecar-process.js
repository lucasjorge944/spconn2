const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { app } = require("electron");

let child = null;

function getPort() {
    const p = Number(process.env.JDBC_SIDECAR_PORT || 18080);
    return Number.isFinite(p) ? p : 18080;
}

function javaExecutable() {
    if (process.env.JAVA_HOME) {
        const name = process.platform === "win32" ? "java.exe" : "java";
        return path.join(process.env.JAVA_HOME, "bin", name);
    }
    return "java";
}

function embeddedJarPath() {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, "sidecar", "jdbc-sidecar.jar");
    }
    return path.join(__dirname, "..", "jdbc-sidecar", "target", "jdbc-sidecar.jar");
}

function waitForHealth(port, timeoutMs = 120000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const poll = () => {
            if (Date.now() - start > timeoutMs) {
                reject(
                    new Error(
                        `Timeout aguardando http://127.0.0.1:${port}/health (${timeoutMs}ms)`
                    )
                );
                return;
            }
            const req = http.get(`http://127.0.0.1:${port}/health`, (res) => {
                res.resume();
                if (res.statusCode === 200) {
                    resolve();
                } else {
                    setTimeout(poll, 400);
                }
            });
            req.on("error", () => setTimeout(poll, 400));
        };
        poll();
    });
}

/**
 * Inicia o processo JVM do jdbc-sidecar (apenas build empacotado).
 * Em desenvolvimento, use um terminal com `yarn dev:sidecar` na raiz `apps/`.
 */
async function startEmbedded() {
    if (!app.isPackaged) {
        return;
    }
    if (process.env.SPCE_SKIP_EMBEDDED_SIDECAR === "1") {
        return;
    }
    const jar = embeddedJarPath();
    if (!fs.existsSync(jar)) {
        throw new Error(`Arquivo não encontrado: ${jar}`);
    }
    const port = getPort();
    const java = javaExecutable();
    child = spawn(java, ["-jar", jar], {
        stdio: "ignore",
        env: { ...process.env, JDBC_SIDECAR_PORT: String(port) },
        windowsHide: true
    });
    child.on("error", (err) => {
        console.error("jdbc-sidecar spawn:", err);
    });
    child.on("exit", (code, signal) => {
        child = null;
        if (code !== 0 && code !== null) {
            console.warn("jdbc-sidecar encerrou com código", code, signal);
        }
    });
    await waitForHealth(port);
}

function stopEmbedded() {
    if (!child || child.killed) {
        return;
    }
    try {
        if (process.platform === "win32") {
            child.kill();
        } else {
            child.kill("SIGTERM");
        }
    } catch {
        /* ignore */
    }
    child = null;
}

module.exports = { startEmbedded, stopEmbedded, embeddedJarPath, getPort };
