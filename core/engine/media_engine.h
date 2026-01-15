#pragma once

#include <string>
#include <memory>
#include <thread>
#include <atomic>
#include <future>
#include <functional>
#include <filesystem>
#include <nlohmann/json.hpp>

namespace knoux::core::engine {

/**
 * @class MediaEngine
 * @brief Core media processing engine responsible for loading, decoding,
 *        synchronizing, and streaming audio/video content.
 *
 * This class orchestrates all low-level media operations including:
 * - File format detection
 * - Stream parsing and demuxing
 * - Hardware-accelerated decoding via GPU
 * - Audio/Video synchronization (AV sync)
 * - Buffer management and preloading
 * - Real-time metadata extraction
 *
 * Designed as a single-threaded event loop with offloaded tasks to worker threads.
 */
class MediaEngine {
public:
    /**
     * @brief Singleton instance accessor
     */
    static std::shared_ptr<MediaEngine> GetInstance();

    /**
     * @brief Initializes the media engine with required dependencies
     * @return true if initialization succeeded, false otherwise
     */
    bool Initialize();

    /**
     * @brief Releases all resources held by the engine
     */
    void Shutdown();

    /**
     * @brief Loads a media file from disk or URL
     * @param path Absolute path or URI of the media file
     * @return true if load request was accepted, false otherwise
     */
    bool Load(const std::string& path);

    /**
     * @brief Starts playback of loaded media
     * @return true if playback started successfully
     */
    bool Play();

    /**
     * @brief Pauses current playback
     * @return true if paused successfully
     */
    bool Pause();

    /**
     * @brief Stops playback and resets state
     * @return true if stopped successfully
     */
    bool Stop();

    /**
     * @brief Seeks to a specific time in seconds
     * @param time Target position in seconds
     * @return true if seek successful, false otherwise
     */
    bool Seek(double time);

    /**
     * @brief Returns current playback position in seconds
     * @return Current time in seconds
     */
    double GetCurrentTime() const;

    /**
     * @brief Returns total duration of the media in seconds
     * @return Duration in seconds
     */
    double GetDuration() const;

    /**
     * @brief Checks if media is currently playing
     * @return true if playing, false otherwise
     */
    bool IsPlaying() const;

    /**
     * @brief Checks if media has been loaded
     * @return true if loaded, false otherwise
     */
    bool IsLoaded() const;

    /**
     * @brief Retrieves detailed media metadata
     * @return JSON object containing title, artist, duration, codec info, etc.
     */
    nlohmann::json GetMetadata() const;

    /**
     * @brief Sets the output video renderer callback
     * @param callback Function to be called when new frame is ready
     */
    void SetVideoFrameCallback(std::function<void(const uint8_t*, int, int, int)> callback);

    /**
     * @brief Sets the output audio buffer callback
     * @param callback Function to be called when new audio chunk is ready
     */
    void SetAudioBufferCallback(std::function<void(const float*, size_t)> callback);

    /**
     * @brief Enables/disables hardware acceleration
     * @param enable True to enable GPU decoding, false to use software
     */
    void SetHardwareAcceleration(bool enable);

    /**
     * @brief Gets current hardware acceleration status
     * @return true if enabled
     */
    bool IsHardwareAccelerated() const;

private:
    // Private constructor for singleton pattern
    MediaEngine();

    // Thread-safe flag for engine lifecycle
    std::atomic<bool> m_isInitialized{ false };

    // Flag indicating whether media is loaded
    std::atomic<bool> m_isLoaded{ false };

    // Playback state tracking
    std::atomic<bool> m_isPlaying{ false };

    // Current playback time
    std::atomic<double> m_currentTime{ 0.0 };

    // Total media duration
    std::atomic<double> m_duration{ 0.0 };

    // Path to currently loaded media
    std::string m_mediaPath;

    // Metadata container
    mutable std::mutex m_metadataMutex;
    nlohmann::json m_metadata;

    // Video frame callback
    std::function<void(const uint8_t*, int, int, int)> m_videoCallback;

    // Audio buffer callback
    std::function<void(const float*, size_t)> m_audioCallback;

    // Hardware acceleration toggle
    std::atomic<bool> m_useHardwareAccel{ true };

    // Worker thread for background processing
    std::unique_ptr<std::thread> m_workerThread;

    // Task queue for async operations
    std::queue<std::function<void()>> m_taskQueue;

    // Condition variable for task scheduling
    std::condition_variable m_taskCondition;

    // Mutex for task queue access
    std::mutex m_taskMutex;

    // Flag to signal shutdown
    std::atomic<bool> m_shouldStop{ false };

    // Internal worker loop
    void WorkerLoop();

    // Helper: Extracts stream information from file
    bool ParseStreams(const std::string& path);

    // Helper: Validates file existence and permissions
    bool ValidateFilePath(const std::string& path) const;

    // Helper: Attempts to detect media format using magic bytes
    std::string DetectFormatFromMagicBytes(const std::string& path) const;
};

} // namespace knoux::core::engine