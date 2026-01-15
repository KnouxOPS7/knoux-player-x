// PluginTypes Implementation
// KNOUX Player X - Version 1.0.0

export class PluginTypes {
    private static instance: PluginTypes;

    static getInstance(): PluginTypes {
        if (!PluginTypes.instance) {
            PluginTypes.instance = new PluginTypes();
        }
        return PluginTypes.instance;
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

export default PluginTypes;
