/**
 * Clamps a number between min and max.
 */
export const clamp = (val: number, min: number, max: number): number => {
    return Math.min(Math.max(val, min), max);
};

/**
 * Linear interpolation.
 */
export const lerp = (start: number, end: number, amt: number): number => {
    return (1 - amt) * start + amt * end;
};

/**
 * Converts dB to linear volume gain (approx).
 */
export const dbToGain = (db: number): number => {
    return Math.pow(10, db / 20);
};
