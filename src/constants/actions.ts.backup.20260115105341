/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Description: Immutable keys for event bus (Redux/IPC) ensuring type safety across main/renderer.
 */

// IPC Channels
export const IPC_CHANNELS = {
    // Window Management
    WINDOW: {
        MINIMIZE: "knux:win:minimize",
        MAXIMIZE: "knux:win:maximize",
        CLOSE: "knux:win:close",
        GET_STATE: "knux:win:get-state",
    },
    
    // File System & Native
    SYSTEM: {
        OPEN_FILE: "knux:sys:open-file",
        OPEN_FOLDER: "knux:sys:open-folder",
        SAVE_FILE: "knux:sys:save-file",
        GET_APP_PATH: "knux:sys:get-path",
    },

    // Engine Core
    MEDIA: {
        LOAD: "knux:media:load",
        PAUSE: "knux:media:pause",
        RESUME: "knux:media:resume",
        STOP: "knux:media:stop",
        SEEK: "knux:media:seek",
        SET_VOLUME: "knux:media:set-volume",
        APPLY_DSP: "knux:media:apply-dsp",
    },

    // Plugins
    PLUGIN: {
        INSTALL: "knux:plugin:install",
        UNINSTALL: "knux:plugin:uninstall",
        GET_ALL: "knux:plugin:get-all",
    }
} as const;

// Redux / Context Action Types
export const STATE_ACTIONS = {
    PLAYBACK: {
        SET_STATUS: "PLAYBACK_SET_STATUS", // Playing, Paused, Buffer
        UPDATE_TIME: "PLAYBACK_UPDATE_TIME",
        SET_DURATION: "PLAYBACK_SET_DURATION",
    },
    PLAYLIST: {
        ADD: "PLAYLIST_ADD_TRACK",
        REMOVE: "PLAYLIST_REMOVE_TRACK",
        SHUFFLE: "PLAYLIST_SHUFFLE",
        CLEAR: "PLAYLIST_CLEAR",
    },
    SETTINGS: {
        UPDATE: "SETTINGS_UPDATE_KEY",
        RESET: "SETTINGS_RESET_ALL",
    }
} as const;
