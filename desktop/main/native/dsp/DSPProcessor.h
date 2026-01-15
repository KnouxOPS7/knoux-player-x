/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Audio DSP Processing Engine Interface
 * Layer: Desktop -> Native -> DSP
 *
 * Related Files:
 * - Implementation: DSPProcessor.cpp
 * - Bridge: dspBridge.ts
 * - Usage: src/core/audio/dspService.ts
 */

#pragma once
#include <vector>
#include <memory>

struct DSPConfig {
    float gain;           // Linear gain factor (0.0 to 2.0)
    float bass;           // Bass boost/cut (-10.0 to 10.0 dB)
    float treble;         // Treble boost/cut (-10.0 to 10.0 dB)
    bool normalize;       // Auto level normalization
    std::vector<float> customEq;  // Custom 10-band EQ values
};

class DSPProcessor {
public:
    DSPProcessor();
    ~DSPProcessor();

    // Process audio buffer in place
    void ProcessBuffer(float* buffer, size_t length, const DSPConfig& config);
    
    // Apply specific effect
    void ApplyGain(float* buffer, size_t length, float gain);
    void ApplyBassBoost(float* buffer, size_t length, float bassDb);
    void ApplyTrebleBoost(float* buffer, size_t length, float trebleDb);
    void ApplyNormalize(float* buffer, size_t length);
    void ApplyCustomEQ(float* buffer, size_t length, const std::vector<float>& eqValues);

private:
    // Internal helpers
    void InitializeFilters();
    float Clamp(float value, float min, float max);
    
    // Filter coefficients (for EQ implementation)
    float bassFilter[3];
    float trebleFilter[3];
};
