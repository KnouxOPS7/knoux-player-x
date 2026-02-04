/**
 * Project: KNOUX Player X™
 * Layer: State -> Settings Hook
 */

import { useAppDispatch, useAppSelector } from "./index";
import { setAudioDevice, setHardwareAccel, setThemeMode } from "../slices/settingsSlice";

export const useSettings = () => {
    const settings = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();

    return {
        settings,
        setThemeMode: (mode: "light" | "dark" | "system") => dispatch(setThemeMode(mode)),
        setAudioDevice: (device: string) => dispatch(setAudioDevice(device)),
        setHardwareAccel: (enabled: boolean) => dispatch(setHardwareAccel(enabled))
    };
};
