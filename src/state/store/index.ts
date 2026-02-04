/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Layer: State -> Store Configuration
 */

import { configureStore } from "@reduxjs/toolkit";
import { knouxLogger } from "../middleware/logger";
import { persistenceMiddleware, loadPersistedState } from "../middleware/persistence";

// Import Slices (These files are assumed to exist or will be generated next step)
// NOTE: For now, we import empty reducers placeholder logic until Slices script runs.
import appReducer from "../slices/appSlice";
import playbackReducer from "../slices/playbackSlice"; // Future generation
import playlistReducer from "../slices/playlistSlice"; // Future generation
import settingsReducer from "../slices/settingsSlice"; // Future generation
import themeReducer from "../slices/themeSlice";
import localizationReducer from "../slices/localizationSlice";
import networkReducer from "../slices/networkSlice";
import updateReducer from "../slices/updateSlice";

const preloadedState = loadPersistedState();

export const store = configureStore({
    reducer: {
        app: appReducer,
        playback: playbackReducer,
        playlist: playlistReducer,
        settings: settingsReducer,
        theme: themeReducer,
        localization: localizationReducer,
        network: networkReducer,
        update: updateReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false, // Important for non-serializable Media Objects in Electron
        }).concat(knouxLogger, persistenceMiddleware),
    preloadedState,
    devTools: process.env.NODE_ENV !== "production"
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
