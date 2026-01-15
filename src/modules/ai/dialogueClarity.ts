/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Module: AI/Audio
 * Purpose: Smart DSP Logic to detect vocal frequencies and boost human speech ranges
 *          while attenuating background noise/music.
 */

import { DSPConfig } from '../../../desktop/main/native/dsp/dsp_bridge';

const VOCAL_RANGE_LOW = 300;   // Hz
const VOCAL_RANGE_HIGH = 3400; // Hz

export class DialogueClarityEngine {
    private isEnabled: boolean = false;
    private intensity: number = 0.5; // 0.0 to 1.0

    constructor() {}

    /**
     * Toggles the enhancement engine.
     */
    public setEnabled(state: boolean) {
        this.isEnabled = state;
    }

    public setIntensity(val: number) {
        this.intensity = Math.min(Math.max(val, 0), 1);
    }

    /**
     * Generates a DSP Config to boost mid-range vocal frequencies.
     * Note: In a real native impl, this would return coefficient arrays for biquad filters.
     * Here we map it to our 10-band EQ stub.
     */
    public getDSPConfig(): Partial<DSPConfig> {
        if (!this.isEnabled) return {};

        // Approximate 10-band EQ map based on 31, 62, 125, 250, 500, 1k, 2k, 4k, 8k, 16k
        // Boost 500, 1k, 2k, 4k significantly.
        const boost = 1.0 + (this.intensity * 0.5); // Max 1.5x gain on vocals
        const cut = 1.0 - (this.intensity * 0.2);   // Mild cut on bass/rumble

        const eqValues: Record<string, number> = {
            "31": cut,
            "62": cut,
            "125": cut,
            "250": 1.0,
            "500": boost,
            "1k": boost * 1.1, // Vocal presence peak
            "2k": boost,
            "4k": boost,
            "8k": 1.0,
            "16k": 1.0
        };

        return {
            eq: eqValues
        };
    }
}

export const dialogueEnhancer = new DialogueClarityEngine();
