#include "logging.h"
#include <iomanip>
#include <sstream>
#include <iostream>
#include <chrono>
#include <ctime>
#include <algorithm>
#include <filesystem>

namespace knoux::core::system {

// Static instance pointer
static std::shared_ptr<Logger> g_loggerInstance = nullptr;

std::shared_ptr<Logger> Logger::GetInstance() {
    if (!g_loggerInstance) {
        g_loggerInstance = std::make_shared<Logger>();
    }
    return g_loggerInstance;
}

Logger::Logger()
    : m_logLevel(LogLevel::INFO)
{
}

bool Logger::Initialize(const std::string& logDir) {
    std::lock_guard<std::mutex> lock(m_mutex);

    m_logDir = std::filesystem::path(logDir);
    
    if (!EnsureLogDirectory()) {
        return false;
    }

    // Create initial log file with timestamp
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d_%H-%M-%S");
    
    m_currentLogFile = m_logDir / ("knoux_player_x_" + ss.str() + ".log");

    m_fileStream.open(m_currentLogFile, std::ios::out | std::ios::app);
    if (!m_fileStream.is_open()) {
        return false;
    }

    Info("Logger", "Logging system initialized successfully");
    return true;
}

void Logger::SetLogLevel(LogLevel level) {
    std::lock_guard<std::mutex> lock(m_mutex);
    m_logLevel = level;
}

void Logger::Trace(const std::string& module, const std::string& message) {
    if (m_logLevel <= LogLevel::TRACE) {
        WriteLogEntry(LogLevel::TRACE, module, message);
    }
}

void Logger::Debug(const std::string& module, const std::string& message) {
    if (m_logLevel <= LogLevel::DEBUG) {
        WriteLogEntry(LogLevel::DEBUG, module, message);
    }
}

void Logger::Info(const std::string& module, const std::string& message) {
    if (m_logLevel <= LogLevel::INFO) {
        WriteLogEntry(LogLevel::INFO, module, message);
    }
}

void Logger::Warn(const std::string& module, const std::string& message) {
    if (m_logLevel <= LogLevel::WARN) {
        WriteLogEntry(LogLevel::WARN, module, message);
    }
}

void Logger::Error(const std::string& module, const std::string& message) {
    if (m_logLevel <= LogLevel::ERROR) {
        WriteLogEntry(LogLevel::ERROR, module, message);
    }
}

void Logger::Fatal(const std::string& module, const std::string& message) {
    if (m_logLevel <= LogLevel::FATAL) {
        WriteLogEntry(LogLevel::FATAL, module, message);
    }
}

void Logger::Flush() {
    std::lock_guard<std::mutex> lock(m_mutex);
    if (m_fileStream.is_open()) {
        m_fileStream.flush();
    }
}

std::string Logger::GetTimestamp() const {
    auto now = std::chrono::system_clock::now();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()) % 1000;
    auto time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d %H:%M:%S");
    ss << '.' << std::setfill('0') << std::setw(3) << ms.count();
    return ss.str();
}

std::string Logger::LevelToString(LogLevel level) const {
    switch (level) {
        case LogLevel::TRACE: return "TRACE";
        case LogLevel::DEBUG: return "DEBUG";
        case LogLevel::INFO:  return "INFO ";
        case LogLevel::WARN:  return "WARN ";
        case LogLevel::ERROR: return "ERROR";
        case LogLevel::FATAL: return "FATAL";
        default:              return "UNKNOWN";
    }
}

std::string Logger::GetColorCode(LogLevel level) const {
    switch (level) {
        case LogLevel::TRACE: return "\033[90m";  // Dark gray
        case LogLevel::DEBUG: return "\033[36m";  // Cyan
        case LogLevel::INFO:  return "\033[32m";  // Green
        case LogLevel::WARN:  return "\033[33m";  // Yellow
        case LogLevel::ERROR: return "\033[31m";  // Red
        case LogLevel::FATAL: return "\033[35m";  // Magenta
        default:              return "\033[0m";   // Reset
    }
}

void Logger::WriteLogEntry(LogLevel level, const std::string& module, const std::string& message) {
    std::lock_guard<std::mutex> lock(m_mutex);

    std::string timestamp = GetTimestamp();
    std::string levelStr = LevelToString(level);
    std::string colorCode = GetColorCode(level);
    std::string resetCode = "\033[0m";

    // Format log entry
    std::stringstream fileEntry;
    fileEntry << "[" << timestamp << "] [" << levelStr << "] [" << module << "] " << message << std::endl;

    std::stringstream consoleEntry;
    consoleEntry << colorCode << "[" << timestamp << "] [" << levelStr << "] [" << module << "] " << message << resetCode << std::endl;

    // Write to file
    if (m_fileStream.is_open()) {
        m_fileStream << fileEntry.str();
        
        // Check if rotation needed
        if (m_fileStream.tellp() > static_cast<std::streampos>(MAX_LOG_SIZE)) {
            RotateLogFile();
        }
    }

    // Write to console
    std::cout << consoleEntry.str();
}

void Logger::RotateLogFile() {
    if (!m_fileStream.is_open()) {
        return;
    }

    m_fileStream.close();

    // Rename current log file with timestamp
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d_%H-%M-%S");
    
    std::filesystem::path rotatedPath = m_logDir / ("knoux_player_x_" + ss.str() + ".log");
    std::filesystem::rename(m_currentLogFile, rotatedPath);

    // Create new log file
    m_currentLogFile = m_logDir / ("knoux_player_x_" + ss.str() + "_cont.log");
    m_fileStream.open(m_currentLogFile, std::ios::out | std::ios::app);

    if (!m_fileStream.is_open()) {
        // Fallback to stderr
        std::cerr << "Failed to create new log file after rotation!" << std::endl;
    }
}

bool Logger::EnsureLogDirectory() const {
    try {
        if (!std::filesystem::exists(m_logDir)) {
            std::filesystem::create_directories(m_logDir);
        }
        return std::filesystem::is_directory(m_logDir);
    } catch (...) {
        return false;
    }
}

} // namespace knoux::core::system