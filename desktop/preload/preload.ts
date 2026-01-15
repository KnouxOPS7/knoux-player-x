import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('knouxAPI', {
    invoke: (channel: string, data?: any) => ipcRenderer.invoke(channel, data),
    on: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
    off: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.removeListener(channel, func);
    }
});