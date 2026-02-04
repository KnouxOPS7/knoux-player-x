/**
 * Project: KNOUX Player X™
 * Layer: State -> Network Hook
 */

import { useEffect } from "react";
import { useAppDispatch } from "./index";
import { setConnectionState } from "../slices/networkSlice";

const getConnectionType = (): "offline" | "wifi" | "ethernet" | "unknown" => {
    const connection = (navigator as any).connection;
    if (!navigator.onLine) {
        return "offline";
    }
    if (connection?.type === "wifi") {
        return "wifi";
    }
    if (connection?.type === "ethernet") {
        return "ethernet";
    }
    return "unknown";
};

export const useNetworkStatus = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const update = () => {
            dispatch(
                setConnectionState({
                    isConnected: navigator.onLine,
                    connectionType: getConnectionType()
                })
            );
        };
        update();
        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        };
    }, [dispatch]);
};
