/**
 * Project: KNOUX Player X™
 * Layer: State -> Selectors
 */

import { RootState } from "../store";

export const selectNetworkStatus = (state: RootState) => state.network;
