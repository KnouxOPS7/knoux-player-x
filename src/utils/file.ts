/**
 * Utility functions for file path manipulation (Frontend friendly).
 */

export const getExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
};

export const getFilenameFromPath = (fullpath: string): string => {
    // Basic regex handling for windows/unix paths
    return fullpath.replace(/^.*[\\\/]/, "");
};

/**
 * Validates if file is a supported media type based on extension constants.
 * Note: Should use logic from constants/config in real implementation.
 */
export const isVideo = (ext: string): boolean => {
    const videoExts = ["mp4", "mkv", "avi", "webm", "mov"];
    return videoExts.includes(ext.replace(".", "").toLowerCase());
};
