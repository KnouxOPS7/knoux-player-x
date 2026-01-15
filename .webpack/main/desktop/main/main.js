"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dspBridge_1 = require("./native/dsp/dspBridge");
let mainWindow = null;
function resolvePreload(preloadPath) {
    try {
        if (fs_1.default.existsSync(preloadPath))
            return preloadPath;
        const alt1 = path_1.default.join(process.cwd(), '.webpack', 'x64', 'renderer', 'main_window', 'preload.js');
        if (fs_1.default.existsSync(alt1))
            return alt1;
        const alt2 = path_1.default.join(process.cwd(), '.webpack', 'renderer', 'main_window', 'preload.js');
        if (fs_1.default.existsSync(alt2))
            return alt2;
        const alt3 = path_1.default.join(__dirname, '..', '..', 'desktop', 'preload', 'preload.js');
        if (fs_1.default.existsSync(alt3))
            return alt3;
        const alt4 = path_1.default.join(__dirname, 'preload.js');
        if (fs_1.default.existsSync(alt4))
            return alt4;
        return preloadPath;
    }
    catch (_a) {
        return preloadPath;
    }
}
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: resolvePreload(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY),
        },
    });
    if (typeof MAIN_WINDOW_WEBPACK_ENTRY === 'string') {
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }
    else {
        const prodHtml = path_1.default.join(__dirname, '..', '..', 'desktop', 'renderer', 'index.html');
        if (fs_1.default.existsSync(prodHtml)) {
            mainWindow.loadFile(prodHtml);
        }
        else {
            // fallback to public index.html if present
            const publicHtml = path_1.default.join(__dirname, '..', '..', 'public', 'index.html');
            if (fs_1.default.existsSync(publicHtml)) {
                mainWindow.loadFile(publicHtml);
            }
            else {
                mainWindow.loadURL('data:text/html,<h1>Renderer missing</h1>');
            }
        }
    }
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    (0, dspBridge_1.setupDSPMainHandler)();
    const ses = electron_1.session.defaultSession;
    ses.setPermissionRequestHandler((_webContents, permission, callback) => {
        const allowed = ['notifications', 'fullscreen', 'pointerLock', 'openExternal'];
        callback(allowed.includes(permission));
    });
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map