/**
 * Project: KNOUX Player X™
 * Layer: Electron Main Process (Renderer-facing entry)
 */

import { app, BrowserWindow, dialog, ipcMain, powerSaveBlocker, protocol, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { parseFile } from "music-metadata";
import os from "os";
import path from "path";
import { URL } from "url";
import { setupSecurity } from "./security";
import { TelemetryService } from "../services/TelemetryService";

let mainWindow: BrowserWindow | null = null;
let powerBlockerId: number | null = null;
const telemetry = new TelemetryService();

const normalizeFilePath = (input: string): string => {
    if (input.startsWith("knoux://")) {
        const parsed = new URL(input);
        let filePath = decodeURIComponent(parsed.pathname);
        if (process.platform === "win32" && filePath.startsWith("/")) {
            filePath = filePath.slice(1);
        }
        return filePath;
    }
    return input;
};

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 820,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "..", "preload", "preload.js")
        }
    });

    mainWindow.loadFile(path.join(__dirname, "..", "..", "index.html"));

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};

app.whenReady().then(async () => {
    setupSecurity();
    protocol.registerFileProtocol("knoux", (request, callback) => {
        try {
            const parsed = new URL(request.url);
            let filePath = decodeURIComponent(parsed.pathname);
            if (process.platform === "win32" && filePath.startsWith("/")) {
                filePath = filePath.slice(1);
            }
            callback({ path: filePath });
        } catch (error) {
            console.error("Failed to resolve knoux protocol path", error);
            callback({ error: -6 });
        }
    });

    createWindow();
    if (powerBlockerId === null) {
        powerBlockerId = powerSaveBlocker.start("prevent-display-sleep");
    }
    setInterval(async () => {
        if (!mainWindow) {
            return;
        }
        try {
            const metrics = await telemetry.collectMetrics();
            mainWindow.webContents.send("telemetry:update", metrics);
        } catch (error) {
            console.error("Telemetry update failed", error);
        }
    }, 30000);

    ipcMain.handle("dialog:openFiles", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openFile", "multiSelections"],
            filters: [
                { name: "Media", extensions: ["mp3", "wav", "flac", "mp4", "mkv", "webm", "mov"] }
            ]
        });
        return result.filePaths;
    });

    ipcMain.handle("system:openExternal", async (_event, url: string) => {
        await shell.openExternal(url);
        return true;
    });

    ipcMain.handle("media:parse-metadata", async (_event, filePath: string) => {
        const resolvedPath = normalizeFilePath(filePath);
        const metadata = await parseFile(resolvedPath, { duration: true });
        const { common, format } = metadata;
        return {
            title: common.title ?? path.basename(resolvedPath),
            artist: common.artist,
            album: common.album,
            year: common.year ? String(common.year) : undefined,
            durationSec: format.duration ?? 0,
            bitrate: format.bitrate ?? 0,
            sampleRate: format.sampleRate,
            channels: format.numberOfChannels,
            audioCodec: format.codec,
            videoCodec: format.codec,
            hasCoverArt: Boolean(common.picture && common.picture.length > 0)
        };
    });

    ipcMain.handle("system:get-diagnostics", async () => {
        const cpuUsage = process.getCPUUsage();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const gpuInfo = await app.getGPUInfo("basic");
        return {
            cpuLoad: cpuUsage.percentCPUUsage,
            ramUsage: process.memoryUsage().rss,
            totalMemory,
            freeMemory,
            appVersion: app.getVersion(),
            platform: process.platform,
            arch: process.arch,
            gpuModel: gpuInfo?.gpuDevice?.[0]?.deviceString,
            uptimeSec: process.uptime(),
            networkInterfaces: Object.keys(os.networkInterfaces() ?? {})
        };
    });

    ipcMain.handle("update:check", async () => {
        try {
            autoUpdater.autoDownload = false;
            const result = await autoUpdater.checkForUpdates();
            return {
                updateAvailable: Boolean(result?.updateInfo?.version),
                version: result?.updateInfo?.version,
                releaseName: result?.updateInfo?.releaseName
            };
        } catch (error) {
            console.error("Update check failed", error);
            return {
                updateAvailable: false
            };
        }
    });

    ipcMain.handle("system:getAppPath", () => {
        return app.getAppPath();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        if (powerBlockerId !== null && powerSaveBlocker.isStarted(powerBlockerId)) {
            powerSaveBlocker.stop(powerBlockerId);
            powerBlockerId = null;
        }
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
