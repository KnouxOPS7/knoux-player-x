/**
 * Project: KNOUX Player X™
 * Layer: State -> Selectors
 */

import { RootState } from "../store";
import { neonPurpleTheme } from "../../themes/neonPurple";
import { neonCyanTheme } from "../../themes/neonCyan";

const themeMap = {
    "neon-purple": neonPurpleTheme,
    "neon-cyan": neonCyanTheme
};

export const selectTheme = (state: RootState) => {
    const baseTheme = themeMap[state.theme.name];
    return {
        ...baseTheme,
        glassmorphism: state.theme.glassmorphism,
        neonEffects: state.theme.neonEffects
    };
};
