/**
 * Project: KNOUX Player X™
 * Layer: Utils -> Cache Manager
 */

type CacheEntry<T> = {
    value: T;
    expiresAt: number;
};

export class CacheManager<T> {
    private store = new Map<string, CacheEntry<T>>();
    private defaultTtlMs: number;

    constructor(defaultTtlMs = 5 * 60 * 1000) {
        this.defaultTtlMs = defaultTtlMs;
    }

    set(key: string, value: T, ttlMs?: number): void {
        const ttl = ttlMs ?? this.defaultTtlMs;
        this.store.set(key, { value, expiresAt: Date.now() + ttl });
    }

    get(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }
}
