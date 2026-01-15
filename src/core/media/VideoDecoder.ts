// Video Decoder Implementation
// Version: 1.0.0

import { VideoFrame, DecoderConfig } from '../../types/media.types';

export class VideoDecoder {
    private decoder: VideoDecoder | null = null;
    private config: DecoderConfig;

    constructor(config: DecoderConfig) {
        this.config = config;
    }

    async initialize(): Promise<void> {
        if (!('VideoDecoder' in window)) {
            throw new Error('WebCodecs API not supported');
        }

        this.decoder = new VideoDecoder({
            output: (frame: VideoFrame) => this.handleFrame(frame),
            error: (error: Error) => this.handleError(error)
        });

        const decoderConfig: VideoDecoderConfig = {
            codec: this.config.codec,
            hardwareAcceleration: 'prefer-hardware',
            optimizeForLatency: true
        };

        this.decoder.configure(decoderConfig);
    }

    private handleFrame(frame: VideoFrame): void {
        // Process video frame
        frame.close();
    }

    private handleError(error: Error): void {
        console.error('Video decoder error:', error);
    }

    async decode(chunk: EncodedVideoChunk): Promise<void> {
        if (!this.decoder) {
            throw new Error('Decoder not initialized');
        }
        this.decoder.decode(chunk);
    }

    async flush(): Promise<void> {
        if (this.decoder) {
            await this.decoder.flush();
        }
    }

    destroy(): void {
        if (this.decoder) {
            this.decoder.close();
            this.decoder = null;
        }
    }
}
