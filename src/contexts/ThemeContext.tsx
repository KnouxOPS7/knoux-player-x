/**
 * Project: KNOUX Player X™
 * Layer: UI -> Theme Context
 */

import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../state/selectors/themeSelectors";
import { neonPurpleTheme } from "../themes/neonPurple";

export type ThemeContextValue = ReturnType<typeof selectTheme>;

const ThemeContext = createContext<ThemeContextValue>({
    ...neonPurpleTheme,
    glassmorphism: true,
    neonEffects: true
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useSelector(selectTheme);

    return (
        <ThemeContext.Provider value={{ ...theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
