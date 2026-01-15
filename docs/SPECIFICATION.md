# KNOX Player X™ Specification (v2.0)

## 1. Visual & UI
- **Glassmorphism**: Minimum 20px backdrop blur with 0.05 alpha-white border.
- **Neon Identity**: Consistent usage of `#00d9ff` for active/interactive components.
- **Animations**: 300ms cubic-bezier transitions for panels.

## 2. Performance & Playback
- **Media Engine**: Frame-accurate seeking and variable speed control (0.25x - 4x).
- **Diagnostics**: Real-time logging of decode state and hardware usage.
- **Persistence**: Remembers volume, speed, and UI configuration across sessions.

## 3. Desktop Capabilities
- **FS Integration**: Native file import via IPC.
- **Hardware Acceleration**: Toggleable DXVA2/NVDEC (simulated in UI, ready for native).
- **Control**: Minimize/Maximize/Close custom chrome.

## 4. Accessibility
- Full Keyboard shortcuts (Space: Toggle, Arrows: Seek).
- ARIA-compliant UI markers.
