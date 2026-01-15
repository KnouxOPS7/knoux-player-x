/**
 * Project: KNOUX Player X™
 * File: registry.ts
 * Author: knoux
 * Purpose: Plugin registry system for managing plugin lifecycle, loading, and registration
 * Layer: Plugins -> Plugin SDK -> Registry
 */

import { Plugin, PluginContext, PluginMetadata } from './types';
import { createPluginContext, validatePlugin } from './api';

/**
 * Plugin registry class
 */
class PluginRegistry {
  private plugins: Map<string, RegisteredPlugin> = new Map();
  private context: PluginContext;
  private initialized: boolean = false;

  constructor() {
    this.context = createPluginContext();
  }

  /**
   * Initialize the plugin registry
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Initialize context if needed
    // This would typically be done by the main application
    
    this.initialized = true;
    console.log('[PLUGIN-REGISTRY] Initialized');
  }

  /**
   * Register a plugin
   */
  async register(plugin: Plugin): Promise<boolean> {
    if (!validatePlugin(plugin)) {
      console.error('[PLUGIN-REGISTRY] Invalid plugin structure', plugin.metadata?.id);
      return false;
    }

    const id = plugin.metadata.id;
    
    if (this.plugins.has(id)) {
      console.warn(`[PLUGIN-REGISTRY] Plugin ${id} already registered`);
      return false;
    }

    try {
      const registeredPlugin: RegisteredPlugin = {
        plugin,
        enabled: false,
        loaded: false,
        context: this.context
      };

      this.plugins.set(id, registeredPlugin);

      // Initialize plugin if registry is already initialized
      if (this.initialized) {
        await this.initializePlugin(id);
      }

      console.log(`[PLUGIN-REGISTRY] Registered plugin: ${id}`);
      return true;
    } catch (error) {
      console.error(`[PLUGIN-REGISTRY] Failed to register plugin ${id}:`, error);
      return false;
    }
  }

  /**
   * Unregister a plugin
   */
  async unregister(id: string): Promise<boolean> {
    const registeredPlugin = this.plugins.get(id);
    
    if (!registeredPlugin) {
      console.warn(`[PLUGIN-REGISTRY] Plugin ${id} not found`);
      return false;
    }

    // Unload plugin if currently loaded
    if (registeredPlugin.loaded) {
      await this.unloadPlugin(id);
    }

    this.plugins.delete(id);
    console.log(`[PLUGIN-REGISTRY] Unregistered plugin: ${id}`);
    return true;
  }

  /**
   * Enable a plugin
   */
  async enable(id: string): Promise<boolean> {
    const registeredPlugin = this.plugins.get(id);
    
    if (!registeredPlugin) {
      console.warn(`[PLUGIN-REGISTRY] Plugin ${id} not found`);
      return false;
    }

    if (registeredPlugin.enabled) {
      console.warn(`[PLUGIN-REGISTRY] Plugin ${id} already enabled`);
      return true;
    }

    registeredPlugin.enabled = true;
    
    // Load plugin if registry is initialized
    if (this.initialized) {
      await this.loadPlugin(id);
    }

    console.log(`[PLUGIN-REGISTRY] Enabled plugin: ${id}`);
    return true;
  }

  /**
   * Disable a plugin
   */
  async disable(id: string): Promise<boolean> {
    const registeredPlugin = this.plugins.get(id);
    
    if (!registeredPlugin) {
      console.warn(`[PLUGIN-REGISTRY] Plugin ${id} not found`);
      return false;
    }

    if (!registeredPlugin.enabled) {
      console.warn(`[PLUGIN-REGISTRY] Plugin ${id} already disabled`);
      return true;
    }

    // Unload plugin if currently loaded
    if (registeredPlugin.loaded) {
      await this.unloadPlugin(id);
    }

    registeredPlugin.enabled = false;
    console.log(`[PLUGIN-REGISTRY] Disabled plugin: ${id}`);
    return true;
  }

  /**
   * Load a plugin
   */
  private async loadPlugin(id: string): Promise<boolean> {
    const registeredPlugin = this.plugins.get(id);
    
    if (!registeredPlugin || !registeredPlugin.enabled) {
      return false;
    }

    if (registeredPlugin.loaded) {
      console.warn(`[PLUGIN-REGISTRY] Plugin ${id} already loaded`);
      return true;
    }

    try {
      const plugin = registeredPlugin.plugin;

      // Call initialize method if exists
      if (plugin.initialize) {
        await Promise.resolve(plugin.initialize(registeredPlugin.context));
      }

      // Call onLoad method if exists
      if (plugin.onLoad) {
        await Promise.resolve(plugin.onLoad());
      }

      registeredPlugin.loaded = true;
      console.log(`[PLUGIN-REGISTRY] Loaded plugin: ${id}`);
      return true;
    } catch (error) {
      console.error(`[PLUGIN-REGISTRY] Failed to load plugin ${id}:`, error);
      return false;
    }
  }

  /**
   * Initialize a plugin
   */
  private async initializePlugin(id: string): Promise<boolean> {
    const registeredPlugin = this.plugins.get(id);
    
    if (!registeredPlugin) {
      return false;
    }

    if (registeredPlugin.enabled) {
      return await this.loadPlugin(id);
    }

    return true;
  }

  /**
   * Unload a plugin
   */
  private async unloadPlugin(id: string): Promise<boolean> {
    const registeredPlugin = this.plugins.get(id);
    
    if (!registeredPlugin || !registeredPlugin.loaded) {
      return false;
    }

    try {
      const plugin = registeredPlugin.plugin;

      // Call onUnload method if exists
      if (plugin.onUnload) {
        await Promise.resolve(plugin.onUnload());
      }

      registeredPlugin.loaded = false;
      console.log(`[PLUGIN-REGISTRY] Unloaded plugin: ${id}`);
      return true;
    } catch (error) {
      console.error(`[PLUGIN-REGISTRY] Failed to unload plugin ${id}:`, error);
      return false;
    }
  }

  /**
   * Get plugin metadata
   */
  getPluginMetadata(id: string): PluginMetadata | undefined {
    const registeredPlugin = this.plugins.get(id);
    return registeredPlugin?.plugin.metadata;
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): PluginMetadata[] {
    return Array.from(this.plugins.values()).map(rp => rp.plugin.metadata);
  }

  /**
   * Check if plugin is enabled
   */
  isPluginEnabled(id: string): boolean {
    const registeredPlugin = this.plugins.get(id);
    return registeredPlugin?.enabled ?? false;
  }

  /**
   * Check if plugin is loaded
   */
  isPluginLoaded(id: string): boolean {
    const registeredPlugin = this.plugins.get(id);
    return registeredPlugin?.loaded ?? false;
  }
}

/**
 * Registered plugin structure
 */
interface RegisteredPlugin {
  plugin: Plugin;
  enabled: boolean;
  loaded: boolean;
  context: PluginContext;
}

// Export singleton instance
export const pluginRegistry = new PluginRegistry();

// Export types
export type { PluginRegistry };
