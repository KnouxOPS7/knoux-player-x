import { StorageService } from "../../../src/services/storage/index";

describe("Service: Storage Manager", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("saves and retrieves primitives", () => {
        StorageService.set("theme", "neon");
        expect(StorageService.get("theme")).toBe("neon");
    });

    test("saves and retrieves objects", () => {
        const profile = { volume: 0.8, mute: false };
        StorageService.set("profile", profile);
        
        const retrieved = StorageService.get<{ volume: number }>("profile");
        expect(retrieved).not.toBeNull();
        expect(retrieved?.volume).toBe(0.8);
    });

    test("handles non-existent keys", () => {
        const val = StorageService.get("missing", "default");
        expect(val).toBe("default");
    });
});
