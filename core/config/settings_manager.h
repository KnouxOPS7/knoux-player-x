#pragma once

#include <string>
#include <unordered_map>
#include <memory>
#include <filesystem>
#include <nlohmann/json.hpp>

namespace knoux::core::config {

/**
 * @class SettingsManager
 * @brief Centralized configuration manager for KNOUX Player X™.
 * 
 * This class provides a thread-safe interface to load, save, and query
 * application-wide settings. All configurations are persisted in JSON format
 * under the user's local app data directory.
 * 
 * Features:
 * - Auto-creation of config directory if missing
 * - Persistent storage using JSON serialization
 * - Type-safe access via template getters
 * - Validation on load
 * - Automatic backup on critical changes
 */
class SettingsManager {
public:
    /**
     * @brief Singleton instance accessor
     */
    static std::shared_ptr<SettingsManager> GetInstance();

    /**
     * @brief Loads settings from disk or creates default ones
     * @return true if successful, false otherwise
     */
    bool Load();

    /**
     * @brief Saves current settings to disk
     * @return true if successful, false otherwise
     */
    bool Save() const;

    /**
     * @brief Sets a value by key with type safety
     * @tparam T Type of the value
     * @param key Setting key
     * @param value Value to set
     * @return true if success, false if invalid type or path error
     */
    template<typename T>
    bool Set(const std::string& key, const T& value);

    /**
     * @brief Gets a value by key with type safety
     * @tparam T Expected return type
     * @param key Setting key
     * @param defaultValue Fallback value if key not found
     * @return The stored value or default
     */
    template<typename T>
    T Get(const std::string& key, const T& defaultValue) const;

    /**
     * @brief Checks if a setting exists
     * @param key Key to check
     * @return true if present, false otherwise
     */
    bool Has(const std::string& key) const;

    /**
     * @brief Removes a setting
     * @param key Key to remove
     * @return true if removed, false if not found
     */
    bool Remove(const std::string& key);

    /**
     * @brief Clears all settings
     * @return true if cleared successfully
     */
    bool Clear();

    /**
     * @brief Returns the full path to the config file
     * @return Absolute path as string
     */
    std::string GetConfigPath() const;

private:
    // Private constructor for singleton pattern
    SettingsManager();

    // Path to the config file
    std::filesystem::path m_configPath;

    // In-memory storage of settings
    nlohmann::json m_settings;

    // Mutex for thread safety
    mutable std::mutex m_mutex;

    // Helper: Ensures config directory exists
    bool EnsureConfigDir() const;
};

// Template implementations must be defined inline due to linkage issues
template<typename T>
bool SettingsManager::Set(const std::string& key, const T& value) {
    std::lock_guard<std::mutex> lock(m_mutex);
    try {
        m_settings[key] = value;
        return true;
    } catch (...) {
        return false;
    }
}

template<typename T>
T SettingsManager::Get(const std::string& key, const T& defaultValue) const {
    std::lock_guard<std::mutex> lock(m_mutex);
    try {
        if (m_settings.contains(key)) {
            return m_settings[key].get<T>();
        }
        return defaultValue;
    } catch (...) {
        return defaultValue;
    }
}

} // namespace knoux::core::config