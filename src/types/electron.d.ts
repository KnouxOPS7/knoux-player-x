/**
 * Project: KNOUX Player X™
 * Purpose: Extend Window object with the Secure Bridge API.
 */

export interface ISystemDiagnostics {
    cpuLoad: number;
    ramUsage: number;
    totalMemory: number;
    freeMemory: number;
    appVersion: string;
    platform: string;
    arch: string;
    gpuModel?: string;
    uptimeSec: number;
    networkInterfaces: string[];
}

export interface IMediaMetadata {
    title?: string;
    artist?: string;
    album?: string;
    year?: string;
    durationSec: number;
    bitrate: number;
    sampleRate?: number;
    channels?: number;
    audioCodec?: string;
    videoCodec?: string;
    hasCoverArt: boolean;
}

export interface IElectronAPI {
    openFiles: () => Promise<string[]>;
    openExternal: (url: string) => Promise<boolean>;
    media: {
        getMetadata: (filePath: string) => Promise<IMediaMetadata>;
    };
    system: {
        getDiagnostics: () => Promise<ISystemDiagnostics>;
        getAppPath: () => Promise<string>;
        checkForUpdates: () => Promise<{
            updateAvailable: boolean;
            version?: string;
            releaseName?: string;
        }>;
    };
    on: (channel: string, listener: (...args: unknown[]) => void) => void;
    off: (channel: string, listener: (...args: unknown[]) => void) => void;
}

declare global {
    interface Window {
        knouxAPI: IElectronAPI;
    }
}
