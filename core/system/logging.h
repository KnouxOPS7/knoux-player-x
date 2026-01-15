#pragma once

#include <string>
#include <memory>
#include <fstream>
#include <sstream>
#include <mutex>
#include <chrono>
#include <iomanip>
#include <iostream>
#include <filesystem>

namespace knoux::core::system {

/**
 * @enum LogLevel
 * @brief Defines severity levels for log messages
 */
enum class LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
};

/**
 * @class Logger
 * @brief Thread-safe logging system with file and console output
 *
 * Provides structured logging with timestamp, level, module, and message.
 * Supports configurable log levels, file rotation, and ANSI color output.
 *
 * Features:
 * - Multi-threaded safe logging
 * - Configurable verbosity threshold
 * - Automatic timestamp formatting
 * - Module-based categorization
 * - File/console dual output
 * - ANSI color support for terminals
 * - Log file rotation based on size
 */
class Logger {
public:
    /**
     * @brief Gets singleton instance of logger
     * @return Shared pointer to Logger instance
     */
    static std::shared_ptr<Logger> GetInstance();

    /**
     * @brief Initializes logger with specified log directory
     * @param logDir Path to directory where logs will be stored
     * @return true if initialization successful, false otherwise
     */
    bool Initialize(const std::string& logDir);

    /**
     * @brief Sets minimum log level to output
     * @param level Minimum level to log
     */
    void SetLogLevel(LogLevel level);

    /**
     * @brief Logs a message at TRACE level
     * @param module Module/component name
     * @param message Message to log
     */
    void Trace(const std::string& module, const std::string& message);

    /**
     * @brief Logs a message at DEBUG level
     * @param module Module/component name
     * @param message Message to log
     */
    void Debug(const std::string& module, const std::string& message);

    /**
     * @brief Logs a message at INFO level
     * @param module Module/component name
     * @param message Message to log
     */
    void Info(const std::string& module, const std::string& message);

    /**
     * @brief Logs a message at WARN level
     * @param module Module/component name
     * @param message Message to log
     */
    void Warn(const std::string& module, const std::string& message);

    /**
     * @brief Logs a message at ERROR level
     * @param module Module/component name
     * @param message Message to log
     */
    void Error(const std::string& module, const std::string& message);

    /**
     * @brief Logs a message at FATAL level
     * @param module Module/component name
     * @param message Message to log
     */
    void Fatal(const std::string& module, const std::string& message);

    /**
     * @brief Forces flush of all pending log entries
     */
    void Flush();

private:
    // Private constructor for singleton pattern
    Logger();

    // Current log level threshold
    LogLevel m_logLevel;

    // Output file stream
    std::ofstream m_fileStream;

    // Mutex for thread safety
    std::mutex m_mutex;

    // Log directory path
    std::filesystem::path m_logDir;

    // Current log file path
    std::filesystem::path m_currentLogFile;

    // Maximum log file size before rotation (10 MB)
    static constexpr size_t MAX_LOG_SIZE = 10 * 1024 * 1024;

    // Helper: Formats current timestamp
    std::string GetTimestamp() const;

    // Helper: Converts log level to string
    std::string LevelToString(LogLevel level) const;

    // Helper: Gets ANSI color code for log level
    std::string GetColorCode(LogLevel level) const;

    // Helper: Writes formatted log entry
    void WriteLogEntry(LogLevel level, const std::string& module, const std::string& message);

    // Helper: Rotates log file when size limit reached
    void RotateLogFile();

    // Helper: Ensures log directory exists
    bool EnsureLogDirectory() const;
};

// Convenience macros for easier logging
#define LOG_TRACE(module, msg) knoux::core::system::Logger::GetInstance()->Trace(module, msg)
#define LOG_DEBUG(module, msg) knoux::core::system::Logger::GetInstance()->Debug(module, msg)
#define LOG_INFO(module, msg) knoux::core::system::Logger::GetInstance()->Info(module, msg)
#define LOG_WARN(module, msg) knoux::core::system::Logger::GetInstance()->Warn(module, msg)
#define LOG_ERROR(module, msg) knoux::core::system::Logger::GetInstance()->Error(module, msg)
#define LOG_FATAL(module, msg) knoux::core::system::Logger::GetInstance()->Fatal(module, msg)

} // namespace knoux::core::system