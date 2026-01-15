# KNOUX Player X™ Plugin SDK

Welcome to the KNOUX Player X Plugin SDK! This SDK provides everything you need to develop powerful plugins for KNOUX Player X.

## Overview

KNOUX Player X supports a rich plugin ecosystem that allows developers to extend the player's functionality. Plugins can:

- Add new UI components and panels
- Implement custom audio/video processing
- Integrate with online services
- Modify player behavior
- Add new file format support
- And much more!

## Getting Started

### Installation

```bash
npm install @knoUX/player-x-plugin-sdk
```

### Basic Plugin Structure

```typescript
import { Plugin } from '@knoUX/player-x-plugin-sdk';

const myPlugin: Plugin = {
  metadata: {
    id: 'my-awesome-plugin',
    name: 'My Awesome Plugin',
    description: 'A sample plugin demonstrating KNOUX Player X plugin capabilities',
    version: '1.0.0',
    author: 'Your Name',
    homepage: 'https://github.com/yourusername/my-awesome-plugin',
    compatibleVersion: '^1.0.0',
    tags: ['sample', 'demo', 'utility']
  },

  configOptions: [
    {
      key: 'enableFeature',
      label: 'Enable Feature',
      type: 'boolean',
      defaultValue: true,
      help: 'Enable or disable the awesome feature'
    },
    {
      key: 'volumeBoost',
      label: 'Volume Boost Level',
      type: 'number',
      defaultValue: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.1,
      help: 'Volume boost multiplier (0.5 to 2.0)'
    }
  ],

  async initialize(context) {
    context.logger.info('My Awesome Plugin initialized');
    
    // Watch for configuration changes
    await context.config.watch('enableFeature', (newValue, oldValue) => {
      context.logger.info(`Feature toggled from ${oldValue} to ${newValue}`);
    });
  },

  async onLoad() {
    console.log('Plugin loaded successfully');
  },

  async onUnload() {
    console.log('Plugin unloaded successfully');
  },

  async onPlay(mediaInfo) {
    const enabled = await context.config.get('enableFeature', true);
    if (enabled) {
      const volumeBoost = await context.config.get('volumeBoost', 1.0);
      await context.player.setVolume(volumeBoost);
      context.logger.info(`Applied volume boost: ${volumeBoost}x`);
    }
  }
};

export default myPlugin;
```

## API Reference

### Plugin Metadata

Every plugin must include metadata describing the plugin:

- `id`: Unique plugin identifier (lowercase, alphanumeric, hyphens only)
- `name`: Human-readable plugin name
- `description`: Brief plugin description
- `version`: Plugin version (semver format)
- `author`: Plugin author
- `homepage`: Optional URL to plugin website/repository
- `compatibleVersion`: KNOUX Player X version compatibility
- `tags`: Optional array of plugin categories/tags
- `icon`: Optional data URI or path to plugin icon

### Lifecycle Hooks

Plugins can implement the following lifecycle hooks:

- `onLoad()`: Called when plugin is loaded
- `onUnload()`: Called when plugin is unloaded
- `onPlay(mediaInfo)`: Called when media starts playing
- `onPause(mediaInfo)`: Called when media is paused
- `onStop(mediaInfo)`: Called when media stops
- `onSeek(position, mediaInfo)`: Called when seeking occurs
- `onMetadataLoaded(metadata)`: Called when media metadata loads
- `onEnded(mediaInfo)`: Called when playback ends

### Player API

Access player functionality through `context.player`:

- `play()`: Start playback
- `pause()`: Pause playback
- `stop()`: Stop playback
- `seek(position)`: Seek to position (seconds)
- `setVolume(volume)`: Set volume (0.0 to 1.0)
- `getVolume()`: Get current volume
- `setSpeed(speed)`: Set playback speed
- `getSpeed()`: Get current playback speed
- `loadMedia(source)`: Load media file/URL
- `getCurrentMedia()`: Get current media info
- `getState()`: Get player state

### Configuration API

Manage plugin configuration through `context.config`:

- `get(key, defaultValue)`: Get configuration value
- `set(key, value)`: Set configuration value
- `watch(key, callback)`: Watch for configuration changes
- `unwatch(key, callback)`: Stop watching configuration changes

### UI API

Add UI components through `context.ui`:

- `addComponent(component)`: Add UI component
- `removeComponent(id)`: Remove UI component
- `updateComponent(id, updates)`: Update UI component
- `showNotification(message, type, duration)`: Show notification
- `showDialog(options)`: Show dialog

### Event API

Handle events through `context.events`:

- `emit(event, data)`: Emit custom event
- `on(event, callback)`: Listen for events
- `off(listenerId)`: Remove event listener
- `once(event, callback)`: Listen for single event

### Utility API

Access utilities through `context.utils`:

- `http`: HTTP request utilities
- `fs`: File system operations
- `json`: JSON parsing/stringifying
- `string`: String manipulation utilities

## Publishing Plugins

1. Package your plugin as an NPM module
2. Include proper metadata in `package.json`
3. Publish to NPM registry
4. Submit to KNOUX Plugin Repository

## Support

For issues, questions, or contributions:

- GitHub Issues: [KNOUX Player X Issues](https://github.com/knuux7-ctrl/KNOX-Player-X-/issues)
- Discord: Join our developer community
- Documentation: [Plugin Development Guide](https://docs.knoux.com/plugins)

Happy coding!
