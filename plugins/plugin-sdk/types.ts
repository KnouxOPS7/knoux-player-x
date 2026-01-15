/**
 * Project: KNOUX Player X™
 * File: types.ts
 * Author: knoux
 * Purpose: Type definitions for plugin SDK interfaces, enums, and data structures
 * Layer: Plugins -> Plugin SDK -> Types
 */

// Core plugin metadata
export interface PluginMetadata {
  /** Unique identifier for the plugin */
  id: string;
  
  /** Human-readable name of the plugin */
  name: string;
  
  /** Brief description of plugin functionality */
  description: string;
  
  /** Plugin version in semver format */
  version: string;
  
  /** Plugin author information */
  author: string;
  
  /** Website or repository URL */
  homepage?: string;
  
  /** Supported KNOUX Player X version range */
  compatibleVersion: string;
  
  /** Plugin categories/tags */
  tags?: string[];
  
  /** Plugin icon/data URI */
  icon?: string;
}

// Plugin lifecycle hooks
export interface PluginLifecycle {
  /** Called when plugin is loaded */
  onLoad?: () => Promise<void> | void;
  
  /** Called when plugin is unloaded */
  onUnload?: () => Promise<void> | void;
  
  /** Called when player starts playing media */
  onPlay?: (mediaInfo: MediaInfo) => Promise<void> | void;
  
  /** Called when player pauses media */
  onPause?: (mediaInfo: MediaInfo) => Promise<void> | void;
  
  /** Called when player stops media */
  onStop?: (mediaInfo: MediaInfo) => Promise<void> | void;
  
  /** Called when seeking occurs */
  onSeek?: (position: number, mediaInfo: MediaInfo) => Promise<void> | void;
  
  /** Called when media metadata is loaded */
  onMetadataLoaded?: (metadata: MediaMetadata) => Promise<void> | void;
  
  /** Called when playback ends */
  onEnded?: (mediaInfo: MediaInfo) => Promise<void> | void;
}

// Media information structure
export interface MediaInfo {
  /** Full file path or URL */
  source: string;
  
  /** Media title */
  title: string;
  
  /** Media duration in seconds */
  duration: number;
  
  /** Current playback position in seconds */
  currentPosition: number;
  
  /** Media type */
  type: MediaType;
  
  /** File extension */
  extension: string;
  
  /** File size in bytes */
  fileSize?: number;
  
  /** Bitrate in kbps */
  bitrate?: number;
}

// Media types enumeration
export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
  STREAM = 'stream',
  PLAYLIST = 'playlist'
}

// Media metadata structure
export interface MediaMetadata {
  /** Title */
  title?: string;
  
  /** Artist/Band */
  artist?: string;
  
  /** Album */
  album?: string;
  
  /** Year */
  year?: number;
  
  /** Genre */
  genre?: string;
  
  /** Track number */
  track?: number;
  
  /** Cover art data URI or URL */
  coverArt?: string;
  
  /** Additional custom metadata */
  custom?: Record<string, any>;
}

// UI component types
export interface UIComponent {
  /** Component type */
  type: ComponentType;
  
  /** Component identifier */
  id: string;
  
  /** Component properties */
  props: Record<string, any>;
  
  /** Component event handlers */
  events?: Record<string, Function>;
}

// Component types enumeration
export enum ComponentType {
  BUTTON = 'button',
  SLIDER = 'slider',
  DROPDOWN = 'dropdown',
  TEXTBOX = 'textbox',
  PANEL = 'panel',
  CUSTOM = 'custom'
}

// Configuration options
export interface ConfigOption {
  /** Option key */
  key: string;
  
  /** Option label */
  label: string;
  
  /** Option type */
  type: ConfigType;
  
  /** Default value */
  defaultValue: any;
  
  /** Available options for dropdown/select */
  options?: any[];
  
  /** Minimum value for numeric types */
  min?: number;
  
  /** Maximum value for numeric types */
  max?: number;
  
  /** Step value for numeric types */
  step?: number;
  
  /** Help text/documentation */
  help?: string;
}

// Configuration types enumeration
export enum ConfigType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  COLOR = 'color',
  FILE = 'file'
}

// Player API methods
export interface PlayerAPI {
  /** Play media */
  play: () => Promise<void>;
  
  /** Pause media */
  pause: () => Promise<void>;
  
  /** Stop media */
  stop: () => Promise<void>;
  
  /** Seek to position */
  seek: (position: number) => Promise<void>;
  
