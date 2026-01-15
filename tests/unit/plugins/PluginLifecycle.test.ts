import { PluginManifest } from "../../src/types";

describe("Plugin Tests", () => {
    test("manifest valid", () => {
        const plugin: PluginManifest = {
            id: "test",
            name: "Plugin",
            description: "Test",
            version: "1.0.0",
            author: "KNOUX",
            compatibleVersion: "^1.0.0"
        };
        expect(plugin.id).toBe("test");
    });
});
