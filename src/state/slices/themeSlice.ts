/**
 * Project: KNOUX Player X™
 * Layer: State -> Theme Slice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
    name: "neon-purple" | "neon-cyan";
    glassmorphism: boolean;
    neonEffects: boolean;
}

const initialState: ThemeState = {
    name: "neon-purple",
    glassmorphism: true,
    neonEffects: true
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setThemeName(state, action: PayloadAction<ThemeState["name"]>) {
            state.name = action.payload;
        },
        setGlassmorphism(state, action: PayloadAction<boolean>) {
            state.glassmorphism = action.payload;
        },
        setNeonEffects(state, action: PayloadAction<boolean>) {
            state.neonEffects = action.payload;
        }
    }
});

export const { setThemeName, setGlassmorphism, setNeonEffects } = themeSlice.actions;

export default themeSlice.reducer;
