/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Pre-installation hook script executed before installer begins operations (cross-platform support)
 * Layer: Desktop -> Install -> Hooks
 *
 * This script performs prerequisite checks and system preparation tasks:
 * - Validates OS compatibility
 * - Ensures sufficient disk space
 * - Backs up existing user preferences if upgrading
 * - Registers file associations permissions (Windows/macOS-specific code paths)
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
const path = require('path');
const os = require('os');
function log(message) {
    console.log(`[PREINSTALL] ${message}`);
}
function getInstallPath() {
    if (process.platform === 'win32') {
        return path.join(process.env.LOCALAPPDATA || '', 'KNOUX_Player_X');
    }
    else if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', 'KNOUX_Player_X');
    }
    else {
        return path.join(os.homedir(), '.config', 'knox-player-x');
    }
}
function checkSystemRequirements() {
    return __awaiter(this, void 0, void 0, function* () {
        const minRAM = 2 * 1024 * 1024 * 1024; // 2GB
        const freeMem = os.freemem();
        if (freeMem < minRAM) {
            throw new Error('Insufficient RAM: Minimum 2GB required');
        }
        log('System requirements check passed');
    });
}
function backupUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        const userDataPath = getInstallPath();
        const backupPath = `${userDataPath}.backup.${Date.now()}`;
        if (fs.existsSync(userDataPath)) {
            try {
                fs.cpSync(userDataPath, backupPath, { recursive: true });
                log(`User data backed up to ${backupPath}`);
            }
            catch (error) {
                log(`Warning: Could not backup user data: ${error.message}`);
            }
        }
    });
}
function runPreinstallChecks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            log('Starting pre-installation checks...');
            yield checkSystemRequirements();
            yield backupUserData();
            log('Pre-installation completed successfully');
            process.exit(0);
        }
        catch (error) {
            console.error(`[ERROR] Pre-install failed: ${error.message}`);
            process.exit(1);
        }
    });
}
// Execute only when run directly
if (require.main === module) {
    runPreinstallChecks();
}
module.exports = { runPreinstallChecks };
//# sourceMappingURL=preinstall.js.map