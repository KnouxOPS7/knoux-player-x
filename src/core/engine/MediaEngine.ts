// Author: knoux (أبو ريتاج) — Media Engine Implementation

export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'buffering';

export class MediaEngine {
    private element: HTMLVideoElement | null = null;
    
    constructor(elementId: string) {
        this.element = document.getElementById(elementId) as HTMLVideoElement;
        this.initEventListeners();
    }

    private initEventListeners() {
        if (!this.element) return;
        this.element.addEventListener('error', (e) => console.error("KNOUX Core Error:", e));
        this.element.onwaiting = () => console.log("Buffering...");
    }

    public loadSource(url: string) {
        if (this.element) {
            this.element.src = url;
            this.element.load();
        }
    }

    public play() { this.element?.play(); }
    public pause() { this.element?.pause(); }
    public setVolume(val: number) { if (this.element) this.element.volume = val; }
    public seek(seconds: number) { if (this.element) this.element.currentTime = seconds; }
}
