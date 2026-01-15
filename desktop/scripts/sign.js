# KNOUX Player X™

<p align="center">
  <img src="./docs/logo.png" alt="KNOUX Player X Logo" width="200">
</p>

<h3 align="center">Next Generation Desktop Media Player</h3>
<h4 align="center">Neon Glassmorphism • Offline-First • Performance Optimized</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#development">Development</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## ✨ Features

### 🎬 Premium Media Playback
- **Hardware Accelerated**: GPU-accelerated video decoding and rendering
- **Universal Codec Support**: Play virtually any media format without external codecs
- **4K/HDR Ready**: Full support for high-resolution and high-dynamic-range content
- **Smart Subtitle System**: AI-powered timing, styling, and synchronization

### 🎨 Neon Glassmorphism UI
- **Futuristic Design**: Glass-like panels with neon glow effects
- **Theme System**: Multiple themes (Neon Purple, Neon Cyan, Dark, Light, Cinema)
- **RTL Support**: Full Arabic language support with right-to-left layout
- **Smooth Animations**: 60fps animations and transitions

### ⚡ Performance Optimized
- **Offline-First**: All features work without internet connectivity
- **Fast Startup**: Optimized cold start under 2 seconds
- **Low Memory Usage**: Efficient resource management for mid-range PCs
- **Hardware Detection**: Automatic GPU and codec capability detection

### 🔧 Advanced Features
- **Smart Playlist**: Intelligent media organization and sorting
- **Audio Equalizer**: 10-band parametric equalizer with presets
- **Video Filters**: Real-time color grading and effects
- **Screenshot & Export**: High-quality screenshots and clip exporting
- **Plugin System**: Extensible architecture with plugin support
- **Crash Recovery**: Automatic recovery from crashes with session restore

## 🚀 Installation

### Windows Installation
1. Download the latest installer from [Releases](https://github.com/knoux/player-x/releases)
2. Run KNOUX-Player-X-Setup.exe
3. Follow the installation wizard
4. Launch KNOUX Player X from Start Menu or Desktop shortcut

### Portable Version
1. Download the portable ZIP package
2. Extract to any location (no installation required)
3. Run KNOUX Player X.exe

## 💻 Development

### Prerequisites
- Node.js 18+ and npm
- Git
- Visual Studio Code (recommended)

### Setup Development Environment
`ash
# Clone the repository
git clone https://github.com/knoux/player-x.git
cd player-x

# Install dependencies
npm install

# Start development server
npm run electron:dev
Build Commands
bash
# Development build
npm run dev

# Production build
npm run build

# Package for Windows
npm run electron:package

# Create installer
npm run electron:build
Project Structure
text
knoux-player-x/
├── src/                 # Source code
│   ├── core/           # Media engine core
│   ├── services/       # Business logic services
│   ├── ui/            # React components
│   ├── state/         # Zustand state management
│   ├── themes/        # Theme definitions
│   ├── localization/  # Multi-language support
│   └── utils/         # Utility functions
├── desktop/           # Electron desktop wrapper
├── public/            # Static assets
├── plugins/           # Plugin system
└── tests/             # Test suites
🛠️ Technology Stack
Frontend: React 18 + TypeScript + Vite

State Management: Zustand

Styling: Tailwind CSS + Custom Glass CSS

Media Processing: FFmpeg.wasm + WebCodecs API

Desktop: Electron 28

Build Tool: Vite 5

Testing: Vitest + Testing Library

📖 Documentation
Architecture - Detailed system architecture

API Reference - Core API documentation

Plugin Development - How to create plugins

Keyboard Shortcuts - Complete shortcut list

Troubleshooting - Common issues and solutions

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Fork the repository

Create a feature branch

Make your changes

Run tests

Submit a pull request

Development Guidelines
Follow TypeScript strict mode

Write tests for new features

Maintain 60fps performance target

Ensure RTL compatibility

Keep bundle size optimized

📄 License
KNOUX Player X is released under the MIT License. See LICENSE for details.

🙏 Acknowledgments
FFmpeg community for amazing media tools

Electron team for desktop wrapper

React team for the fantastic UI library

All contributors and testers

📞 Support
GitHub Issues: Report bugs or request features

Documentation: Read the docs

Community: Join our Discord

<p align="center"> Made with ❤️ by the KNOUX Team </p> "@ | Out-File -FilePath "C:\Users\Aisha\Downloads\knox-player-x™\README.md" -Encoding UTF8
Create additional documentation files
 = @(
"docs\ARCHITECTURE.md",
"docs\API.md",
"docs\PLUGIN_DEVELOPMENT.md",
"docs\SHORTCUTS.md",
"docs\TROUBLESHOOTING.md",
"docs\CHANGELOG.md"
)

foreach ( in ) {
C:\Users\Aisha\Downloads\knox-player-x™\desktop\scripts\sign.js = Join-Path C:\Users\Aisha\Downloads\knox-player-x™ 
sign.js = Split-Path  -Leaf
 = [System.IO.Path]::GetFileNameWithoutExtension(sign.js) -replace '_', ' '
@"


KNOUX Player X - 
Version 1.0.0
Overview
This document provides detailed information about  for KNOUX Player X.

Table of Contents
Introduction

Features

Usage

Configuration

Examples

Troubleshooting

Introduction
 is an essential component of KNOUX Player X that...

Features
Feature 1

Feature 2

Feature 3

Usage
Detailed usage instructions...

Configuration
Configuration options and settings...

Examples
Practical examples and use cases...

Troubleshooting
Common issues and their solutions...

Last updated: 2026-01-15
*KNOUX Player X - Version 1.0.0*