  /** Set volume */
  setVolume: (volume: number) => Promise<void>;
  
  /** Get current volume */
  getVolume: () => Promise<number>;
  
  /** Set playback speed */
  setSpeed: (speed: number) => Promise<void>;
  
  /** Get current playback speed */
  getSpeed: () => Promise<number>;
  
  /** Load media */
  loadMedia: (source: string) => Promise<void>;
  
  /** Get current media info */
  getCurrentMedia: () => Promise<MediaInfo | null>;
  
  /** Get player state */
  getState: () => Promise<PlayerState>;
}

// Player states enumeration
export enum PlayerState {
  STOPPED = 'stopped',
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  ERROR = 'error'
}

// Event system types
export interface PluginEvent {
  /** Event name/type */
  name: string;
  
  /** Event data/payload */
  data?: any;
  
  /** Event timestamp */
  timestamp: number;
}

// Logger interface
export interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

// Plugin context provided to plugins
export interface PluginContext {
  /** Player API */
  player: PlayerAPI;
  
  /** Logger instance */
  logger: Logger;
  
  /** Configuration API */
  config: ConfigAPI;
  
  /** UI API */
  ui: UIAPI;
  
  /** Event system */
  events: EventAPI;
  
  /** Utility functions */
  utils: UtilAPI;
}

// Configuration API
export interface ConfigAPI {
  /** Get configuration value */
  get: <T>(key: string, defaultValue?: T) => Promise<T>;
  
  /** Set configuration value */
  set: <T>(key: string, value: T) => Promise<void>;
  
  /** Watch configuration changes */
  watch: <T>(key: string, callback: (newValue: T, oldValue: T) => void) => Promise<void>;
  
  /** Unwatch configuration changes */
  unwatch: (key: string, callback: Function) => Promise<void>;
}

// UI API
export interface UIAPI {
  /** Add UI component to interface */
  addComponent: (component: UIComponent) => Promise<string>;
  
  /** Remove UI component */
  removeComponent: (id: string) => Promise<void>;
  
  /** Update UI component */
  updateComponent: (id: string, updates: Partial<UIComponent>) => Promise<void>;
  
  /** Show notification */
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => Promise<void>;
  
  /** Show dialog */
  showDialog: (options: DialogOptions) => Promise<DialogResult>;
}

// Dialog options
export interface DialogOptions {
  title: string;
  message: string;
  type?: 'info' | 'question' | 'warning' | 'error';
  buttons?: string[];
  defaultButton?: number;
  cancelButton?: number;
}

// Dialog result
export interface DialogResult {
  button: number;
  checked?: boolean;
}

// Event API
export interface EventAPI {
  /** Emit event */
  emit: (event: string, data?: any) => Promise<void>;
  
  /** Listen for events */
  on: (event: string, callback: Function) => Promise<string>;
  
  /** Remove event listener */
  off: (listenerId: string) => Promise<void>;
  
  /** Listen for events once */
  once: (event: string, callback: Function) => Promise<string>;
}

// Utility API
export interface UtilAPI {
  /** HTTP request utility */
  http: {
    get: (url: string, options?: RequestInit) => Promise<Response>;
    post: (url: string, data: any, options?: RequestInit) => Promise<Response>;
    put: (url: string, data: any, options?: RequestInit) => Promise<Response>;
    delete: (url: string, options?: RequestInit) => Promise<Response>;
  };
  
  /** File system operations */
  fs: {
    readFile: (path: string, encoding?: string) => Promise<string | Buffer>;
    writeFile: (path: string, data: string | Buffer, encoding?: string) => Promise<void>;
    exists: (path: string) => Promise<boolean>;
    mkdir: (path: string) => Promise<void>;
  };
  
  /** JSON operations */
  json: {
    parse: (text: string) => Promise<any>;
    stringify: (value: any, space?: number) => Promise<string>;
  };
  
  /** String utilities */
  string: {
    slugify: (str: string) => Promise<string>;
    capitalize: (str: string) => Promise<string>;
    truncate: (str: string, length: number, suffix?: string) => Promise<string>;
  };
}

// Base plugin interface
export interface Plugin extends PluginLifecycle {
  /** Plugin metadata */
  metadata: PluginMetadata;
  
  /** Configuration options */
  configOptions?: ConfigOption[];
  
  /** Initialize plugin */
  initialize?: (context: PluginContext) => Promise<void> | void;
}
