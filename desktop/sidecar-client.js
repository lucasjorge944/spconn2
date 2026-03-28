const http = require("http");

function getPort() {
    const p = Number(process.env.JDBC_SIDECAR_PORT || 18080);
    return Number.isFinite(p) ? p : 18080;
}

function post(path, body) {
    const payload = JSON.stringify(body ?? {});
    return new Promise((resolve, reject) => {
        const req = http.request(
            {
                hostname: "127.0.0.1",
                port: getPort(),
                path,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(payload, "utf8")
                },
                timeout: 120000
            },
            (res) => {
                const chunks = [];
                res.on("data", (c) => chunks.push(c));
                res.on("end", () => {
                    const raw = Buffer.concat(chunks).toString("utf8");
                    if (res.statusCode && res.statusCode >= 400) {
                        try {
                            const err = JSON.parse(raw);
                            reject(new Error(err.error || raw || `HTTP ${res.statusCode}`));
                        } catch {
                            reject(new Error(raw || `HTTP ${res.statusCode}`));
                        }
                        return;
                    }
                    try {
                        resolve(raw ? JSON.parse(raw) : null);
                    } catch {
                        reject(new Error(`JSON inválido do sidecar: ${raw}`));
                    }
                });
            }
        );
        req.on("error", reject);
        req.on("timeout", () => {
            req.destroy();
            reject(new Error("Timeout ao falar com o jdbc-sidecar"));
        });
        req.write(payload);
        req.end();
    });
}

/** Executa SQL arbitrário (SELECT, DML, DDL) no sidecar. */
async function exec(input) {
    return post("/exec", input);
}

module.exports = { exec, getPort };
