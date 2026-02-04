/**
 * Project: KNOUX Player X™
 * Layer: State -> Selectors
 */

import { RootState } from "../store";
import { PlayerStatus } from "../../types/media";

export const selectPlayback = (state: RootState) => state.playback;

export const selectPlaybackStatus = (state: RootState) => ({
    isPlaying: state.playback.status === PlayerStatus.PLAYING,
    currentTime: state.playback.currentTime,
    duration: state.playback.duration,
    volume: state.playback.volume,
    buffering: state.playback.buffering || state.playback.status === PlayerStatus.BUFFERING,
    warnings: state.playback.warnings,
    errors: state.playback.errors
});
