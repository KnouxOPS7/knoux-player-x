/**
 * Project: KNOUX Player X™
 * Layer: Service Worker Registration (Stub)
 */

interface RegistrationConfig {
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
}

export const register = (config?: RegistrationConfig) => {
    if (!("serviceWorker" in navigator)) {
        return;
    }
    navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
            config?.onSuccess?.(registration);
        })
        .catch(() => {
            // Ignore registration failures in offline environments
        });
};

export const unregister = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
                registration.unregister();
            });
        });
    }
};
