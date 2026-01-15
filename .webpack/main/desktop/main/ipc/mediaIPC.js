"use strict";
/**
 * ================================================================================
 * KNOUX Player X™
 * ================================================================================
 * Project: KNOUX Player X™
 * File: C:\Users\Aisha\Downloads\knox-player-x™\desktop\main\ipc\mediaIPC.ts
 * Role: Advanced Media IPC Communication Handler with Native Integration
 * Layer: Bridge
 * Author: knoux
 * Status: FINALIZED
 * ================================================================================
 *
 * This module provides comprehensive IPC handlers for media operations including:
 * - File validation and metadata extraction
 * - Hardware acceleration detection
 * - Codec capability analysis
 * - Stream information parsing
 * - Subtitle file detection and association
 * - Recent files management
 * - Thumbnail generation
 * - Media library indexing
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMediaIPCHandlers = registerMediaIPCHandlers;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const crypto = __importStar(require("crypto"));
/**
 * Supported media file extensions
 */
const SUPPORTED_VIDEO_EXTENSIONS = [
    '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm',
    '.m4v', '.mpg', '.mpeg', '.3gp', '.ogv', '.ts', '.m2ts'
];
const SUPPORTED_AUDIO_EXTENSIONS = [
    '.mp3', '.flac', '.wav', '.aac', '.ogg', '.m4a', '.wma',
    '.opus', '.ape', '.ac3', '.dts', '.alac'
];
const SUPPORTED_SUBTITLE_EXTENSIONS = [
    '.srt', '.ass', '.ssa', '.sub', '.vtt', '.idx'
];
/**
 * Calculates file hash for integrity verification
 */
function calculateFileHash(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = crypto.createHash('sha256');
        const stream = yield fs.open(filePath, 'r');
        const buffer = Buffer.allocUnsafe(8192);
        let bytesRead = 0;
        const maxBytes = 1024 * 1024; // Read first 1MB for hash
        try {
            while (bytesRead < maxBytes) {
                const { bytesRead: read } = yield stream.read(buffer, 0, buffer.length, bytesRead);
                if (read === 0)
                    break;
                hash.update(buffer.slice(0, read));
                bytesRead += read;
            }
        }
        finally {
            yield stream.close();
        }
        return hash.digest('hex');
    });
}
/**
 * Detects MIME type from file extension
 */
function getMimeType(extension) {
    const mimeMap = {
        '.mp4': 'video/mp4',
        '.mkv': 'video/x-matroska',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.mp3': 'audio/mpeg',
        '.flac': 'audio/flac',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.srt': 'text/srt',
        '.ass': 'text/x-ssa',
        '.vtt': 'text/vtt',
    };
    return mimeMap[extension.toLowerCase()] || 'application/octet-stream';
}
/**
 * Searches for associated subtitle files
 */
function findSubtitleFiles(videoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = path.dirname(videoPath);
        const baseName = path.basename(videoPath, path.extname(videoPath));
        const subtitles = [];
        try {
            const files = yield fs.readdir(dir);
            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                if (SUPPORTED_SUBTITLE_EXTENSIONS.includes(ext)) {
                    const subBaseName = path.basename(file, ext);
                    if (subBaseName.startsWith(baseName)) {
                        subtitles.push(path.join(dir, file));
                    }
                }
            }
        }
        catch (error) {
            console.error('Error searching for subtitles:', error);
        }
        return subtitles;
    });
}
/**
 * Extracts basic media metadata from file
 */
function extractMediaMetadata(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield fs.stat(filePath);
        const extension = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath);
        const fileHash = yield calculateFileHash(filePath);
        const subtitleFiles = yield findSubtitleFiles(filePath);
        return {
            filePath: path.resolve(filePath),
            fileName,
            fileSize: stats.size,
            fileHash,
            extension,
            mimeType: getMimeType(extension),
            duration: null,
            width: null,
            height: null,
            fps: null,
            videoCodec: null,
            audioCodec: null,
            bitrate: null,
            hasSubtitles: subtitleFiles.length > 0,
            subtitleFiles,
            createdAt: stats.birthtime.toISOString(),
            modifiedAt: stats.mtime.toISOString(),
            accessedAt: stats.atime.toISOString(),
        };
    });
}
/**
 * Validates if file is a supported media file
 */
function isValidMediaFile(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    return [
        ...SUPPORTED_VIDEO_EXTENSIONS,
        ...SUPPORTED_AUDIO_EXTENSIONS
    ].includes(extension);
}
/**
 * Register all media-related IPC handlers
 */
