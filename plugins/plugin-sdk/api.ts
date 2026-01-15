/**
 * Project: KNOUX Player X™
 * File: api.ts
 * Author: knoux
 * Purpose: Plugin API implementation providing access to player functionality, configuration, UI, and events
 * Layer: Plugins -> Plugin SDK -> API
 */

import {
  PluginContext,
  PlayerAPI,
  ConfigAPI,
  UIAPI,
  EventAPI,
  UtilAPI,
  MediaInfo,
  MediaMetadata,
  PlayerState,
  UIComponent,
  ConfigOption,
  DialogOptions,
  DialogResult
} from './types';

/**
 * Player API implementation
 */
class PlayerAPIImpl implements PlayerAPI {
  async play(): Promise<void> {
    return window.knouxAPI.invoke('plugin:player:play');
  }

  async pause(): Promise<void> {
    return window.knouxAPI.invoke('plugin:player:pause');
  }

  async stop(): Promise<void> {
    return window.knouxAPI.invoke('plugin:player:stop');
  }

  async seek(position: number): Promise<void> {
    return window.knouxAPI.invoke('plugin:player:seek', position);
  }

  async setVolume(volume: number): Promise<void> {
    return window.knouxAPI.invoke('plugin:player:set-volume', volume);
  }

  async getVolume(): Promise<number> {
    return window.knouxAPI.invoke('plugin:player:get-volume');
  }

  async setSpeed(speed: number): Promise<void> {
    return window.knouxAPI.invoke('plugin:player:set-speed', speed);
  }

  async getSpeed(): Promise<number> {
    return window.knouxAPI.invoke('plugin:player:get-speed');
  }

  async loadMedia(source: string): Promise<void> {
    return window.knouxAPI.invoke('plugin:player:load-media', source);
  }

  async getCurrentMedia(): Promise<MediaInfo | null> {
    return window.knouxAPI.invoke('plugin:player:get-current-media');
  }

  async getState(): Promise<PlayerState> {
    return window.knouxAPI.invoke('plugin:player:get-state');
  }
}

/**
 * Configuration API implementation
 */
class ConfigAPIImpl implements ConfigAPI {
  async get<T>(key: string, defaultValue?: T): Promise<T> {
    return window.knouxAPI.invoke('plugin:config:get', key, defaultValue);
  }

  async set<T>(key: string, value: T): Promise<void> {
    return window.knouxAPI.invoke('plugin:config:set', key, value);
  }

  async watch<T>(key: string, callback: (newValue: T, oldValue: T) => void): Promise<void> {
    const listenerId = await window.knouxAPI.invoke('plugin:events:on', `config:${key}`, callback);
    // Store listener ID for cleanup if needed
  }

  async unwatch(key: string, callback: Function): Promise<void> {
    return window.knouxAPI.invoke('plugin:events:off', `config:${key}`, callback);
  }
}

/**
 * UI API implementation
 */
class UIAPIImpl implements UIAPI {
  async addComponent(component: UIComponent): Promise<string> {
    return window.knouxAPI.invoke('plugin:ui:add-component', component);
  }

  async removeComponent(id: string): Promise<void> {
    return window.knouxAPI.invoke('plugin:ui:remove-component', id);
  }

  async updateComponent(id: string, updates: Partial<UIComponent>): Promise<void> {
    return window.knouxAPI.invoke('plugin:ui:update-component', id, updates);
  }

  async showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000): Promise<void> {
    return window.knouxAPI.invoke('plugin:ui:show-notification', message, type, duration);
  }

  async showDialog(options: DialogOptions): Promise<DialogResult> {
    return window.knouxAPI.invoke('plugin:ui:show-dialog', options);
  }
}

/**
 * Event API implementation
 */
class EventAPIImpl implements EventAPI {
  async emit(event: string, data?: any): Promise<void> {
    return window.knouxAPI.invoke('plugin:events:emit', event, data);
  }

  async on(event: string, callback: Function): Promise<string> {
    return window.knouxAPI.invoke('plugin:events:on', event, callback);
  }

