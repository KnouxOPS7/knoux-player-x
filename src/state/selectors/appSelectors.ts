/**
 * Project: KNOUX Player X™
 * Layer: State -> Selectors
 */

import { RootState } from "../store";

export const selectCurrentView = (state: RootState) => state.app.currentView;
export const selectIsInitialized = (state: RootState) => state.app.isInitialized;
