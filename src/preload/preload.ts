/**
 * Project: KNOUX Player X™
 * Layer: Electron Preload
 */

import { contextBridge, ipcRenderer } from "electron";

const ALLOWED_CHANNELS = new Set([
    "dialog:openFiles",
    "system:openExternal",
    "media:parse-metadata",
    "system:get-diagnostics",
    "system:getAppPath",
    "update:check"
]);

const safeInvoke = (channel: string, ...args: unknown[]) => {
    if (!ALLOWED_CHANNELS.has(channel)) {
        throw new Error(`Blocked IPC channel: ${channel}`);
    }
    return ipcRenderer.invoke(channel, ...args);
};

const api = {
    openFiles: () => safeInvoke("dialog:openFiles"),
    openExternal: (url: string) => safeInvoke("system:openExternal", url),
    media: {
        getMetadata: (filePath: string) => safeInvoke("media:parse-metadata", filePath)
    },
    system: {
        getDiagnostics: () => safeInvoke("system:get-diagnostics"),
        getAppPath: () => safeInvoke("system:getAppPath"),
        checkForUpdates: () => safeInvoke("update:check")
    },
    on: (channel: string, listener: (...args: unknown[]) => void) =>
        ipcRenderer.on(channel, (_event, ...args) => listener(...args)),
    off: (channel: string, listener: (...args: unknown[]) => void) =>
        ipcRenderer.removeListener(channel, listener)
};

contextBridge.exposeInMainWorld("knouxAPI", api);
