/**
 * Formats seconds into HH:MM:SS string.
 * @param seconds Total seconds (float or int)
 * @returns string "00:00" or "00:00:00"
 */
export const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const mm = m < 10 ? `0${m}` : m;
    const ss = s < 10 ? `0${s}` : s;

    return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
