/**
 * Project: KNOUX Player X™
 * File: constants.ts
 * Purpose: Central repository of static application values. These values
 * are imported by the UI, services, and plugin system to ensure consistency.
 */
export const APP_NAME = 'KNOUX Player X™';
export const APP_VERSION = '1.0.0'; // Bump with release workflow

// Network/HTTP API root
export const API_ROOT = "https://api.knoux.player/v1";

// Audio & Media constants
export const AUDIO_BUFFER_SIZE_MS = 100;        // Target buffer size for live DSP
export const AUDIO_SUPPORTED_EXTENSIONS = ['.mp3', '.flac', '.wav', '.aac', '.opus'];

// Video & File constants
export const VIDEO_SUPPORTED_FORMATS = ['mp4', 'mkv', 'webm', 'mov', 'avi'];
export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

// Themes & UI
export const THEME_LIGHT = 'light';
export const THEME_DARK  = 'dark';
export const DEFAULT_THEME = THEME_DARK;

// Feature flags
export const FEATURE_DSP_ENABLED  = true;
export const FEATURE_VIRTUAL_FS   = false;
