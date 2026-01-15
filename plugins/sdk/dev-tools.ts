/**
 * Project: KNOUX Player X™
 * File: dev-tools.ts
 * Purpose: Small runtime helper library used by external plugins.  These utilities keep plugins from calling
 *          Electron APIs directly and allow a thin wrapper around the central IPC surface.
 * Layer: Plugins – SDK Runtime Utilities
 */

import type { KnuXCommand, KnuXPluginContext } from './plugin-sdk.d';
import type { IpcRenderer } from 'electron';

const LOG_PREFIX = 'KNOUX::SDK::PLUGIN';

// --- Logging helper ----------------------------------------------------------
// A lightweight logger that forwards to host `window` or devtools.
export function createPluginLogger(name: string) {
    const logger = {
        debug: (...args: any[]) => hostLog('DEBUG', name, ...args),
        info:  (...args: any[]) => hostLog('INFO',  name, ...args),
        warn:  (...args: any[]) => hostLog('WARN',  name, ...args),
        error: (...args: any[]) => hostLog('ERROR', name, ...args)
    };
    function hostLog(level: string, mod: string, ...payload: any[]) {
        if (window && (window as any).consoleLog) {
            ;(window as any).consoleLog(`[${mod}][${level}]`, ...payload);
        } else if (process?.env?.KNOUX_PLUGIN_LOG && typeof console !== 'undefined') {
            // Host side injection in devtools or main process when enabled
            console[(level.toLowerCase() as any)](`[${mod}]`, ...payload);
        } else {
            // Fallback console
            console.log(`[${mod}] [${level}]`, ...payload);
        }
    }
    return logger;
}

// --- Command Registration helper --------------------------------------------
export function registerCommand(ipc: IpcRenderer | undefined, command: KnuXCommand) {
    if (!ipc) throw new Error('IpcRenderer missing – plugin must run in preload context.');
    ipc.send('knux:plugin:registerCommand', command);
}
