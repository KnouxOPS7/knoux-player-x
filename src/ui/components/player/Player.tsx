/**
 * Project: KNOUX Player X™
 * Layer: UI -> Player Component
 */

import React, { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
    addError,
    pause,
    play,
    seekTo,
    setBuffering,
    setDuration
} from "../../../state/slices/playbackSlice";
import { MediaController, SubtitleSource } from "../../../services/media/MediaController";
import { PlayerStatus } from "../../../types/media";

interface PlayerProps {
    source?: string | null;
    title?: string;
    subtitle?: SubtitleSource | null;
}

const Player: React.FC<PlayerProps> = ({ source, title, subtitle }) => {
    const dispatch = useAppDispatch();
    const playback = useAppSelector((state) => state.playback);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const controller = useMemo(() => new MediaController(), []);

    useEffect(() => {
        if (videoRef.current) {
            controller.attach(videoRef.current);
        }
    }, [controller]);

    useEffect(() => {
        if (source) {
            controller.load({ src: source });
        }
    }, [controller, source]);

    useEffect(() => {
        controller.setSubtitle(subtitle ?? null);
    }, [controller, subtitle]);

    useEffect(() => {
        controller.setPlaybackRate(playback.playbackRate);
    }, [controller, playback.playbackRate]);

    useEffect(() => {
        controller.setVolume(playback.volume);
    }, [controller, playback.volume]);

    useEffect(() => {
        controller.setMuted(playback.isMuted);
    }, [controller, playback.isMuted]);

    useEffect(() => {
        if (playback.status === PlayerStatus.PLAYING) {
            controller.play();
        }
        if (playback.status === PlayerStatus.PAUSED) {
            controller.pause();
        }
    }, [controller, playback.status]);

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }
        const delta = Math.abs(videoRef.current.currentTime - playback.currentTime);
        if (delta > 0.5) {
            controller.seek(playback.currentTime);
        }
    }, [controller, playback.currentTime]);

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }
        const element = videoRef.current;

        const handleLoadedMetadata = () => {
            dispatch(setDuration(element.duration || 0));
        };

        const handleTimeUpdate = () => {
            dispatch(seekTo(element.currentTime));
        };

        const handlePlay = () => {
            dispatch(play());
        };

        const handlePause = () => {
            dispatch(pause());
        };

        const handleWaiting = () => {
            dispatch(setBuffering(true));
        };

        const handlePlaying = () => {
            dispatch(setBuffering(false));
        };

        const handleError = () => {
            dispatch(addError("Playback error occurred"));
        };

        element.addEventListener("loadedmetadata", handleLoadedMetadata);
        element.addEventListener("timeupdate", handleTimeUpdate);
        element.addEventListener("play", handlePlay);
        element.addEventListener("pause", handlePause);
        element.addEventListener("waiting", handleWaiting);
        element.addEventListener("playing", handlePlaying);
        element.addEventListener("error", handleError);

        return () => {
            element.removeEventListener("loadedmetadata", handleLoadedMetadata);
            element.removeEventListener("timeupdate", handleTimeUpdate);
            element.removeEventListener("play", handlePlay);
            element.removeEventListener("pause", handlePause);
            element.removeEventListener("waiting", handleWaiting);
            element.removeEventListener("playing", handlePlaying);
            element.removeEventListener("error", handleError);
        };
    }, [dispatch]);

    return (
        <div className="player-surface">
            <video
                ref={videoRef}
                className="player-video"
                controls={false}
                aria-label={title ?? "Media player"}
            />
        </div>
    );
};

export default Player;
