/**
 * Project: KNOUX Player X™
 * Layer: State -> Selectors
 */

import { RootState } from "../store";

export const selectLocale = (state: RootState) => state.localization.locale;
