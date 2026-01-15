// ShortcutTypes Implementation
// KNOUX Player X - Version 1.0.0

export class ShortcutTypes {
    private static instance: ShortcutTypes;

    static getInstance(): ShortcutTypes {
        if (!ShortcutTypes.instance) {
            ShortcutTypes.instance = new ShortcutTypes();
        }
        return ShortcutTypes.instance;
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

export default ShortcutTypes;
