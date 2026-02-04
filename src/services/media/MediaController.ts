/**
 * Project: KNOUX Player X™
 * Layer: Services -> Media Controller
 */

export interface MediaSource {
    src: string;
    type?: string;
}

export interface SubtitleSource {
    src: string;
    label: string;
    language: string;
    kind?: "subtitles" | "captions";
}

export class MediaController {
    private element: HTMLVideoElement | null = null;

    attach(element: HTMLVideoElement) {
        this.element = element;
    }

    load(source: MediaSource) {
        if (!this.element) {
            return;
        }
        this.element.src = source.src;
        this.element.load();
    }

    play() {
        return this.element?.play();
    }

    pause() {
        this.element?.pause();
    }

    seek(time: number) {
        if (this.element) {
            this.element.currentTime = Math.max(0, time);
        }
    }

    setPlaybackRate(rate: number) {
        if (this.element) {
            this.element.playbackRate = rate;
        }
    }

    setVolume(volume: number) {
        if (this.element) {
            this.element.volume = Math.min(1, Math.max(0, volume));
        }
    }

    setMuted(muted: boolean) {
        if (this.element) {
            this.element.muted = muted;
        }
    }

    setSubtitle(track: SubtitleSource | null) {
        if (!this.element) {
            return;
        }
        const existing = Array.from(this.element.querySelectorAll("track"));
        existing.forEach((node) => node.remove());
        if (track) {
            const trackElement = document.createElement("track");
            trackElement.kind = track.kind ?? "subtitles";
            trackElement.label = track.label;
            trackElement.srclang = track.language;
            trackElement.src = track.src;
            trackElement.default = true;
            this.element.appendChild(trackElement);
        }
    }
}
