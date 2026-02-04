/**
 * Project: KNOUX Player X™
 * Layer: UI -> Media Browser View
 */

import React from "react";
import MediaLibrary from "../../components/library/MediaLibrary";

import "../../../styles/views/MediaBrowserView.scss";

const MediaBrowserView: React.FC = () => {
    return (
        <section className="media-browser-view">
            <header>
                <h2>Browse Media</h2>
                <p>Quickly import and preview media sources.</p>
            </header>
            <MediaLibrary />
        </section>
    );
};

export default MediaBrowserView;
