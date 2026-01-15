/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Definition: The strict schema for plugin metadata validation.
 */

export type PluginPermission = 
    | "filesystem:read"
    | "filesystem:write"
    | "network:fetch"
    | "dsp:audio"
    | "ui:overlay"
    | "library:manage";

export type PluginType = "visual" | "dsp" | "provider" | "general";

export interface IPluginManifest {
    /** Unique identifier (reverse domain notation preferred, e.g. com.knoux.equalizer) */
    id: string;
    
    /** Display name */
    name: string;
    
    /** SemVer version string */
    version: string;
    
    /** Short description */
    description: string;
    
    /** The main entry file relative to plugin root (e.g. "dist/main.js") */
    entry: string;
    
    /** Required permissions for the plugin to function */
    permissions: PluginPermission[];
    
    /** Minimum compatible core version */
    minCoreVersion: string;
    
    /** Author information */
    author?: string | { name: string; email?: string; url?: string };
}
