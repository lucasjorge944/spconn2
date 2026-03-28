const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("isElectron", true);
contextBridge.exposeInMainWorld("api", {
    invoke: (payload) => ipcRenderer.invoke("api:invoke", payload)
});
