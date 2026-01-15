"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDSPMainHandler = exports.setupDSPRendererBridge = void 0;
const electron_1 = require("electron");
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
//# sourceMappingURL=dspBridge.js.map