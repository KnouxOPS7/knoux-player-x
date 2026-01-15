/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Service: Storage
 * Purpose: A robust wrapper around Browser Storage APIs with prefixing and error handling.
 */

const STORAGE_PREFIX = "KNOUX_";

export class StorageService {
    
    /**
     * Save item to LocalStorage (Persistent)
     */
    static set<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
        } catch (error) {
            console.error(`[StorageService] Failed to set key: ${key}`, error);
        }
    }

    /**
     * Retrieve item from LocalStorage
     */
    static get<T>(key: string, fallback?: T): T | null {
        try {
            const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
            if (raw === null) return fallback ?? null;
            return JSON.parse(raw) as T;
        } catch (error) {
            console.warn(`[StorageService] Failed to parse key: ${key}`, error);
            return fallback ?? null;
        }
    }

    /**
     * Remove item from LocalStorage
     */
    static remove(key: string): void {
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    }

    /**
     * Clear all application data
     */
    static clear(): void {
        Object.keys(localStorage).forEach((k) => {
            if (k.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(k);
            }
        });
    }

    /**
     * Session Storage (Volatile - Cleared on Close)
     */
    static session = {
        set: <T>(key: string, value: T): void => {
            try {
                sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
            } catch (e) { /* Ignore */ }
        },
        get: <T>(key: string): T | null => {
            try {
                const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
                return raw ? JSON.parse(raw) : null;
            } catch { return null; }
        }
    };
}

export default StorageService;
