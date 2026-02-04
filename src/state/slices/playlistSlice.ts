/**
 * Project: KNOUX Player X™
 * Layer: State -> Playlist Slice
 */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlaylistState } from "../../types/state";
import { ITrack } from "../../types/media";

const initialState: IPlaylistState = {
    tracks: [],
    currentIndex: -1,
    queue: [],
    shuffle: false,
    repeat: "none"
};

export const parseTrackMetadata = createAsyncThunk(
    "playlist/parseTrackMetadata",
    async (payload: { trackId: string; filePath?: string | null }) => {
        if (!payload.filePath || !window.knouxAPI?.media?.getMetadata) {
            return null;
        }
        const metadata = await window.knouxAPI.media.getMetadata(payload.filePath);
        return { trackId: payload.trackId, metadata };
    }
);

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        addTrack(state, action: PayloadAction<ITrack>) {
            state.tracks.push(action.payload);
            state.queue.push(action.payload.id);
            if (state.currentIndex === -1) {
                state.currentIndex = 0;
            }
        },
        removeTrack(state, action: PayloadAction<string>) {
            state.tracks = state.tracks.filter((track) => track.id !== action.payload);
            state.queue = state.queue.filter((id) => id !== action.payload);
            if (state.currentIndex >= state.tracks.length) {
                state.currentIndex = state.tracks.length - 1;
            }
        },
        setCurrentIndex(state, action: PayloadAction<number>) {
            const nextIndex = Math.max(-1, Math.min(state.tracks.length - 1, action.payload));
            state.currentIndex = nextIndex;
        },
        toggleShuffle(state) {
            state.shuffle = !state.shuffle;
        },
        setRepeat(state, action: PayloadAction<IPlaylistState["repeat"]>) {
            state.repeat = action.payload;
        },
        moveTrack(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
            const { fromIndex, toIndex } = action.payload;
            if (
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex >= state.tracks.length ||
                toIndex >= state.tracks.length ||
                fromIndex === toIndex
            ) {
                return;
            }
            const [track] = state.tracks.splice(fromIndex, 1);
            state.tracks.splice(toIndex, 0, track);
            const [queued] = state.queue.splice(fromIndex, 1);
            state.queue.splice(toIndex, 0, queued);
            if (state.currentIndex === fromIndex) {
                state.currentIndex = toIndex;
            } else if (state.currentIndex >= Math.min(fromIndex, toIndex) && state.currentIndex <= Math.max(fromIndex, toIndex)) {
                state.currentIndex += fromIndex < toIndex ? -1 : 1;
            }
        },
        clearPlaylist(state) {
            state.tracks = [];
            state.queue = [];
            state.currentIndex = -1;
        },
        updateTrackMetadata(state, action: PayloadAction<{ trackId: string; metadata: ITrack["metadata"] }>) {
            const track = state.tracks.find((item) => item.id === action.payload.trackId);
            if (track) {
                track.metadata = { ...track.metadata, ...action.payload.metadata };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(parseTrackMetadata.fulfilled, (state, action) => {
            if (!action.payload) {
                return;
            }
            const track = state.tracks.find((item) => item.id === action.payload.trackId);
            if (track) {
                track.metadata = { ...track.metadata, ...action.payload.metadata };
            }
        });
    }
});

export const {
    addTrack,
    removeTrack,
    setCurrentIndex,
    toggleShuffle,
    setRepeat,
    moveTrack,
    clearPlaylist,
    updateTrackMetadata
} = playlistSlice.actions;

export default playlistSlice.reducer;
