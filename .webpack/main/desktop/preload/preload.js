"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('knouxAPI', {
    invoke: (channel, data) => electron_1.ipcRenderer.invoke(channel, data),
    on: (channel, func) => {
        electron_1.ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
    off: (channel, func) => {
        electron_1.ipcRenderer.removeListener(channel, func);
    },
    platform: process.platform
});
//# sourceMappingURL=preload.js.map