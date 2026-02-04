/**
 * Project: KNOUX Player X™
 * Layer: State -> Update Slice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUpdateState } from "../../types/state";

const initialState: IUpdateState = {
    available: false,
    version: null,
    lastChecked: null,
    releaseNotes: undefined
};

const updateSlice = createSlice({
    name: "update",
    initialState,
    reducers: {
        setUpdateAvailable(
            state,
            action: PayloadAction<{ available: boolean; version?: string | null; releaseNotes?: string }>
        ) {
            state.available = action.payload.available;
            state.version = action.payload.version ?? null;
            state.releaseNotes = action.payload.releaseNotes;
            state.lastChecked = Date.now();
        },
        markUpdateChecked(state) {
            state.lastChecked = Date.now();
        }
    }
});

export const { setUpdateAvailable, markUpdateChecked } = updateSlice.actions;

export default updateSlice.reducer;
