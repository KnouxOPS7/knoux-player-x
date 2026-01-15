/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Electron Builder configuration for cross-platform packaging with custom installer branding, code signing, and auto-update settings
 * Layer: Desktop -> Build -> Configuration
 *
 * Related files:
 * - desktop/resources/installer/installer.nsi (Windows NSIS script)
 * - desktop/resources/installer/dmg.json (macOS DMG configuration)
 * - package.json (build scripts and product info)
 */

module.exports = {
  appId: "com.knoux.playerx",
  productName: "KNOUX Player X",
  copyright: "Copyright © 2026 SADEK ELGAZAR (KNOUX)",
  
  // Directory structure
  directories: {
    output: "dist",
    buildResources: "desktop/resources"
  },

  // Windows configuration
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"]
      },
      {
        target: "zip",
        arch: ["x64"]
      }
    ],
    icon: "desktop/resources/icons/app-icon.ico",
    publisherName: ["SADEK ELGAZAR"],
    verifyUpdateCodeSignature: true
  },

  // macOS configuration
  mac: {
    category: "public.app-category.video",
    target: [
      {
        target: "dmg",
        arch: ["universal"]
      },
      {
        target: "pkg",
        arch: ["universal"]
      },
      {
        target: "zip",
        arch: ["universal"]
      }
    ],
    icon: "desktop/resources/icons/app-icon.icns",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "desktop/resources/installer/entitlements.mac.plist",
    entitlementsInherit: "desktop/resources/installer/entitlements.mac.plist"
  },

  // Linux configuration
  linux: {
    target: ["AppImage", "deb", "rpm", "tar.gz"],
    category: "AudioVideo;Player",
    icon: "desktop/resources/icons/app-icon.png",
    maintainer: "SADEK ELGAZAR <support@knoux.com>"
  },

  // NSIS (Windows Installer) settings
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    license: "LICENSE",
    installerHeaderIcon: "desktop/resources/icons/app-icon.ico",
    uninstallerIcon: "desktop/resources/icons/app-icon.ico",
    installerSidebar: "desktop/resources/installer/installer-sidebar.bmp",
    uninstallerSidebar: "desktop/resources/installer/installer-sidebar.bmp",
    installerLanguages: ["en", "ar"],
    include: "desktop/resources/installer/installer.nsi",
    differentialPackage: true
  },

  // DMG (macOS Disk Image) settings
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: "link",
        path: "/Applications"
      },
      {
        x: 130,
        y: 150,
        type: "file"
      }
    ],
    window: {
      width: 540,
      height: 380
    },
    iconSize: 80,
    iconTextSize: 12,
    backgroundColor: "#0F0F1A",
    textColor: "#FFFFFF"
  },

  // Code Signing (environment variables required)
  winCertificateSubjectName: "SADEK ELGAZAR",
  cscLink: process.env.WINDOWS_CODE_SIGNING_CERTIFICATE,
  cscKeyPassword: process.env.WINDOWS_CODE_SIGNING_CERTIFICATE_PASSWORD,
  
  // Auto-update configuration
  publish: {
    provider: "generic",
    url: "https://updates.knoux.com/playerx/"
  },

  // Extra resources
  extraResources: [
    {
      from: "desktop/resources/icons/",
      to: "icons/",
      filter: ["**/*"]
    }
  ],

  // File associations
  fileAssociations: [
    {
      ext: ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"],
      name: "Video Files",
      role: "Viewer"
    },
    {
      ext: ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma"],
      name: "Audio Files",
      role: "Viewer"
    }
  ],

  // Build hooks
  afterPack: "./desktop/scripts/build.js",
  afterSign: "./desktop/scripts/sign.js",
  afterAllArtifactBuild: "./desktop/scripts/package.js"
};
