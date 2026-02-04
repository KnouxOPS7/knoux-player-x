/**
 * Project: KNOUX Player X™
 * Layer: UI -> Playlist View
 */

import React from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
    clearPlaylist,
    moveTrack,
    removeTrack,
    setCurrentIndex,
    setRepeat,
    toggleShuffle
} from "../../../state/slices/playlistSlice";
import PlaylistHeader from "./PlaylistHeader";
import PlaylistControls from "./PlaylistControls";
import PlaylistItem from "./PlaylistItem";
import { play } from "../../../state/slices/playbackSlice";

import "../../../styles/views/PlaylistView.scss";

const PlaylistView: React.FC = () => {
    const dispatch = useAppDispatch();
    const playlist = useAppSelector((state) => state.playlist);

    const handleSelect = (index: number) => {
        dispatch(setCurrentIndex(index));
        dispatch(play());
    };

    const handleRepeat = () => {
        const next = playlist.repeat === "none" ? "all" : playlist.repeat === "all" ? "one" : "none";
        dispatch(setRepeat(next));
    };

    return (
        <section className="playlist-view">
            <PlaylistHeader count={playlist.tracks.length} />
            <PlaylistControls
                onClear={() => dispatch(clearPlaylist())}
                onShuffle={() => dispatch(toggleShuffle())}
                onRepeat={handleRepeat}
                isShuffle={playlist.shuffle}
                repeatMode={playlist.repeat}
            />
            <div className="playlist-items">
                {playlist.tracks.length === 0 && <p>No tracks in playlist.</p>}
                {playlist.tracks.map((track, index) => (
                    <PlaylistItem
                        key={track.id}
                        track={track}
                        isActive={index === playlist.currentIndex}
                        onSelect={() => handleSelect(index)}
                        onRemove={() => dispatch(removeTrack(track.id))}
                        onMoveUp={() => dispatch(moveTrack({ fromIndex: index, toIndex: Math.max(0, index - 1) }))}
                        onMoveDown={() =>
                            dispatch(moveTrack({ fromIndex: index, toIndex: Math.min(playlist.tracks.length - 1, index + 1) }))
                        }
                    />
                ))}
            </div>
        </section>
    );
};

export default PlaylistView;
