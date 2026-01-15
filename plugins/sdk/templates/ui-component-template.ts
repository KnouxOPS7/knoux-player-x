import { KnouxPlugin } from "@knoux/sdk";

// Mock React Component for Template
const MyOverlay = () => "<div>Custom Overlay</div>";

export default class UiPlugin extends KnouxPlugin {
    onLoad() {
        // Imaginary API for registering UI in future updates
        // this.context.ui.registerOverlay("player-top", MyOverlay);
        this.context.toast("UI Plugin Active", { type: "info" });
    }
    onUnload() {}
}
