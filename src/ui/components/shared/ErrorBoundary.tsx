/**
 * Project: KNOUX Player X™
 * Layer: UI -> Error Boundary
 */

import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
    onError?: (error: Error) => void;
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error) {
        console.error("UI error boundary:", error);
        this.props.onError?.(error);
    }

    resetErrorBoundary = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };

    render() {
        const { hasError, error } = this.state;
        if (hasError && error) {
            if (this.props.FallbackComponent) {
                return <this.props.FallbackComponent error={error} resetErrorBoundary={this.resetErrorBoundary} />;
            }
            return <div>Something went wrong.</div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
