/**
 * Project: KNOUX Player X™
 * Layer: UI -> Global Error Handler
 */

import React, { useEffect } from "react";

const GlobalErrorHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            console.error("Global error:", event.error);
        };
        const handleRejection = (event: PromiseRejectionEvent) => {
            console.error("Unhandled rejection:", event.reason);
        };
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);
        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, []);

    return <>{children}</>;
};

export default GlobalErrorHandler;
