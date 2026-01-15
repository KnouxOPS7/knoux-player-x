import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';
import { setupDSPMainHandler } from './native/dsp/dspBridge';

// Webpack provides these
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

function resolvePreload(preloadPath: string): string {
  try {
    if (fs.existsSync(preloadPath)) return preloadPath;
    const alt1 = path.join(
      process.cwd(),
      '.webpack',
      'x64',
      'renderer',
      'main_window',
      'preload.js'
    );
    if (fs.existsSync(alt1)) return alt1;
    const alt2 = path.join(process.cwd(), '.webpack', 'renderer', 'main_window', 'preload.js');
    if (fs.existsSync(alt2)) return alt2;
    return preloadPath;
  } catch {
    return preloadPath;
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: resolvePreload(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY),
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setupDSPMainHandler();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
