/**
 * Project: KNOUX Player X™
 * Layer: Services -> Audio Engine
 */

export type EqualizerBand = {
    frequency: number;
    gain: number;
};

export class AudioEngine {
    private context: AudioContext | null = null;
    private source: MediaElementAudioSourceNode | null = null;
    private gainNode: GainNode | null = null;
    private analyser: AnalyserNode | null = null;
    private filters: BiquadFilterNode[] = [];
    private mediaElement: HTMLMediaElement | null = null;

    initialize(): void {
        if (!this.context) {
            this.context = new AudioContext();
            this.gainNode = this.context.createGain();
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 2048;
        }
    }

    attachElement(element: HTMLMediaElement): void {
        this.initialize();
        if (!this.context || !this.gainNode || !this.analyser) {
            return;
        }
        if (this.source) {
            this.source.disconnect();
        }
        this.mediaElement = element;
        this.source = this.context.createMediaElementSource(element);
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.context.destination);
    }

    setVolume(volume: number): void {
        if (this.gainNode) {
            this.gainNode.gain.value = Math.min(1, Math.max(0, volume));
        }
    }

    setMuted(muted: boolean): void {
        if (this.gainNode) {
            this.gainNode.gain.value = muted ? 0 : this.gainNode.gain.value;
        }
    }

    setEqualizer(bands: EqualizerBand[]): void {
        if (!this.context || !this.source || !this.gainNode) {
            return;
        }
        this.filters.forEach((filter) => filter.disconnect());
        this.filters = bands.map((band) => {
            const filter = this.context!.createBiquadFilter();
            filter.type = "peaking";
            filter.frequency.value = band.frequency;
            filter.gain.value = band.gain;
            filter.Q.value = 1;
            return filter;
        });
        let chainStart: AudioNode = this.source;
        this.filters.forEach((filter) => {
            chainStart.connect(filter);
            chainStart = filter;
        });
        chainStart.connect(this.gainNode);
    }

    getFrequencyData(): Uint8Array {
        if (!this.analyser) {
            return new Uint8Array();
        }
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        return data;
    }

    resume(): Promise<void> {
        return this.context?.resume() ?? Promise.resolve();
    }

    suspend(): Promise<void> {
        return this.context?.suspend() ?? Promise.resolve();
    }

    destroy(): void {
        this.filters.forEach((filter) => filter.disconnect());
        this.filters = [];
        this.source?.disconnect();
        this.gainNode?.disconnect();
        this.analyser?.disconnect();
        this.context?.close();
        this.context = null;
        this.source = null;
        this.gainNode = null;
        this.analyser = null;
        this.mediaElement = null;
    }
}
