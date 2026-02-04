/**
 * Project: KNOUX Player X™
 * Layer: State -> App Slice
 */

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface AppState {
    currentView: string;
    isInitialized: boolean;
}

const initialState: AppState = {
    currentView: "player",
    isInitialized: false
};

export const initializeApp = createAsyncThunk("app/initialize", async () => {
    return true;
});

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setCurrentView(state, action: PayloadAction<string>) {
            state.currentView = action.payload;
        },
        setInitialized(state, action: PayloadAction<boolean>) {
            state.isInitialized = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true;
        });
    }
});

export const { setCurrentView, setInitialized } = appSlice.actions;

export default appSlice.reducer;
