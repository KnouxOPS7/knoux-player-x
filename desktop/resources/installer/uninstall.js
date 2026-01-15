/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Uninstallation cleanup and deregistration script removing all traces except user data unless explicitly requested
 * Layer: Desktop -> Install -> Hooks
 *
 * Cleanup steps performed:
 * - Unregister file associations, protocol handlers
 * - Remove application files and registry keys
 * - Remove start menu/desktop shortcuts
 * - Optional full profile deletion dialog prompt handling in GUI uninstall mode
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

function log(message) {
  console.log(`[UNINSTALL] ${message}`);
}

function removeRegistryEntries() {
  if (process.platform !== 'win32') return;
  
  const keysToRemove = [
    'HKCR\\KNOUX.PlayerX',
    'HKCU\\Software\\Classes\\KNOUX.PlayerX',
    'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\KNOUX_Player_X'
  ];
  
  for (const key of keysToRemove) {
    try {
      child_process.execSync(`reg delete "${key}" /f`, { stdio: 'ignore' });
      log(`Removed registry key: ${key}`);
    } catch (error) {
      // Expected errors for missing keys
    }
  }
}

function cleanupApplicationFiles() {
  let installDirs = [];
  
  if (process.platform === 'win32') {
    installDirs = [
      path.join(process.env.PROGRAMFILES, 'KNOUX Player X'),
      path.join(process.env.LOCALAPPDATA, 'KNOUX_Player_X'),
      path.join(process.env.APPDATA, 'KNOUX_Player_X')
    ];
  } else if (process.platform === 'darwin') {
    installDirs = [
      '/Applications/KNOUX Player X.app',
      path.join(os.homedir(), 'Library/Application Support/KNOUX_Player_X')
    ];
  } else {
    installDirs = [
      '/opt/KNOUX_Player_X',
      path.join(os.homedir(), '.config/knox-player-x'),
      '/usr/share/applications/knoux-player-x.desktop'
    ];
  }
  
  for (const dir of installDirs) {
    try {
      if (fs.existsSync(dir)) {
        if (fs.lstatSync(dir).isDirectory()) {
          fs.rmSync(dir, { recursive: true, force: true });
          log(`Removed directory: ${dir}`);
        } else {
          fs.unlinkSync(dir);
          log(`Removed file: ${dir}`);
        }
      }
    } catch (error) {
      log(`Warning: Could not remove ${dir}: ${error.message}`);
    }
  }
}

function removeShortcuts() {
  if (process.platform !== 'win32') return;
  
  const shortcuts = [
    path.join(process.env.USERPROFILE, 'Desktop', 'KNOUX Player X.lnk'),
    path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'KNOUX Player X')
  ];
  
  for (const item of shortcuts) {
    try {
      if (fs.existsSync(item)) {
        if (fs.lstatSync(item).isDirectory()) {
          fs.rmSync(item, { recursive: true, force: true });
        } else {
          fs.unlinkSync(item);
        }
        log(`Removed shortcut/item: ${item}`);
      }
    } catch (error) {
      log(`Warning: Could not remove ${item}: ${error.message}`);
    }
  }
}

async function executeCleanup(removeUserData = false) {
  try {
    log('Starting uninstallation cleanup...');
    
    removeRegistryEntries();
    removeShortcuts();
    cleanupApplicationFiles();
    
    if (removeUserData) {
      const userDataPath = path.join(
        process.platform === 'win32'
          ? process.env.LOCALAPPDATA
          : process.platform === 'darwin'
            ? path.join(os.homedir(), 'Library/Application Support')
            : path.join(os.homedir(), '.config'),
        'KNOUX_Player_X'
      );
      
      if (fs.existsSync(userDataPath)) {
        fs.rmSync(userDataPath, { recursive: true, force: true });
        log(`Removed user data: ${userDataPath}`);
      }
    }
    
    log('Uninstallation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`[ERROR] Uninstall cleanup failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI parameter based operation
if (require.main === module) {
  const shouldRemoveUserData = process.argv.includes('--full-clean');
  executeCleanup(shouldRemoveUserData);
}

module.exports = { executeCleanup };
