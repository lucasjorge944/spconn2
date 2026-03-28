const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { IPC_CHANNEL_HANDLE, ApiEndpoint } = require("@spce/shared");
const sidecar = require("./sidecar-client");
const sidecarProcess = require("./sidecar-process");

/** Dev: URL do Vite (ex.: http://127.0.0.1:5173). Produção: undefined → abre dist do renderer. */
const rendererDevUrl = process.env.ELECTRON_RENDERER_URL;
const isDev = Boolean(rendererDevUrl);

function rendererIndexHtml() {
    if (app.isPackaged) {
        return path.join(__dirname, "renderer", "dist", "index.html");
    }
    return path.join(__dirname, "..", "renderer", "dist", "index.html");
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (isDev) {
        win.loadURL(rendererDevUrl);
        win.webContents.openDevTools({ mode: "detach" });
    } else {
        win.loadFile(rendererIndexHtml());
    }
}

function registerIpc() {
    ipcMain.handle("api:invoke", async (_event, payload) => {
        const { channel, endpoint, input } = payload || {};
        if (channel !== IPC_CHANNEL_HANDLE) {
            throw new Error(`Canal inválido: ${channel}`);
        }
        if (endpoint === ApiEndpoint.root) {
            return { message: "Hello from Electron main" };
        }
        if (endpoint === ApiEndpoint.exec) {
            return await sidecar.exec(input);
        }
        throw new Error(`Rota não implementada: ${endpoint}`);
    });
}

app.whenReady().then(async () => {
    if (app.isPackaged && process.env.SPCE_SKIP_EMBEDDED_SIDECAR !== "1") {
        try {
            await sidecarProcess.startEmbedded();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            dialog.showErrorBox(
                "jdbc-sidecar",
                `Não foi possível iniciar o servidor JDBC embutido.\n\n${msg}\n\n` +
                    "Instale um JRE/JDK e garanta que o comando `java` está no PATH " +
                    "(ou defina JAVA_HOME)."
            );
            app.quit();
            return;
        }
    }

    registerIpc();
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("before-quit", () => {
    sidecarProcess.stopEmbedded();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
