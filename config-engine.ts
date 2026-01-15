import { Settings } from './types';
import { ipc } from './ipc';

const STORAGE_KEY = 'knox_v2_settings';

export const ConfigEngine = {
  async getSettings(): Promise<Settings | null> {
    return await ipc.load(STORAGE_KEY);
  },

  async saveSettings(settings: Settings) {
    await ipc.save(STORAGE_KEY, settings);
  }
};
