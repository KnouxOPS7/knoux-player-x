/**
 * Project: KNOUX Player X™
 * Layer: State -> Player Hook
 */

import { useAppDispatch, useAppSelector } from "./index";
import {
    pause,
    play,
    seekTo,
    setPlaybackRate,
    setVolume,
    toggleMuted,
    togglePlay
} from "../slices/playbackSlice";

export const usePlayer = () => {
    const dispatch = useAppDispatch();
    const playback = useAppSelector((state) => state.playback);

    return {
        playback,
        play: () => dispatch(play()),
        pause: () => dispatch(pause()),
        togglePlay: () => dispatch(togglePlay()),
        seek: (time: number) => dispatch(seekTo(time)),
        setPlaybackRate: (rate: number) => dispatch(setPlaybackRate(rate)),
        setVolume: (volume: number) => dispatch(setVolume(volume)),
        toggleMuted: () => dispatch(toggleMuted())
    };
};

export default usePlayer;
