/**
 * Plugin: KNOUX Starter
 * Description: Hello World implementation for 3rd party developers.
 */

// Note: In real production, this import resolves to @knoux/sdk
import { KnouxPlugin, IPluginContext } from "../../../plugin-sdk";

export default class StarterPlugin extends KnouxPlugin {
    private timer: NodeJS.Timeout | null = null;

    /**
     * Entry Point: Called when the app loads the plugin.
     */
    public async onLoad(): Promise<void> {
        this.context.logger.info("[StarterPlugin] Loading...");

        // Example: Interacting with the User Interface (Toast)
        this.context.toast("Hello from your new KNOUX Plugin!", { type: "success" });

        // Example: Listening to player events
        this.subscribeToPlayer();
    }

    /**
     * Logic: Subscribe to track changes
     */
    private subscribeToPlayer(): void {
        const unsubscribe = this.context.player.subscribe("track", (track) => {
            if (track) {
                this.context.logger.info(`Now playing: ${track.title}`);
                // Example logic: Fetch lyrics or metadata here...
            }
        });

        // Store unsubscribe hook? Not needed here as onUnload cleans memory,
        // but robust plugins should track their listeners.
    }

    /**
     * Clean up: Called when plugin is disabled or app quits.
     */
    public onUnload(): void {
        this.context.logger.info("[StarterPlugin] Unloading resources...");
        if (this.timer) clearInterval(this.timer);
    }
}
