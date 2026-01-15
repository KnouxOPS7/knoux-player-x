/**
 * Project: KNOUX Player X™
 * File: pluginTypes.ts
 * Purpose: Base interface and type definitions for third‑party plugins.
 * Layer: Core / Plugin SDK
 *
 * Each public plugin should implement `KnuXPluginDescriptor` and export a
 * function that receives the application context (read‑only) and
 * optionally the global store/state API.  
 * The interface is intentionally narrow – it can evolve as we iterate.
 *
 * Example:
 * ```
 * import type { KnuXContext, KnuXPluginDescriptor } from './pluginTypes';
 *
 * export default (context: KnuXContext): KnuXPluginDescriptor => ({
 *   name: 'sample',
 *   description: 'Sample plugin for demonstration',
 *   activate(context) {
 *     console.log('Activated sample plugin');
 *   },
 *   deactivate() { console.log('Deactivated sample'); }
 * });
 * ```
 */
export interface KnuXContext {
  readonly electronApp: import('electron').App;
  readonly ipc: import('electron').IpcRenderer | null;
  readonly config: Record<string, unknown>;
}

export interface PluginCommandDefinition {
  /** A unique identifier for the command (used in keymap & registration). */
  command: string;
  /** User‑facing label. */
  title: string;
  /** Shortcut in standard accelerator notation, eg `"CmdOrCtrl+Shift+M"`. */
  accelerator?: string;
  /** Executes the command with optional parameters. */
  handler: (...args: unknown[]) => Promise<void> | void;
}

export interface KnuXPluginDescriptor {
  /** Friendly name for display & diagnostics. */
  readonly name: string;
  /** Brief human‑readable description. */
  readonly description: string;
  /** Called once immediately after the plugin instance is loaded. */
  activate(context: KnuXContext): Promise<void> | void;
  /** Optional teardown hook invoked before plugin is unloaded or when app exits. */
  deactivate?(): Promise<void> | void;
  /** Optional list of commands exposed by the plugin. */
  commands?: PluginCommandDefinition[];
}
