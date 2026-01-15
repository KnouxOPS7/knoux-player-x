import { KnouxPlugin } from "@knoux/sdk";

export default class BasicPlugin extends KnouxPlugin {
    onLoad() {
        console.log("Basic Plugin Loaded");
    }
    onUnload() {
        console.log("Basic Plugin Unloaded");
    }
}
