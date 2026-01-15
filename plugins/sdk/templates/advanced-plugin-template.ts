import { KnouxPlugin } from "@knoux/sdk";

export default class AdvancedPlugin extends KnouxPlugin {
    async onLoad() {
        this.context.logger.info("Advanced Plugin Loading");
        
        // DSP Hook
        if (this.manifest.permissions.includes("dsp:audio")) {
            this.context.dsp?.applyConfig({
                eq: { "1k": 1.2 }
            });
        }
        
        // FS Operation
        if (this.manifest.permissions.includes("filesystem:read")) {
            const data = await this.context.fs?.readTextFile("config.json");
            console.log("External Config Loaded", data);
        }
    }

    onUnload() {
        this.context.logger.info("Advanced Plugin Unloaded");
    }
}
