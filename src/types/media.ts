/**
 * Project: KNOUX Player X™
 * Purpose: Global definition for Media objects, tracks, and metadata.
 */

export interface IMediaMetadata {
    title: string;
    artist?: string;
    album?: string;
    year?: string;
    bitrate: number;
    sampleRate?: number;
    channels?: number;
    videoCodec?: string;
    audioCodec?: string;
    durationSec: number;
    hasCoverArt: boolean;
}

export interface ITrack {
    id: string;
    uuid: string; // Internal system UUID
    path: string;
    filename: string;
    extension: string;
    sizeBytes: number;
    metadata: IMediaMetadata;
    lastPlayed?: number; // timestamp
    subtitle?: {
        src: string;
        label: string;
        language: string;
    };
}

export enum PlayerStatus {
    IDLE = "IDLE",
    BUFFERING = "BUFFERING",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    STOPPED = "STOPPED",
    ERROR = "ERROR"
}
