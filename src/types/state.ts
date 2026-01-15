import { ITrack, PlayerStatus } from "./media";

export interface IPlaybackState {
    status: PlayerStatus;
    currentTime: number;
    duration: number;
    volume: number; // 0.0 to 1.0 (or >1.0 for boost)
    playbackRate: number;
    isMuted: boolean;
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

export interface IRootState {
    playback: IPlaybackState;
    playlist: IPlaylistState;
    settings: ISettingsState;
}
