/**
 * Project: KNOUX Player X™
 * Layer: UI -> Library View
 */

import React from "react";
import MediaLibrary from "../../components/library/MediaLibrary";

import "../../../styles/views/LibraryView.scss";

const LibraryView: React.FC = () => {
    return (
        <section className="library-view">
            <header>
                <h2>Media Library</h2>
                <p>Manage and select your media files.</p>
            </header>
            <MediaLibrary />
        </section>
    );
};

export default LibraryView;
