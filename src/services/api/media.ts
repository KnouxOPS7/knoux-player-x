/**
 * Project: KNOUX Player X™
 * Layer: Services -> Media API
 */

import { ApiClient } from "./client";

export interface MediaItem {
    id: string;
    title: string;
    duration: number;
    url: string;
}

export const createMediaApi = (client: ApiClient) => {
    return {
        listMedia: () => client.request<MediaItem[]>("/media"),
        getMedia: (id: string) => client.request<MediaItem>(`/media/${id}`)
    };
};
