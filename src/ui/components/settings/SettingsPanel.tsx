/**
 * Project: KNOUX Player X™
 * Layer: UI -> Settings Panel
 */

import React from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { setAudioDevice, setHardwareAccel, setThemeMode } from "../../../state/slices/settingsSlice";
import { setGlassmorphism, setNeonEffects, setThemeName } from "../../../state/slices/themeSlice";
import { setLocale } from "../../../state/slices/localizationSlice";

const SettingsPanel: React.FC = () => {
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings);
    const theme = useAppSelector((state) => state.theme);
    const locale = useAppSelector((state) => state.localization.locale);

    return (
        <div className="settings-panel">
            <section>
                <h3>Appearance</h3>
                <label>
                    Theme
                    <select
                        value={theme.name}
                        onChange={(event) => dispatch(setThemeName(event.target.value as "neon-purple" | "neon-cyan"))}
                    >
                        <option value="neon-purple">Neon Purple</option>
                        <option value="neon-cyan">Neon Cyan</option>
                    </select>
                </label>
                <label>
                    Theme Mode
                    <select
                        value={settings.themeMode}
                        onChange={(event) =>
                            dispatch(setThemeMode(event.target.value as "light" | "dark" | "system"))
                        }
                    >
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </label>
                <label>
                    Glassmorphism
                    <input
                        type="checkbox"
                        checked={theme.glassmorphism}
                        onChange={(event) => dispatch(setGlassmorphism(event.target.checked))}
                    />
                </label>
                <label>
                    Neon Effects
                    <input
                        type="checkbox"
                        checked={theme.neonEffects}
                        onChange={(event) => dispatch(setNeonEffects(event.target.checked))}
                    />
                </label>
            </section>

            <section>
                <h3>Playback</h3>
                <label>
                    Audio Device
                    <input
                        value={settings.audioDevice}
                        onChange={(event) => dispatch(setAudioDevice(event.target.value))}
                        placeholder="Default"
                    />
                </label>
                <label>
                    Hardware Acceleration
                    <input
                        type="checkbox"
                        checked={settings.hardwareAccel}
                        onChange={(event) => dispatch(setHardwareAccel(event.target.checked))}
                    />
                </label>
            </section>

            <section>
                <h3>Language</h3>
                <label>
                    Locale
                    <select value={locale} onChange={(event) => dispatch(setLocale(event.target.value as "en" | "ar"))}>
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                    </select>
                </label>
            </section>
        </div>
    );
};

export default SettingsPanel;
