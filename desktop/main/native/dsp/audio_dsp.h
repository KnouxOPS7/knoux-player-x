/**
 * Project: KNOUX Player X?
 * Author: knoux
 * Purpose: C++ header file for minimal audio signal processing capabilities including EQ, Gain control, and DC blocker filter.
 * Layer: Core -> Media Engine -> Audio Processing
 *
 * Provides raw float buffer processing interface compatible with PCM interleaved stereo audio stream input.
 * Related to: desktop/main/native/dsp/audio_dsp.cpp, src/services/audio/, core/engine/media_engine.*
 */
#ifndef AUDIO_DSP_H
#define AUDIO_DSP_H

struct DSPConfig {
    float eqValues[10]; // 10 bands fixed EQ frequencies
    float gainLevel;    // Linear multiplier applied on all samples (normalized 0..2 range)
    bool dcBlockEnabled; // Simplest high-pass style to eliminate static offset
};

class AudioDSP {
public:
    AudioDSP();
    ~AudioDSP();

    /**
     * Process raw float-interleaved stereo PCM buffer applying set gains, frequency weights, optional block mode filter
     * Assumes valid input of even totalLength count
     */
    void ProcessBuffer(float* data, int totalLength, const DSPConfig& config);
private:
    // Placeholder fields used when more detailed IIR/EQ state needed in practice (left blank intentionally as placeholder class here)
};

#endif // AUDIO_DSP_H
