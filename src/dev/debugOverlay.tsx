import React from "react";
import { useAppSelector } from "../state/hooks/index";

export const DebugOverlay: React.FC = () => {
    const playback = useAppSelector(state => state.playback);
    const performance = { fps: 60, memory: "128MB" }; // Mock for visual

    if (process.env.NODE_ENV === "production") return null;

    return (
        <div style={{
            position: "fixed", top: 10, right: 10,
            background: "rgba(0,0,0,0.8)", color: "#0f0",
            padding: 10, fontSize: 10, fontFamily: "monospace",
            pointerEvents: "none", zIndex: 9999
        }}>
            <p>STATUS: {playback.status}</p>
            <p>TIME: {playback.currentTime.toFixed(2)}s</p>
            <p>FPS: {performance.fps}</p>
        </div>
    );
};
