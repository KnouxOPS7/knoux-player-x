// FileTypes Implementation
// KNOUX Player X - Version 1.0.0

export class FileTypes {
    private static instance: FileTypes;

    static getInstance(): FileTypes {
        if (!FileTypes.instance) {
            FileTypes.instance = new FileTypes();
        }
        return FileTypes.instance;
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

export default FileTypes;