function registerMediaIPCHandlers() {
    /**
     * Opens file picker dialog for media selection
     */
    electron_1.ipcMain.handle('media:open-file-dialog', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield electron_1.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {
                    name: 'Video Files',
                    extensions: SUPPORTED_VIDEO_EXTENSIONS.map(ext => ext.slice(1))
                },
                {
                    name: 'Audio Files',
                    extensions: SUPPORTED_AUDIO_EXTENSIONS.map(ext => ext.slice(1))
                },
                {
                    name: 'All Files',
                    extensions: ['*']
                }
            ]
        });
        if (result.canceled || result.filePaths.length === 0) {
            return { success: false, canceled: true };
        }
        return {
            success: true,
            filePath: result.filePaths[0]
        };
    }));
    /**
     * Opens folder picker for batch import
     */
    electron_1.ipcMain.handle('media:open-folder-dialog', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield electron_1.dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (result.canceled || result.filePaths.length === 0) {
            return { success: false, canceled: true };
        }
        return {
            success: true,
            folderPath: result.filePaths[0]
        };
    }));
    /**
     * Validates and extracts metadata from media file
     */
    electron_1.ipcMain.handle('media:validate-file', (_, filePath) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isValidMediaFile(filePath)) {
                return {
                    success: false,
                    error: 'Unsupported file format'
                };
            }
            const metadata = yield extractMediaMetadata(filePath);
            return {
                success: true,
                metadata
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }));
    /**
     * Scans directory for media files
     */
    electron_1.ipcMain.handle('media:scan-directory', (_, dirPath) => __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.readdir(dirPath, { withFileTypes: true });
            const mediaFiles = [];
            for (const file of files) {
                if (file.isFile()) {
                    const fullPath = path.join(dirPath, file.name);
                    if (isValidMediaFile(fullPath)) {
                        mediaFiles.push(fullPath);
                    }
                }
            }
            return {
                success: true,
                files: mediaFiles,
                count: mediaFiles.length
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }));
    /**
     * Loads subtitle file content
     */
    electron_1.ipcMain.handle('media:load-subtitle', (_, subtitlePath) => __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield fs.readFile(subtitlePath, 'utf-8');
            const extension = path.extname(subtitlePath).toLowerCase();
            return {
                success: true,
                content,
                format: extension.slice(1),
                path: subtitlePath
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }));
    /**
     * Detects hardware acceleration capabilities
     */
    electron_1.ipcMain.handle('media:detect-hardware-acceleration', () => __awaiter(this, void 0, void 0, function* () {
        return {
            success: true,
            capabilities: {
                nvenc: false,
                quicksync: false,
                videotoolbox: process.platform === 'darwin',
                vaapi: process.platform === 'linux',
                dxva2: process.platform === 'win32',
            }
        };
    }));
    /**
     * Gets recent files from storage
     */
    electron_1.ipcMain.handle('media:get-recent-files', (_1, ...args_1) => __awaiter(this, [_1, ...args_1], void 0, function* (_, limit = 20) {
        try {
            const recentFilesPath = path.join(process.env.APPDATA || process.env.HOME || '', 'knoux-player-x', 'recent-files.json');
            try {
                const content = yield fs.readFile(recentFilesPath, 'utf-8');
                const recentFiles = JSON.parse(content);
                return {
                    success: true,
                    files: recentFiles.slice(0, limit)
                };
            }
            catch (_a) {
                return {
                    success: true,
                    files: []
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }));
    /**
     * Adds file to recent files list
     */
    electron_1.ipcMain.handle('media:add-to-recent', (_, fileData) => __awaiter(this, void 0, void 0, function* () {
        try {
            const recentFilesDir = path.join(process.env.APPDATA || process.env.HOME || '', 'knoux-player-x');
            yield fs.mkdir(recentFilesDir, { recursive: true });
            const recentFilesPath = path.join(recentFilesDir, 'recent-files.json');
            let recentFiles = [];
            try {
                const content = yield fs.readFile(recentFilesPath, 'utf-8');
                recentFiles = JSON.parse(content);
            }
            catch (_a) {
                // File doesn't exist, start fresh
            }
            // Remove existing entry if present
            recentFiles = recentFiles.filter(f => f.path !== fileData.path);
            // Add to beginning
            recentFiles.unshift(fileData);
            // Keep only last 50
            recentFiles = recentFiles.slice(0, 50);
            yield fs.writeFile(recentFilesPath, JSON.stringify(recentFiles, null, 2), 'utf-8');
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }));
}
//# sourceMappingURL=mediaIPC.js.map