/**
 * Project: KNOUX Player X™
 * Layer: State -> Settings Slice
 */

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ISettingsState } from "../../types/state";

const initialState: ISettingsState = {
    themeMode: "system",
    audioDevice: "default",
    hardwareAccel: true
};

export const loadUserPreferences = createAsyncThunk(
    "settings/loadUserPreferences",
    async () => {
        try {
            const stored = localStorage.getItem("KNOUX_SETTINGS_V1");
            if (!stored) {
                return null;
            }
            return JSON.parse(stored) as Partial<ISettingsState>;
        } catch (error) {
            console.warn("Failed to load user preferences:", error);
            return null;
        }
    }
);

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setThemeMode(state, action: PayloadAction<ISettingsState["themeMode"]>) {
            state.themeMode = action.payload;
        },
        setAudioDevice(state, action: PayloadAction<string>) {
            state.audioDevice = action.payload;
        },
        setHardwareAccel(state, action: PayloadAction<boolean>) {
            state.hardwareAccel = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadUserPreferences.fulfilled, (state, action) => {
            if (action.payload) {
                Object.assign(state, action.payload);
            }
        });
    }
});

export const { setThemeMode, setAudioDevice, setHardwareAccel } = settingsSlice.actions;

export default settingsSlice.reducer;
