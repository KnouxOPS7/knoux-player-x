/**
 * Project: KNOUX Player X™
 * Layer: Utils -> Performance
 */

type WebVitalMetric = {
    name: string;
    value: number;
};

export const measureRender = (component: string, duration: number) => {
    if (process.env.NODE_ENV === "development") {
        console.debug(`[Render] ${component}: ${duration.toFixed(2)}ms`);
    }
};

export const reportWebVitals = (onPerfEntry?: (metric: WebVitalMetric) => void) => {
    if (!onPerfEntry) {
        return;
    }
    if (typeof window === "undefined") {
        return;
    }
    const now = performance.now();
    onPerfEntry({ name: "bootstrap", value: now });
};
