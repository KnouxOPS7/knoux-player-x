/**
 * Project: KNOUX Player X™
 * Layer: UI -> Player View
 */

import React from "react";
import Player from "../../components/player/Player";
import { ControlsBar } from "../../components/player/ControlsBar";
import { useAppSelector } from "../../../state/hooks";
import { PlayerStatus } from "../../../types/media";

import "../../../styles/views/PlayerView.scss";

const PlayerView: React.FC = () => {
    const playback = useAppSelector((state) => state.playback);
    const playlist = useAppSelector((state) => state.playlist);
    const network = useAppSelector((state) => state.network);
    const currentTrack = playlist.tracks[playlist.currentIndex] ?? null;

    return (
        <section className="player-view">
            <header className="player-view__header">
                <div>
                    <h2>{currentTrack?.metadata?.title ?? "No media selected"}</h2>
                    <p>{currentTrack?.filename ?? "Select media from the library"}</p>
                </div>
                <div className="player-view__status">
                    {!network.isConnected && <span className="status-pill">Offline</span>}
                    {playback.status === PlayerStatus.BUFFERING && <span className="status-pill">Buffering</span>}
                </div>
            </header>

            <div className="player-view__content">
                <Player
                    source={currentTrack?.path ?? null}
                    title={currentTrack?.metadata?.title}
                    subtitle={currentTrack?.subtitle ?? null}
                />
            </div>
            {playback.errors.length > 0 && (
                <div className="player-view__error">
                    {playback.errors[playback.errors.length - 1]}
                </div>
            )}

            <ControlsBar visible />
        </section>
    );
};

export default PlayerView;
