/**
 * Project: KNOUX Player X™
 * Layer: UI -> Localization Context
 */

import React, { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLocale } from "../state/selectors/localizationSelectors";
import enCommon from "../localization/en/common.json";
import enSettings from "../localization/en/settings.json";
import arCommon from "../localization/ar/common.json";
import arSettings from "../localization/ar/settings.json";

type Dictionary = Record<string, any>;

const dictionaries: Record<string, Dictionary> = {
    en: { ...enCommon, ...enSettings },
    ar: { ...arCommon, ...arSettings }
};

interface LocalizationContextValue {
    locale: "en" | "ar";
    t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextValue>({
    locale: "en",
    t: (key) => key
});

const resolveKey = (dictionary: Dictionary, key: string): string | undefined => {
    const path = key.split(".");
    let current: any = dictionary;
    for (const segment of path) {
        if (current && typeof current === "object" && segment in current) {
            current = current[segment];
        } else {
            return undefined;
        }
    }
    return typeof current === "string" ? current : undefined;
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const locale = useSelector(selectLocale);
    const dictionary = dictionaries[locale] ?? dictionaries.en;

    const value = useMemo<LocalizationContextValue>(() => {
        return {
            locale,
            t: (key: string) => resolveKey(dictionary, key) ?? key
        };
    }, [locale, dictionary]);

    return (
        <LocalizationContext.Provider value={value}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    return useContext(LocalizationContext);
};
