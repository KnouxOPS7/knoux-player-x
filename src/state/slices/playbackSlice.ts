/**
 * Project: KNOUX Player X™
 * Layer: State -> Playback Slice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlaybackState } from "../../types/state";
import { PlayerStatus } from "../../types/media";

const initialState: IPlaybackState = {
    status: PlayerStatus.IDLE,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isMuted: false,
    buffering: false,
    warnings: [],
    errors: []
};

const playbackSlice = createSlice({
    name: "playback",
    initialState,
    reducers: {
        play(state) {
            state.status = PlayerStatus.PLAYING;
            state.buffering = false;
        },
        pause(state) {
            state.status = PlayerStatus.PAUSED;
            state.buffering = false;
        },
        stop(state) {
            state.status = PlayerStatus.STOPPED;
            state.currentTime = 0;
            state.buffering = false;
        },
        togglePlay(state) {
            if (state.status === PlayerStatus.PLAYING) {
                state.status = PlayerStatus.PAUSED;
            } else {
                state.status = PlayerStatus.PLAYING;
            }
            state.buffering = false;
        },
        seekTo(state, action: PayloadAction<number>) {
            state.currentTime = Math.max(0, action.payload);
        },
        setDuration(state, action: PayloadAction<number>) {
            state.duration = Math.max(0, action.payload);
        },
        setVolume(state, action: PayloadAction<number>) {
            const nextVolume = Math.min(2, Math.max(0, action.payload));
            state.volume = nextVolume;
            if (nextVolume > 0) {
                state.isMuted = false;
            }
        },
        setPlaybackRate(state, action: PayloadAction<number>) {
            state.playbackRate = Math.max(0.25, Math.min(4, action.payload));
        },
        toggleMuted(state) {
            state.isMuted = !state.isMuted;
        },
        setBuffering(state, action: PayloadAction<boolean>) {
            state.buffering = action.payload;
            if (action.payload) {
                state.status = PlayerStatus.BUFFERING;
            }
        },
        addWarning(state, action: PayloadAction<string>) {
            state.warnings.push(action.payload);
        },
        addError(state, action: PayloadAction<string>) {
            state.errors.push(action.payload);
            state.status = PlayerStatus.ERROR;
        },
        clearWarnings(state) {
            state.warnings = [];
        },
        clearErrors(state) {
            state.errors = [];
        }
    }
});

export const {
    play,
    pause,
    stop,
    togglePlay,
    seekTo,
    setDuration,
    setVolume,
    setPlaybackRate,
    toggleMuted,
    setBuffering,
    addWarning,
    addError,
    clearWarnings,
    clearErrors
} = playbackSlice.actions;

export default playbackSlice.reducer;
