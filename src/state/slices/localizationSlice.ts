/**
 * Project: KNOUX Player X™
 * Layer: State -> Localization Slice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocalizationState {
    locale: "en" | "ar";
}

const initialState: LocalizationState = {
    locale: "en"
};

const localizationSlice = createSlice({
    name: "localization",
    initialState,
    reducers: {
        setLocale(state, action: PayloadAction<LocalizationState["locale"]>) {
            state.locale = action.payload;
        }
    }
});

export const { setLocale } = localizationSlice.actions;

export default localizationSlice.reducer;
