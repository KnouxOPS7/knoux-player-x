// Settings Manager
// Version: 1.0.0

import { z } from 'zod';
import { SettingsSchema } from './SettingsSchema';
import { SettingsMigration } from './SettingsMigration';

export interface Settings {
    playback: {
        autoPlay: boolean;
        loop: boolean;
        shuffle: boolean;
        playbackSpeed: number;
        rememberPosition: boolean;
    };
    audio: {
        volume: number;
        balance: number;
        equalizerPreset: string;
        spatialAudio: boolean;
    };
    video: {
        brightness: number;
        contrast: number;
        saturation: number;
        hue: number;
        deinterlace: boolean;
    };
    subtitle: {
        fontSize: number;
        fontColor: string;
        backgroundColor: string;
        syncOffset: number;
    };
    interface: {
        theme: 'neon-purple' | 'neon-cyan' | 'dark' | 'light';
        language: 'en' | 'ar';
        showThumbnails: boolean;
        glassEffect: boolean;
        animationSpeed: 'fast' | 'normal' | 'slow';
    };
    shortcuts: {
        [key: string]: string;
    };
}

export class SettingsManager {
    private static instance: SettingsManager;
    private settings: Settings;
    private readonly SETTINGS_KEY = 'knoux_player_settings';
    private readonly DEFAULT_SETTINGS: Settings = {
        playback: {
            autoPlay: true,
            loop: false,
            shuffle: false,
            playbackSpeed: 1.0,
            rememberPosition: true
        },
        audio: {
            volume: 80,
            balance: 0,
            equalizerPreset: 'flat',
            spatialAudio: false
        },
        video: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            hue: 0,
            deinterlace: true
        },
        subtitle: {
            fontSize: 24,
            fontColor: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            syncOffset: 0
        },
        interface: {
            theme: 'neon-purple',
            language: 'en',
            showThumbnails: true,
            glassEffect: true,
            animationSpeed: 'normal'
        },
        shortcuts: {
            playPause: 'Space',
            fullscreen: 'F',
            volumeUp: 'ArrowUp',
            volumeDown: 'ArrowDown',
            seekForward: 'ArrowRight',
            seekBackward: 'ArrowLeft',
            nextTrack: 'N',
            previousTrack: 'P',
            screenshot: 'S',
            mute: 'M'
        }
    };

    private constructor() {
        this.loadSettings();
    }

    static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }

    private loadSettings(): void {
        try {
            const stored = localStorage.getItem(this.SETTINGS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Validate and migrate if needed
                this.settings = SettingsMigration.migrate(parsed);
            } else {
                this.settings = { ...this.DEFAULT_SETTINGS };
                this.saveSettings();
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.settings = { ...this.DEFAULT_SETTINGS };
        }
    }

    private saveSettings(): void {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    getSettings(): Settings {
        return { ...this.settings };
    }

    updateSettings(updates: Partial<Settings>): void {
        this.settings = { ...this.settings, ...updates };
        this.saveSettings();
    }

    resetToDefaults(): void {
        this.settings = { ...this.DEFAULT_SETTINGS };
        this.saveSettings();
    }

    exportSettings(): string {
        return JSON.stringify(this.settings, null, 2);
    }

    importSettings(json: string): boolean {
        try {
            const imported = JSON.parse(json);
            const validated = SettingsSchema.validate(imported);
            this.settings = validated;
            this.saveSettings();
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }
}

export const settingsManager = SettingsManager.getInstance();
