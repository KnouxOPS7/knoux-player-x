/**
 * Project: KNOUX Player X™
 * Layer: UI -> Playlist Header
 */

import React from "react";

interface PlaylistHeaderProps {
    count: number;
}

const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ count }) => {
    return (
        <div className="playlist-header">
            <div>
                <h2>Playlist</h2>
                <p>{count} item(s)</p>
            </div>
        </div>
    );
};

export default PlaylistHeader;
