/**
 * Project: KNOUX Player X™
 * Layer: State -> Selectors
 */

import { RootState } from "../store";

export const selectUpdateStatus = (state: RootState) => state.update;
