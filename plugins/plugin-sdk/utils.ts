/**
 * Project: KNOUX Player X™
 * File: utils.ts
 * Author: knoux
 * Purpose: Utility functions and helpers for plugin development
 * Layer: Plugins -> Plugin SDK -> Utilities
 */

import { ConfigOption, ConfigType, MediaInfo, MediaType } from './types';

/**
 * Generate unique ID
 */
export function generateId(prefix: string = 'knx'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate configuration option
 */
export function validateConfigOption(option: ConfigOption): boolean {
  if (!option.key || typeof option.key !== 'string') {
    return false;
  }

  if (!option.label || typeof option.label !== 'string') {
    return false;
  }

  if (!option.type || !Object.values(ConfigType).includes(option.type)) {
    return false;
  }

  // Validate defaultValue against type
  switch (option.type) {
    case ConfigType.STRING:
      if (option.defaultValue !== undefined && typeof option.defaultValue !== 'string') {
        return false;
      }
      break;
    case ConfigType.NUMBER:
      if (option.defaultValue !== undefined && typeof option.defaultValue !== 'number') {
        return false;
      }
      if (option.min !== undefined && typeof option.min !== 'number') {
        return false;
      }
      if (option.max !== undefined && typeof option.max !== 'number') {
        return false;
      }
      if (option.step !== undefined && typeof option.step !== 'number') {
        return false;
      }
      break;
    case ConfigType.BOOLEAN:
      if (option.defaultValue !== undefined && typeof option.defaultValue !== 'boolean') {
        return false;
      }
      break;
    case ConfigType.SELECT:
      if (!Array.isArray(option.options)) {
        return false;
      }
      if (option.defaultValue !== undefined && !option.options.includes(option.defaultValue)) {
        return false;
      }
      break;
    case ConfigType.COLOR:
      if (option.defaultValue !== undefined && typeof option.defaultValue !== 'string') {
        return false;
      }
      // Simple color validation (hex)
      if (option.defaultValue && !/^#[0-9A-F]{6}$/i.test(option.defaultValue)) {
        return false;
      }
      break;
    case ConfigType.FILE:
      if (option.defaultValue !== undefined && typeof option.defaultValue !== 'string') {
        return false;
      }
      break;
  }

  return true;
}

/**
 * Format time in seconds to HH:MM:SS
 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Parse time string (HH:MM:SS or MM:SS) to seconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':').map(part => parseInt(part, 10));
  
  if (parts.some(isNaN)) {
    return 0;
  }
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    // SS
    return parts[0];
  }
  
  return 0;
}

/**
 * Get media type from file extension
 */
export function getMediaType(extension: string): MediaType {
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
  const audioExtensions = ['.mp3', '.wav', '.aac', '.flac', '.m4a', '.wma', '.ogg', '.opus'];
  
  const ext = extension.toLowerCase();
  
  if (videoExtensions.includes(ext)) {
    return MediaType.VIDEO;
  } else if (audioExtensions.includes(ext)) {
    return MediaType.AUDIO;
  }
  
  return MediaType.STREAM;
}

/**
 * Slugify string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Truncate string with suffix
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) {
    return str;
  }
  
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  if (typeof obj === 'object') {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Promise-based delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if value is valid media info
 */
export function isValidMediaInfo(info: any): info is MediaInfo {
  if (!info || typeof info !== 'object') {
    return false;
  }
  
  const requiredFields = ['source', 'title', 'duration', 'currentPosition', 'type', 'extension'];
  
  for (const field of requiredFields) {
    if (!(field in info)) {
      return false;
    }
  }
  
  return typeof info.source === 'string' &&
         typeof info.title === 'string' &&
         typeof info.duration === 'number' &&
         typeof info.currentPosition === 'number' &&
         Object.values(MediaType).includes(info.type) &&
         typeof info.extension === 'string';
}
