/**
 * Project: KNOUX Player X™
 * Layer: Services -> Auth API
 */

import { ApiClient } from "./client";

export interface AuthProfile {
    id: string;
    name: string;
    email: string;
}

export const createAuthApi = (client: ApiClient) => {
    return {
        getProfile: () => client.request<AuthProfile>("/auth/profile"),
        refreshToken: () => client.request<{ token: string }>("/auth/refresh", { method: "POST" })
    };
};
