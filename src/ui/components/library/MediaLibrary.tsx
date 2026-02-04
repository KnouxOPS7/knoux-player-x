/**
 * Project: KNOUX Player X™
 * Layer: UI -> Media Library
 */

import React from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { addTrack, parseTrackMetadata, setCurrentIndex } from "../../../state/slices/playlistSlice";
import { play } from "../../../state/slices/playbackSlice";
import { generateUUID } from "../../../utils/uuid";
import { ITrack } from "../../../types/media";

const buildTrack = (file: File): { track: ITrack; filePath?: string } => {
    const id = generateUUID();
    const extension = file.name.split(".").pop() ?? "";
    const filePath = (file as File & { path?: string }).path;
    const normalizedPath = filePath ? `knoux://${filePath.replace(/\\/g, "/")}` : URL.createObjectURL(file);
    return {
        track: {
            id,
            uuid: id,
            path: normalizedPath,
            filename: file.name,
            extension,
            sizeBytes: file.size,
            metadata: {
                title: file.name,
                bitrate: 0,
                durationSec: 0,
                hasCoverArt: false
            }
        },
        filePath
    };
};

const MediaLibrary: React.FC = () => {
    const dispatch = useAppDispatch();
    const playlist = useAppSelector((state) => state.playlist);

    const handleAddFiles = (files: FileList | null) => {
        if (!files) {
            return;
        }
        Array.from(files).forEach((file) => {
            const { track, filePath } = buildTrack(file);
            dispatch(addTrack(track));
            dispatch(parseTrackMetadata({ trackId: track.id, filePath }));
        });
    };

    const handleSelect = (index: number) => {
        dispatch(setCurrentIndex(index));
        dispatch(play());
    };

    return (
        <div className="media-library">
            <div className="media-library__controls">
                <label className="media-library__upload">
                    Add Media
                    <input type="file" multiple accept="audio/*,video/*" onChange={(event) => handleAddFiles(event.target.files)} />
                </label>
            </div>
            <div className="media-library__list">
                {playlist.tracks.length === 0 && <p>No media in library. Add files to get started.</p>}
                {playlist.tracks.map((track, index) => (
                    <button
                        type="button"
                        key={track.id}
                        className={`media-library__item ${index === playlist.currentIndex ? "active" : ""}`}
                        onClick={() => handleSelect(index)}
                    >
                        <span>{track.metadata.title}</span>
                        <span className="media-library__meta">{track.filename}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MediaLibrary;
