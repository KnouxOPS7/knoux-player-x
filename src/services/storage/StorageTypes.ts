// StorageTypes Implementation
// KNOUX Player X - Version 1.0.0

export class StorageTypes {
    private static instance: StorageTypes;

    static getInstance(): StorageTypes {
        if (!StorageTypes.instance) {
            StorageTypes.instance = new StorageTypes();
        }
        return StorageTypes.instance;
    }

    private constructor() {
        // Private constructor for singleton
    }

    initialize(): Promise<void> {
        return Promise.resolve();
    }

    destroy(): void {
        // Cleanup logic
    }
}

export default StorageTypes;
