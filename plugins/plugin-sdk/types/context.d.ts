/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Definition: The Context Bridge exposed to plugins securely.
 */

import { DSPConfig } from "../../../desktop/main/native/dsp/dsp_bridge";

// Re-export specific Media Types needed by plugins
export interface MediaTrack {
    id: string;
    path: string;
    title: string;
    duration: number;
    metadata: Record<string, any>;
}

export interface PlayerState {
    isPlaying: boolean;
    volume: number; // 0.0 - 1.0
    currentTime: number;
    totalTime: number;
    currentTrack: MediaTrack | null;
}

export interface IToastOptions {
    type: "info" | "success" | "error" | "warning";
    duration?: number;
}

/**
 * The main API object passed to every plugin upon initialization.
 * Restricted to ensure safety.
 */
export interface IPluginContext {
    // --- Lifecycle ---
    readonly version: string;

    // --- Interaction ---
    toast(message: string, options?: IToastOptions): void;
    logger: {
        info(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
    };

    // --- Player Control ---
    player: {
        play(): Promise<void>;
        pause(): Promise<void>;
        seek(seconds: number): void;
        setVolume(val: number): void;
        getState(): PlayerState;
        
        /** Register a callback for state changes. Returns unregister function. */
        subscribe(event: "state", cb: (state: PlayerState) => void): () => void;
        subscribe(event: "track", cb: (track: MediaTrack | null) => void): () => void;
    };

    // --- Audio DSP (If permission 'dsp:audio' is granted) ---
    dsp?: {
        applyConfig(config: DSPConfig): void;
        reset(): void;
    };

    // --- File System (If permission 'filesystem:read' is granted) ---
    fs?: {
        readFile(path: string): Promise<Uint8Array>;
        readTextFile(path: string): Promise<string>;
    };
}
