/**
 * Project: KNOUX Player X™
 * Layer: UI -> Error Fallback
 */

import React from "react";

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="error-fallback">
            <h2>Something went wrong</h2>
            <pre>{error.message}</pre>
            <button type="button" onClick={resetErrorBoundary}>
                Reload
            </button>
        </div>
    );
};

export default ErrorFallback;
