import { ITrack, PlayerStatus } from "./media";

export interface IPlaybackState {
    status: PlayerStatus;
    currentTime: number;
    duration: number;
    volume: number; // 0.0 to 1.0 (or >1.0 for boost)
    playbackRate: number;
    isMuted: boolean;
    buffering: boolean;
    warnings: string[];
    errors: string[];
}

export interface IPlaylistState {
    tracks: ITrack[];
    currentIndex: number;
    queue: string[]; // List of track IDs
    shuffle: boolean;
    repeat: "none" | "one" | "all";
}

export interface ISettingsState {
    themeMode: "light" | "dark" | "system";
    audioDevice: string;
    hardwareAccel: boolean;
}

export interface IAppState {
    currentView: string;
    isInitialized: boolean;
}

export interface IThemeState {
    name: "neon-purple" | "neon-cyan";
    glassmorphism: boolean;
    neonEffects: boolean;
}

export interface ILocalizationState {
    locale: "en" | "ar";
}

export interface INetworkState {
    isConnected: boolean;
    connectionType: "offline" | "wifi" | "ethernet" | "unknown";
    lastChecked: number | null;
}

export interface IUpdateState {
    available: boolean;
    version: string | null;
    lastChecked: number | null;
    releaseNotes?: string;
}

export interface IRootState {
    app: IAppState;
    playback: IPlaybackState;
    playlist: IPlaylistState;
    settings: ISettingsState;
    theme: IThemeState;
    localization: ILocalizationState;
    network: INetworkState;
    update: IUpdateState;
}
