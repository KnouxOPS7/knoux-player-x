
export enum PlaybackState {
  Stopped = 'Stopped',
  Playing = 'Playing',
  Paused = 'Paused',
  Buffering = 'Buffering',
  Error = 'Error'
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size?: number;
  duration?: number;
  type: 'video' | 'audio';
  lastPosition?: number;
  codec?: string;
  resolution?: string;
  fps?: number;
  bitrate?: number;
}

export interface Settings {
  appearance: {
    theme: string;
    uiOpacity: number;
    blurStrength: number;
    accentColor: string;
    showThumbnails: boolean;
    compactMode: boolean;
    autoHideControls: boolean;
    alwaysShowMenuBar: boolean;
    rememberWindowPosition: boolean;
    language: string;
  };
  performance: {
    hardwareAccel: string;
    frameDropping: boolean;
    hwDecode: boolean;
    hwRender: boolean;
    decoderThreads: number;
    cacheSize: number;
    preloadNext: boolean;
  };
  audio: {
    outputDevice: string;
    channelLayout: string;
    defaultVolume: number;
    rememberVolume: boolean;
    startMuted: boolean;
    normalization: boolean;
    equalizerPreset: string;
    equalizerBands: number[];
  };
  video: {
    aspectRatio: string;
    deinterlace: string;
    autoRotate: boolean;
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    gamma: number;
    screenshotFormat: string;
  };
  subtitles: {
    autoLoad: boolean;
    fontFamily: string;
    fontSize: number;
    textColor: string;
    outlineColor: string;
    outlineWidth: number;
    bgOpacity: number;
    bold: boolean;
    italic: boolean;
    position: string;
    margin: number;
  };
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'WARNING' | 'ERROR';
  module: string;
  message: string;
}
