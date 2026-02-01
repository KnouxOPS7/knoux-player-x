/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./desktop/main/main.ts"
/*!******************************!*\
  !*** ./desktop/main/main.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const dspBridge_1 = __webpack_require__(/*! ./native/dsp/dspBridge */ "./desktop/main/native/dsp/dspBridge.ts");
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
        const alt3 = path_1.default.join("", '..', '..', 'desktop', 'preload', 'preload.js');
        if (fs_1.default.existsSync(alt3))
            return alt3;
        const alt4 = path_1.default.join("", 'preload.js');
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
            preload: resolvePreload('/project/workspace/.webpack/renderer/main_window/preload.js'),
        },
    });
    if (true) {
        mainWindow.loadURL('http://localhost:9000/main_window/index.html');
    }
    else // removed by dead control flow
{}
    if (true) {
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


/***/ },

/***/ "./desktop/main/native/dsp/dspBridge.ts"
/*!**********************************************!*\
  !*** ./desktop/main/native/dsp/dspBridge.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: TypeScript Bridge for Native DSP Processor
 * Layer: Desktop -> Native -> DSP
 *
 * Related Files:
 * - Native: DSPProcessor.h/cpp
 * - Service: src/core/audio/dspService.ts
 * - Usage: window.knouxAPI.invoke("knux:dsp:process", audioBuffer, config)
 *
 * Note: This can work via:
 * 1. Native Addon (node-gyp compiled)
 * 2. IPC Bridge to C++ process
 * 3. WebAssembly Module (planned future)
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupDSPMainHandler = exports.setupDSPRendererBridge = void 0;
const electron_1 = __webpack_require__(/*! electron */ "electron");
// Renderer-side bridge (used in preload when loaded)
const setupDSPRendererBridge = () => {
    // Exposed via preload contextBridge as part of knouxAPI
    return {
        processAudio: (buffer, config) => __awaiter(void 0, void 0, void 0, function* () {
            return yield electron_1.ipcRenderer.invoke('knux:dsp:process', buffer, config);
        }),
        applyPreset: (presetName) => __awaiter(void 0, void 0, void 0, function* () {
            return yield electron_1.ipcRenderer.invoke('knux:dsp:preset', presetName);
        })
    };
};
exports.setupDSPRendererBridge = setupDSPRendererBridge;
// Main process handler
const setupDSPMainHandler = () => {
    // OPTION 1: Using native addon (requires node-gyp build step)
    /*
    try {
      const dspAddon = require('../../build/Release/DSPProcessor.node');
      ipcMain.handle('knux:dsp:process', async (_, buffer: Float32Array, config: DSPConfig) => {
        return dspAddon.processBuffer(buffer, config);
      });
    } catch (error) {
      console.warn('[DSP] Native addon not available, falling back to IPC', error);
    */
    // OPTION 2: IPC-based processing (sends raw data between processes)
    electron_1.ipcMain.handle('knux:dsp:process', (_, buffer, config) => __awaiter(void 0, void 0, void 0, function* () {
        // In production: Send to dedicated audio worker process or WASM module
        // For now: Return unmodified buffer with console log
        console.log(`[DSP] Processing buffer of ${buffer.length} samples with config:`, config);
        // Simulate basic processing - REPLACE WITH REAL DSP CALL
        const processed = new Float32Array(buffer);
        if (config.gain !== 1.0) {
            for (let i = 0; i < processed.length; i++) {
                processed[i] *= config.gain;
            }
        }
        return processed;
    }));
    // Preset management
    const dspPresets = {
        'flat': { gain: 1.0, bass: 0.0, treble: 0.0, normalize: false, customEq: [] },
        'bass-boost': { gain: 1.0, bass: 8.0, treble: -2.0, normalize: false, customEq: [] },
        'treble-boost': { gain: 1.0, bass: -2.0, treble: 8.0, normalize: false, customEq: [] },
        'vocal-boost': { gain: 1.0, bass: 2.0, treble: 3.0, normalize: true, customEq: [0, 0, 2, 3, 4, 4, 3, 2, 0, 0] },
        'classical': { gain: 1.0, bass: 3.0, treble: 1.0, normalize: false, customEq: [2, 1, 0, -1, -2, -2, -1, 0, 1, 2] }
    };
    electron_1.ipcMain.handle('knux:dsp:preset', (_, presetName) => __awaiter(void 0, void 0, void 0, function* () {
        return dspPresets[presetName] || dspPresets['flat'];
    }));
};
exports.setupDSPMainHandler = setupDSPMainHandler;


/***/ },

/***/ "electron"
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
(module) {

module.exports = require("electron");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ },

/***/ "path"
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
(module) {

module.exports = require("path");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./desktop/main/main.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map