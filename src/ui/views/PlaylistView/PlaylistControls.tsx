/**
 * Project: KNOUX Player X™
 * Layer: UI -> Playlist Controls
 */

import React from "react";

interface PlaylistControlsProps {
    onClear: () => void;
    onShuffle: () => void;
    onRepeat: () => void;
    isShuffle: boolean;
    repeatMode: "none" | "one" | "all";
}

const PlaylistControls: React.FC<PlaylistControlsProps> = ({
    onClear,
    onShuffle,
    onRepeat,
    isShuffle,
    repeatMode
}) => {
    return (
        <div className="playlist-controls">
            <button type="button" onClick={onShuffle}>
                Shuffle: {isShuffle ? "On" : "Off"}
            </button>
            <button type="button" onClick={onRepeat}>
                Repeat: {repeatMode}
            </button>
            <button type="button" onClick={onClear}>
                Clear
            </button>
        </div>
    );
};

export default PlaylistControls;
