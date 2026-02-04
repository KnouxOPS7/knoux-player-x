/**
 * Project: KNOUX Player X™
 * Layer: Services -> API Client
 */

import { API_ROOT } from "../../constants/constants";

export interface ApiClientConfig {
    baseUrl?: string;
    getAuthToken?: () => string | null;
}

export class ApiClient {
    private baseUrl: string;
    private getAuthToken?: () => string | null;

    constructor(config: ApiClientConfig = {}) {
        this.baseUrl = config.baseUrl ?? API_ROOT;
        this.getAuthToken = config.getAuthToken;
    }

    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const headers = new Headers(options.headers ?? {});
        const token = this.getAuthToken?.();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        return response.json() as Promise<T>;
    }
}
