/**
 * Project: KNOUX Player X™
 * Layer: UI -> Playlist Item
 */

import React from "react";
import { ITrack } from "../../../types/media";

interface PlaylistItemProps {
    track: ITrack;
    isActive: boolean;
    onSelect: () => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
    track,
    isActive,
    onSelect,
    onRemove,
    onMoveUp,
    onMoveDown
}) => {
    return (
        <div className={`playlist-item ${isActive ? "active" : ""}`}>
            <button type="button" className="playlist-item__main" onClick={onSelect}>
                <span className="playlist-item__title">{track.metadata.title}</span>
                <span className="playlist-item__subtitle">{track.filename}</span>
            </button>
            <div className="playlist-item__actions">
                <button type="button" onClick={onMoveUp} aria-label="Move up">
                    ↑
                </button>
                <button type="button" onClick={onMoveDown} aria-label="Move down">
                    ↓
                </button>
                <button type="button" onClick={onRemove} aria-label="Remove">
                    ✕
                </button>
            </div>
        </div>
    );
};

export default PlaylistItem;
