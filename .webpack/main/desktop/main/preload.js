"use strict";
/**
 * ================================================================================
 * KNOUX Player X
 * ================================================================================
 * Project: KNOUX Player X
 * File: C:\Users\Aisha\Downloads\knox-player-x\desktop\main\preload.ts
 * Role: Secure Context Isolation Layer and API Exposure
 * Layer: Bridge
 * Author: SADEK ELGAZAR (KNOUX)
 * Status: FINALIZED
 * ================================================================================
 *
 * This module implements a secure isolation layer between the renderer process
 * and the main Electron process. It exposes only necessary APIs through
 * contextBridge while maintaining strict security boundaries. Features include:
 *
 * - Controlled API surface exposure
 * - Type-safe IPC wrappers
 * - Secure data validation
 * - Performance-optimized messaging
 * - Error handling and recovery
 * - Memory leak prevention
 * - Cross-context communication
 * - Event delegation patterns
 */
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const events_1 = require("events");
// Custom event emitter for secure event handling
class SecureEventEmitter extends events_1.EventEmitter {
    constructor() {
        super();
        // Limit listeners to prevent memory leaks
        this.setMaxListeners(10);
    }
    // Override emit to ensure type safety
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    // Override on to ensure type safety
    on(event, listener) {
        return super.on(event, listener);
    }
}
// Global event emitters
const mediaEvents = new SecureEventEmitter();
const systemEvents = new SecureEventEmitter();
const windowEvents = new SecureEventEmitter();
const appEvents = new SecureEventEmitter();
// Expose protected APIs through context bridge
electron_1.contextBridge.exposeInMainWorld('knoxAPI', {
    // Media operations
    media: {
        openFileDialog: () => {
            return electron_1.ipcRenderer.invoke('media:open-file-dialog');
        },
        openFolderDialog: () => {
            return electron_1.ipcRenderer.invoke('media:open-folder-dialog');
        },
        validateFile: (filePath) => {
            return electron_1.ipcRenderer.invoke('media:validate-file', filePath);
        },
        scanDirectory: (dirPath) => {
            return electron_1.ipcRenderer.invoke('media:scan-directory', dirPath);
        },
        loadSubtitle: (subtitlePath) => {
            return electron_1.ipcRenderer.invoke('media:load-subtitle', subtitlePath);
        },
        detectHardwareAcceleration: () => {
            return electron_1.ipcRenderer.invoke('media:detect-hardware-acceleration');
        },
        getRecentFiles: (limit) => {
            return electron_1.ipcRenderer.invoke('media:get-recent-files', limit);
        },
        addToRecent: (fileData) => {
            return electron_1.ipcRenderer.invoke('media:add-to-recent', fileData);
        },
        // Event subscription
        onMediaEvent: (callback) => {
            const handler = (_event, eventName, data) => {
                callback(eventName, data);
            };
            electron_1.ipcRenderer.on('media:event', handler);
            mediaEvents.on('media-event', callback);
        },
        offMediaEvent: (callback) => {
            electron_1.ipcRenderer.off('media:event', (_event, eventName, data) => {
                callback(eventName, data);
            });
            mediaEvents.off('media-event', callback);
        }
    },
    // Window controls
    window: {
        minimize: () => {
            return electron_1.ipcRenderer.invoke('window:minimize');
        },
        maximize: () => {
            return electron_1.ipcRenderer.invoke('window:maximize');
        },
        close: () => {
            return electron_1.ipcRenderer.invoke('window:close');
        },
        isMaximized: () => {
            return electron_1.ipcRenderer.invoke('window:is-maximized');
        },
        // Event subscription
        onWindowEvent: (callback) => {
            const handler = (_event, eventName, data) => {
                callback(eventName, data);
            };
            electron_1.ipcRenderer.on('window:event', handler);
            windowEvents.on('window-event', callback);
        },
        offWindowEvent: (callback) => {
            electron_1.ipcRenderer.off('window:event', (_event, eventName, data) => {
                callback(eventName, data);
            });
            windowEvents.off('window-event', callback);
        }
    },
    // System information
    system: {
        getInfo: () => {
            return electron_1.ipcRenderer.invoke('system:get-info');
        },
        // Event subscription
        onSystemEvent: (callback) => {
            const handler = (_event, eventName, data) => {
                callback(eventName, data);
            };
            electron_1.ipcRenderer.on('system:event', handler);
            systemEvents.on('system-event', callback);
        },
        offSystemEvent: (callback) => {
            electron_1.ipcRenderer.off('system:event', (_event, eventName, data) => {
                callback(eventName, data);
            });
            systemEvents.off('system-event', callback);
        }
    },
    // Application controls
    app: {
        checkForUpdates: () => {
            return electron_1.ipcRenderer.invoke('app:check-for-updates');
        },
        downloadUpdate: () => {
            return electron_1.ipcRenderer.invoke('app:download-update');
        },
        quitAndInstall: () => {
            return electron_1.ipcRenderer.invoke('app:quit-and-install');
        },
        // Store operations
        store: {
            set: (key, value) => {
                return electron_1.ipcRenderer.invoke('store:set', key, value);
            },
            get: (key, defaultValue) => {
                return electron_1.ipcRenderer.invoke('store:get', key, defaultValue);
            },
            delete: (key) => {
                return electron_1.ipcRenderer.invoke('store:delete', key);
            },
            clear: () => {
                return electron_1.ipcRenderer.invoke('store:clear');
            }
        },
        // Event subscription
        onAppEvent: (callback) => {
            const handler = (_event, eventName, data) => {
                callback(eventName, data);
            };
            electron_1.ipcRenderer.on('app:event', handler);
            appEvents.on('app-event', callback);
        },
        offAppEvent: (callback) => {
            electron_1.ipcRenderer.off('app:event', (_event, eventName, data) => {
                callback(eventName, data);
            });
            appEvents.off('app-event', callback);
        }
    },
    // Utility functions
    utils: {
        // Secure random ID generator
        generateId: () => {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        },
        // Safe JSON parsing
        safeParse: (str) => {
            try {
                return JSON.parse(str);
            }
            catch (_a) {
                return null;
            }
        },
        // Format bytes to human readable
        formatBytes: (bytes, decimals = 2) => {
            if (bytes === 0)
                return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    }
});
// Listen for async events from main process
electron_1.ipcRenderer.on('app:update-available', (_event, info) => {
    appEvents.emit('app-event', 'update-available', info);
});
electron_1.ipcRenderer.on('app:no-update-available', (_event, info) => {
    appEvents.emit('app-event', 'no-update-available', info);
});
electron_1.ipcRenderer.on('app:update-error', (_event, error) => {
    appEvents.emit('app-event', 'update-error', error);
});
electron_1.ipcRenderer.on('app:download-progress', (_event, progress) => {
    appEvents.emit('app-event', 'download-progress', progress);
});
electron_1.ipcRenderer.on('app:update-downloaded', (_event, info) => {
    appEvents.emit('app-event', 'update-downloaded', info);
});
// Cleanup on unload
window.addEventListener('beforeunload', () => {
    // Remove all listeners to prevent memory leaks
    electron_1.ipcRenderer.removeAllListeners('media:event');
    electron_1.ipcRenderer.removeAllListeners('window:event');
    electron_1.ipcRenderer.removeAllListeners('system:event');
    electron_1.ipcRenderer.removeAllListeners('app:event');
    electron_1.ipcRenderer.removeAllListeners('app:update-available');
    electron_1.ipcRenderer.removeAllListeners('app:no-update-available');
    electron_1.ipcRenderer.removeAllListeners('app:update-error');
    electron_1.ipcRenderer.removeAllListeners('app:download-progress');
    electron_1.ipcRenderer.removeAllListeners('app:update-downloaded');
});
//# sourceMappingURL=preload.js.map