  async off(listenerId: string): Promise<void> {
    return window.knouxAPI.invoke('plugin:events:off', listenerId);
  }

  async once(event: string, callback: Function): Promise<string> {
    return window.knouxAPI.invoke('plugin:events:once', event, callback);
  }
}

/**
 * Utility API implementation
 */
class UtilAPIImpl implements UtilAPI {
  http = {
    async get(url: string, options?: RequestInit): Promise<Response> {
      return window.knouxAPI.invoke('plugin:util:http-get', url, options);
    },

    async post(url: string, data: any, options?: RequestInit): Promise<Response> {
      return window.knouxAPI.invoke('plugin:util:http-post', url, data, options);
    },

    async put(url: string, data: any, options?: RequestInit): Promise<Response> {
      return window.knouxAPI.invoke('plugin:util:http-put', url, data, options);
    },

    async delete(url: string, options?: RequestInit): Promise<Response> {
      return window.knouxAPI.invoke('plugin:util:http-delete', url, options);
    }
  };

  fs = {
    async readFile(path: string, encoding: string = 'utf8'): Promise<string | Buffer> {
      return window.knouxAPI.invoke('plugin:util:fs-read-file', path, encoding);
    },

    async writeFile(path: string, data: string | Buffer, encoding: string = 'utf8'): Promise<void> {
      return window.knouxAPI.invoke('plugin:util:fs-write-file', path, data, encoding);
    },

    async exists(path: string): Promise<boolean> {
      return window.knouxAPI.invoke('plugin:util:fs-exists', path);
    },

    async mkdir(path: string): Promise<void> {
      return window.knouxAPI.invoke('plugin:util:fs-mkdir', path);
    }
  };

  json = {
    async parse(text: string): Promise<any> {
      return window.knouxAPI.invoke('plugin:util:json-parse', text);
    },

    async stringify(value: any, space: number = 2): Promise<string> {
      return window.knouxAPI.invoke('plugin:util:json-stringify', value, space);
    }
  };

  string = {
    async slugify(str: string): Promise<string> {
      return window.knouxAPI.invoke('plugin:util:string-slugify', str);
    },

    async capitalize(str: string): Promise<string> {
      return window.knouxAPI.invoke('plugin:util:string-capitalize', str);
    },

    async truncate(str: string, length: number, suffix: string = '...'): Promise<string> {
      return window.knouxAPI.invoke('plugin:util:string-truncate', str, length, suffix);
    }
  };
}

/**
 * Create plugin context
 */
export function createPluginContext(): PluginContext {
  return {
    player: new PlayerAPIImpl(),
    config: new ConfigAPIImpl(),
    ui: new UIAPIImpl(),
    events: new EventAPIImpl(),
    utils: new UtilAPIImpl(),
    logger: {
      debug: (message: string, ...args: any[]) => console.debug(`[PLUGIN] ${message}`, ...args),
      info: (message: string, ...args: any[]) => console.info(`[PLUGIN] ${message}`, ...args),
      warn: (message: string, ...args: any[]) => console.warn(`[PLUGIN] ${message}`, ...args),
      error: (message: string, ...args: any[]) => console.error(`[PLUGIN] ${message}`, ...args)
    }
  };
}

/**
 * Validate plugin structure
 */
export function validatePlugin(plugin: any): boolean {
  if (!plugin || typeof plugin !== 'object') {
    return false;
  }

  // Check required metadata
  if (!plugin.metadata || typeof plugin.metadata !== 'object') {
    return false;
  }

  const requiredMetadata = ['id', 'name', 'version', 'author'];
  for (const field of requiredMetadata) {
    if (!plugin.metadata[field] || typeof plugin.metadata[field] !== 'string') {
      return false;
    }
  }

  // Check if plugin has at least one method or lifecycle hook
  const methods = [...requiredMetadata, 'initialize', 'onLoad', 'onUnload', 'onPlay', 'onPause', 'onStop', 'onSeek', 'onMetadataLoaded', 'onEnded'];
  const hasMethod = methods.some(method => typeof plugin[method] === 'function');
  
  return hasMethod;
}
