# KNOUX Player X™ - Developer Kit

Welcome to the official Plugin Development ecosystem. This guide enables developers to extend KNOUX functionality using our secure `PluginContext`.

## 1. Getting Started

### Architecture
Plugins are standard Node/JS bundles that run in a sandboxed environment within the Main Process or a safe Render View.

### Directory Structure
Your plugin must contain:
- `manifest.json`: Metadata and permissions.
- `index.ts`: The entry point exporting a class extending `KnouxPlugin`.

## 2. API Reference

All plugins receive `context: IPluginContext` on load.

| API Namespace | Functionality | Permission Required |
|---|---|---|
| `context.logger` | Info, Warn, Error logging | None |
| `context.player` | Play, Pause, Seek, Get State | None |
| `context.fs` | Read/Write restricted files | `filesystem:read/write` |
| `context.dsp` | Apply Audio Configs | `dsp:audio` |

## 3. Deployment
Run `npm run package` (assuming standard scripts) to bundle your plugin into a `.kpx` (zip) file for distribution.
