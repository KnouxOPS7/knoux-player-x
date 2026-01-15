/**
 * KNOX Player X™ IPC Gateway
 * This file defines the communication protocol between the UI and Native layers.
 */

export interface KNOXBridge {
  // Filesystem
  openFile: () => Promise<string | null>;
  saveConfig: (config: any) => Promise<void>;
  loadConfig: () => Promise<any>;
  
  // Media Engine (Native)
  invokeFFmpeg: (command: string) => Promise<any>;
  takeScreenshot: (time: number) => Promise<string>;
  
  // System
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  getSystemInfo: () => Promise<{ cpu: string; gpu: string; mem: string }>;
}

// Global window extension
declare global {
  interface Window {
    knox?: KNOXBridge;
  }
}

/**
 * IPC Selector
 * Decides whether to use Web Storage or Native IPC based on environment.
 */
export const isDesktop = () => !!window.knox;

export const ipc = {
  async save(key: string, data: any) {
    if (isDesktop()) return window.knox!.saveConfig({ [key]: data });
    localStorage.setItem(key, JSON.stringify(data));
  },
  async load(key: string) {
    if (isDesktop()) {
      const config = await window.knox!.loadConfig();
      return config[key];
    }
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};
