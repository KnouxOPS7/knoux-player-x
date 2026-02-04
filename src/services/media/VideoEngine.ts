/**
 * Project: KNOUX Player X™
 * Layer: Services -> Video Engine
 */

export type VideoFilters = {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
};

const defaultFilters: VideoFilters = {
    brightness: 1,
    contrast: 1,
    saturation: 1,
    hue: 0
};

export class VideoEngine {
    private video: HTMLVideoElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private context: CanvasRenderingContext2D | null = null;
    private animationId: number | null = null;
    private filters: VideoFilters = { ...defaultFilters };

    attach(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
        this.video = video;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        if (this.video) {
            this.video.addEventListener("loadedmetadata", this.handleResize);
        }
    }

    private handleResize = () => {
        if (!this.video || !this.canvas) {
            return;
        }
        this.canvas.width = this.video.videoWidth || this.canvas.clientWidth;
        this.canvas.height = this.video.videoHeight || this.canvas.clientHeight;
    };

    setFilters(filters: Partial<VideoFilters>): void {
        this.filters = { ...this.filters, ...filters };
    }

    start(): void {
        if (this.animationId !== null) {
            return;
        }
        const renderFrame = () => {
            if (!this.video || !this.canvas || !this.context) {
                return;
            }
            this.context.filter = `brightness(${this.filters.brightness}) contrast(${this.filters.contrast}) saturate(${this.filters.saturation}) hue-rotate(${this.filters.hue}deg)`;
            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            this.animationId = requestAnimationFrame(renderFrame);
        };
        renderFrame();
    }

    stop(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    captureFrame(): string | null {
        if (!this.canvas) {
            return null;
        }
        return this.canvas.toDataURL("image/png");
    }

    destroy(): void {
        this.stop();
        if (this.video) {
            this.video.removeEventListener("loadedmetadata", this.handleResize);
        }
        this.video = null;
        this.canvas = null;
        this.context = null;
    }
}
