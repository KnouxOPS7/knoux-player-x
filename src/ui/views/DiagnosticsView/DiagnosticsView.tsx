/**
 * Project: KNOUX Player X™
 * Layer: UI -> Diagnostics View
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ISystemDiagnostics } from "../../../types/electron";

const DiagnosticsView: React.FC = () => {
    const [diagnostics, setDiagnostics] = useState<ISystemDiagnostics | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        let timer: ReturnType<typeof setInterval> | null = null;
        const loadDiagnostics = async () => {
            try {
                if (!window.knouxAPI?.system?.getDiagnostics) {
                    throw new Error("Diagnostics API is unavailable.");
                }
                const data = await window.knouxAPI.system.getDiagnostics();
                if (mounted) {
                    setDiagnostics(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Failed to load diagnostics.");
                }
            }
        };
        loadDiagnostics();
        timer = setInterval(loadDiagnostics, 1000);
        return () => {
            mounted = false;
            if (timer) {
                clearInterval(timer);
            }
        };
    }, []);

    return (
        <section className="diagnostics-view">
            <header>
                <h2>System Diagnostics</h2>
                <p>Real-time system and application telemetry.</p>
            </header>

            {error && <p className="diagnostics-view__error">{error}</p>}

            {diagnostics ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="diagnostics-view__grid"
                >
                    <div>
                        <strong>CPU Load</strong>
                        <span>{diagnostics.cpuLoad.toFixed(2)}%</span>
                    </div>
                    <div>
                        <strong>RAM Usage</strong>
                        <span>{Math.round(diagnostics.ramUsage / 1024 / 1024)} MB</span>
                    </div>
                    <div>
                        <strong>Total Memory</strong>
                        <span>{Math.round(diagnostics.totalMemory / 1024 / 1024)} MB</span>
                    </div>
                    <div>
                        <strong>Free Memory</strong>
                        <span>{Math.round(diagnostics.freeMemory / 1024 / 1024)} MB</span>
                    </div>
                    <div>
                        <strong>GPU</strong>
                        <span>{diagnostics.gpuModel ?? "Unknown"}</span>
                    </div>
                    <div>
                        <strong>App Version</strong>
                        <span>{diagnostics.appVersion}</span>
                    </div>
                    <div>
                        <strong>Platform</strong>
                        <span>
                            {diagnostics.platform} ({diagnostics.arch})
                        </span>
                    </div>
                    <div>
                        <strong>Uptime</strong>
                        <span>{Math.round(diagnostics.uptimeSec)}s</span>
                    </div>
                    <div>
                        <strong>Network</strong>
                        <span>{diagnostics.networkInterfaces.join(", ") || "None"}</span>
                    </div>
                </motion.div>
            ) : (
                !error && <p>Loading diagnostics...</p>
            )}
        </section>
    );
};

export default DiagnosticsView;
