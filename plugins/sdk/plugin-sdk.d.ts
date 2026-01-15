/**
 * Project: KNOUX Player X™
 * File: plugin-sdk.d.ts
 * Purpose: Global type contract that all external plugin implementations must satisfy.
 * Layer: Plugins – SDK Types
 *
 * The SDK provides three key types that plugin writers rely on:
 *  * KnuXPluginContext - read‑only information available at plugin load time
 *  * KnuXPluginDescriptor - the public face of a plugin (name, activate/deactivate, commands)
 *  * KnuXCommand - a simple command registration request
 *
 * The goal of these contracts is to isolate third‑party code from any direct Electron API leakage.
 */

export interface KnuXPluginContext {
    readonly electronAppName: string;
    readonly appPath: string;
    readonly locale: string;
    readonly ipcRenderer?: import('electron').IpcRenderer;
}

export interface KnuXCommand {
    readonly commandId: string; // ex: “sample.play”; globally unique.
    readonly description: string; // human readable.
    readonly handler: (...args: any[]) => void | Promise<void>;
}

export interface KnuXPluginDescriptor {
    /** The user visible friendly plugin name */
    readonly name: string;
    /** Short description used in UI and logs */
    readonly description: string;
    /** Called immediately after plugin load; should not block for longer than <100ms */
    activate: (ctx: KnuXPluginContext) => Promise<void> | void;
    /** Optional tear‑down hook when host app exits */
    deactivate?: () => Promise<void> | void;
    /** Optional collection of exposed commands */
    commands?: KnuXCommand[];
}
