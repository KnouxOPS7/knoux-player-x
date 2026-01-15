/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Interfaces specifically for plugins that perform real-time DSP
 * Note: These plugins often require WebAssembly or Native Node Modules.
 */

export interface IPCMBuffer {
    left: Float32Array;
    right: Float32Array;
    length: number;
    sampleRate: number;
}

/**
 * If a plugin exports an "AudioProcessor", the Core Engine acts as host.
 */
export interface IAudioProcessor {
    readonly id: string;
    
    /** Setup filters or state */
    prepare(sampleRate: number, blockSize: number): void;
    
    /**
     * Real-time Processing Block
     * @returns boolean true if buffer was modified
     */
    process(buffer: IPCMBuffer): boolean;
    
    /** Flush internal delay lines/buffers */
    reset(): void;
}
