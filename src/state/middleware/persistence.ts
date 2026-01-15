/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Syncs critical state slices (settings, playback position) to LocalStorage.
 * Note: Could be upgraded to IndexedDB for large playlists.
 */

import { Middleware } from "@reduxjs/toolkit";
import { IRootState } from "../../types/state";

const PERSIST_KEYS = ["settings", "playlist"]; // Only persist these slices

export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState() as IRootState;

    // Debounce logic could be added here for performance
    try {
        const persistedState = PERSIST_KEYS.reduce((acc, key) => {
            // @ts-ignore - dynamic key access
            if (state[key]) acc[key] = state[key];
            return acc;
        }, {} as any);

        localStorage.setItem("KNOUX_STATE_V1", JSON.stringify(persistedState));
    } catch (e) {
        console.error("Failed to save state persistence:", e);
    }

    return result;
};

// Helper to load state
export const loadPersistedState = (): Partial<IRootState> | undefined => {
    try {
        const serialized = localStorage.getItem("KNOUX_STATE_V1");
        if (serialized === null) return undefined;
        return JSON.parse(serialized);
    } catch (e) {
        console.warn("Could not load persisted state", e);
        return undefined;
    }
};
