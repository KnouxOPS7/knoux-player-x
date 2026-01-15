#include "media_engine.h"
#include <fstream>
#include <sstream>
#include <iomanip>
#include <chrono>
#include <thread>
#include <filesystem>
#include <iostream>
#include <algorithm>
#include <codecvt>

namespace knoux::core::engine {

// Singleton instance pointer
static std::shared_ptr<MediaEngine> g_instance = nullptr;

std::shared_ptr<MediaEngine> MediaEngine::GetInstance() {
    if (!g_instance) {
        g_instance = std::make_shared<MediaEngine>();
    }
    return g_instance;
}

MediaEngine::MediaEngine()
    : m_workerThread(std::make_unique<std::thread>(&MediaEngine::WorkerLoop, this))
{
}

bool MediaEngine::Initialize() {
    if (m_isInitialized.load()) {
        return true;
    }

    if (!ValidateFilePath(m_mediaPath)) {
        return false;
    }

    // Ensure config directory exists
    const auto& configDir = std::filesystem::path(m_mediaPath).parent_path();
    if (!std::filesystem::exists(configDir)) {
        try {
            std::filesystem::create_directories(configDir);
        } catch (...) {
            return false;
        }
    }

    m_isInitialized.store(true);
    return true;
}

void MediaEngine::Shutdown() {
    if (!m_isInitialized.load()) {
        return;
    }

    m_shouldStop.store(true);
    m_taskCondition.notify_all();

    if (m_workerThread && m_workerThread->joinable()) {
        m_workerThread->join();
    }

    m_isInitialized.store(false);
    m_isLoaded.store(false);
    m_isPlaying.store(false);
    m_currentTime.store(0.0);
    m_duration.store(0.0);
    m_mediaPath.clear();
}

bool MediaEngine::Load(const std::string& path) {
    if (path.empty()) {
        return false;
    }

    {
        std::lock_guard<std::mutex> lock(m_metadataMutex);
        m_metadata.clear();
    }

    m_mediaPath = path;
    m_isLoaded.store(false);

    // Submit load task to worker thread
    std::unique_lock<std::mutex> lock(m_taskMutex);
    m_taskQueue.push([this]() {
        if (!ParseStreams(m_mediaPath)) {
            return;
        }

        m_isLoaded.store(true);
        m_currentTime.store(0.0);
        m_duration.store(m_metadata.value("duration", 0.0));
    });

    m_taskCondition.notify_one();
    return true;
}

bool MediaEngine::Play() {
    if (!IsLoaded()) {
        return false;
    }

    if (m_isPlaying.load()) {
        return true;
    }

    m_isPlaying.store(true);
    return true;
}

bool MediaEngine::Pause() {
    if (!IsPlaying()) {
        return false;
    }

    m_isPlaying.store(false);
    return true;
}

bool MediaEngine::Stop() {
    if (!IsLoaded()) {
        return false;
    }

    m_isPlaying.store(false);
    m_currentTime.store(0.0);
    return true;
}

bool MediaEngine::Seek(double time) {
    if (!IsLoaded()) {
        return false;
    }

    if (time < 0.0) {
        time = 0.0;
    }

    const double duration = GetDuration();
    if (time > duration) {
        time = duration;
    }

    m_currentTime.store(time);
    return true;
}

double MediaEngine::GetCurrentTime() const {
    return m_currentTime.load();
}

double MediaEngine::GetDuration() const {
    return m_duration.load();
}

bool MediaEngine::IsPlaying() const {
    return m_isPlaying.load();
}

bool MediaEngine::IsLoaded() const {
    return m_isLoaded.load();
}

nlohmann::json MediaEngine::GetMetadata() const {
    std::lock_guard<std::mutex> lock(m_metadataMutex);
    return m_metadata;
}

void MediaEngine::SetVideoFrameCallback(std::function<void(const uint8_t*, int, int, int)> callback) {
    m_videoCallback = callback;
}

void MediaEngine::SetAudioBufferCallback(std::function<void(const float*, size_t)> callback) {
    m_audioCallback = callback;
}

void MediaEngine::SetHardwareAcceleration(bool enable) {
    m_useHardwareAccel.store(enable);
}

bool MediaEngine::IsHardwareAccelerated() const {
    return m_useHardwareAccel.load();
}

void MediaEngine::WorkerLoop() {
    while (!m_shouldStop.load()) {
        std::unique_lock<std::mutex> lock(m_taskMutex);
        m_taskCondition.wait(lock, [this] { return !m_taskQueue.empty() || m_shouldStop.load(); });

        if (m_shouldStop.load() && m_taskQueue.empty()) {
            break;
        }

        auto task = std::move(m_taskQueue.front());
        m_taskQueue.pop();
        lock.unlock();

        task();
    }
}

bool MediaEngine::ParseStreams(const std::string& path) {
    std::ifstream file(path, std::ios::binary);
    if (!file.is_open()) {
        return false;
    }

    // Read first 12 bytes for magic number detection
    std::vector<uint8_t> header(12);
    file.read(reinterpret_cast<char*>(header.data()), 12);
    file.close();

    std::string format = DetectFormatFromMagicBytes(path);
    if (format.empty()) {
        return false;
    }

    // Simulate metadata extraction
    nlohmann::json meta;
    meta["format"] = format;
    meta["duration"] = 185.34; // seconds
    meta["title"] = "Sample Movie";
    meta["artist"] = "Director Name";
    meta["bitrate"] = 4500000;
    meta["width"] = 1920;
    meta["height"] = 1080;
    meta["frame_rate"] = 24.0;
    meta["audio_codec"] = "aac";
    meta["video_codec"] = "h264";

    {
        std::lock_guard<std::mutex> lock(m_metadataMutex);
        m_metadata = meta;
    }

    return true;
}

bool MediaEngine::ValidateFilePath(const std::string& path) const {
    if (path.empty()) {
        return false;
    }

    try {
        const std::filesystem::path p(path);
        return std::filesystem::exists(p) && std::filesystem::is_regular_file(p);
    } catch (...) {
        return false;
    }
}

std::string MediaEngine::DetectFormatFromMagicBytes(const std::string& path) const {
    std::ifstream file(path, std::ios::binary);
    if (!file.is_open()) {
        return "";
    }

    std::vector<uint8_t> buffer(12);
    file.read(reinterpret_cast<char*>(buffer.data()), 12);
    file.close();

    // Check for common formats by magic bytes
    if (buffer.size() >= 4 && buffer[0] == 0x00 && buffer[1] == 0x00 && buffer[2] == 0x01 && buffer[3] == 0xB6) {
        return "mpeg-ts";
    }
    if (buffer.size() >= 4 && buffer[0] == 0x47 && buffer[1] == 0x40 && buffer[2] == 0x00 && buffer[3] == 0x00) {
        return "mpeg2-ts";
    }
    if (buffer.size() >= 4 && buffer[0] == 0x1A && buffer[1] == 0x45 && buffer[2] == 0xDF && buffer[3] == 0xA3) {
        return "matroska";
    }
    if (buffer.size() >= 4 && buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46) {
        return "riff";
    }
    if (buffer.size() >= 4 && buffer[0] == 0xFF && buffer[1] == 0xFB && buffer[2] == 0x00 && buffer[3] == 0x00) {
        return "mp3";
    }
    if (buffer.size() >= 4 && buffer[0] == 0x49 && buffer[1] == 0x44 && buffer[2] == 0x33 && buffer[3] == 0x03) {
        return "mp3-id3v2";
    }
    if (buffer.size() >= 4 && buffer[0] == 0x66 && buffer[1] == 0x4C && buffer[2] == 0x61 && buffer[3] == 0x63) {
        return "flac";
    }
    if (buffer.size() >= 4 && buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46) {
        return "wav";
    }
    if (buffer.size() >= 4 && buffer[0] == 0x4D && buffer[1] == 0x54 && buffer[2] == 0x68 && buffer[3] == 0x64) {
        return "midi";
    }

    return "unknown";
}

} // namespace knoux::core::engine