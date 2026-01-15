/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Abstract Base Class that all 3rd party plugins MUST extend.
 * Layer: Plugins -> SDK Base
 */

import { IPluginContext } from "./types/context";
import { IPluginManifest } from "./types/manifest";

/**
 * Abstract Base Class for Knoux Plugins.
 * To create a plugin:
 * 1. Extend this class.
 * 2. Implement onLoad() and onUnload().
 * 3. Export as default.
 */
export abstract class KnouxPlugin {
    // Context is injected by the host Runtime
    protected context!: IPluginContext;
    protected manifest!: IPluginManifest;

    /**
     * Called internally by PluginManager to bootstrap the instance.
     * Do NOT override this unless necessary.
     */
    public _init(ctx: IPluginContext, manifest: IPluginManifest): void {
        this.context = ctx;
        this.manifest = manifest;
        this.context.logger.info(`[${this.manifest.name}] Initialized structure.`);
    }

    /**
     * LifeCycle: Called when plugin is successfully loaded and validated.
     * Use this to register listeners, UI elements, or DSP hooks.
     */
    public abstract onLoad(): Promise<void> | void;

    /**
     * LifeCycle: Called when plugin is disabled or app is closing.
     * Clean up all listeners and UI elements here.
     */
    public abstract onUnload(): Promise<void> | void;

    /**
     * Optional: Called when settings change from the main App.
     */
    public onSettingsChange(newSettings: Record<string, any>): void {
        // Optional override
    }
}
