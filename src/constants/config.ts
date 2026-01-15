/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Layer: Shared -> Constants
 */

export const APP_CONFIG = {
    NAME: "KNOUX Player X",
    VERSION: "1.0.0-Alpha",
    ID: "com.knoux.playerx",
    AUTHOR: "Sadek Elgazar (KNOUX)",
    LICENSE: "Proprietary",
    GITHUB_URL: "https://github.com/knuux7-ctrl/KNOX-Player-X-",
} as const;

export const SYSTEM_DEFAULTS = {
    VOLUME: 0.75,
    PLAYBACK_RATE: 1.0,
    LANGUAGE: "en",
    THEME: "knoux-neon-dark",
    
    // Limits
    MAX_RECENT_FILES: 20,
    MAX_PLAYLIST_SIZE: 5000,
    MAX_VOLUME: 2.0, // Allow boost up to 200% via software gain
} as const;

export const SUPPORTED_EXTENSIONS = {
    VIDEO: [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".webm", ".flv"],
    AUDIO: [".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg"],
    SUBTITLE: [".srt", ".vtt", ".ass", ".ssa", ".sub"],
    PLAYLIST: [".m3u", ".m3u8", ".pls"]
} as const;
