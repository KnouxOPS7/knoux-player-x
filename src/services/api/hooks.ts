/**
 * Project: KNOUX Player X™
 * Layer: Services -> API Hooks
 */

import { useMemo } from "react";
import { ApiClient } from "./client";
import { createAuthApi } from "./auth";
import { createMediaApi } from "./media";

export const useApiClient = () => {
    return useMemo(() => new ApiClient(), []);
};

export const useAuthApi = () => {
    const client = useApiClient();
    return useMemo(() => createAuthApi(client), [client]);
};

export const useMediaApi = () => {
    const client = useApiClient();
    return useMemo(() => createMediaApi(client), [client]);
};
