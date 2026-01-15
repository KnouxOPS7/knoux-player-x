/**
 * Project: KNOUX Player X™
 * File: example-plugin.ts
 * Author: knoux
 * Purpose: Example plugin demonstrating KNOUX Player X plugin SDK capabilities
 * Layer: Plugins -> Examples
 */

import {
  Plugin,
  MediaType,
  ComponentType,
  ConfigType
} from './types';

/**
 * Audio Visualizer Plugin
 * 
 * This plugin demonstrates:
 * - Custom UI component integration
 * - Audio analysis using DSP data
 * - Real-time canvas drawing
 * - Configuration management
 * - Event handling
 */
const AudioVisualizerPlugin: Plugin = {
  metadata: {
    id: 'audio-visualizer',
    name: 'Audio Visualizer',
    description: 'Real-time audio visualization with customizable effects',
    version: '1.0.0',
    author: 'KNOUX Team',
    homepage: 'https://github.com/knuux7-ctrl/KNOX-Player-X-',
    compatibleVersion: '^1.0.0',
    tags: ['audio', 'visualization', 'effects'],
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMiAyMS41YTEwIDExIDAgMSAwIDAtMjAiLz48cGF0aCBkPSJNMTIgMjEuNWE1LjUgNi41IDAgMSAwIDAtMTMiLz48cGF0aCBkPSJNMTIgMjEuNWEyLjUgMy41IDAgMSAwIDAtNyIvPjwvc3ZnPg=='
  },

  configOptions: [
    {
      key: 'visualizationType',
      label: 'Visualization Type',
      type: ConfigType.SELECT,
      defaultValue: 'bars',
      options: ['bars', 'waveform', 'particles', 'spectrum'],
      help: 'Choose the type of audio visualization'
    },
    {
      key: 'barCount',
      label: 'Bar Count',
      type: ConfigType.NUMBER,
      defaultValue: 32,
      min: 8,
      max: 128,
      step: 8,
      help: 'Number of bars in bar visualization'
    },
    {
      key: 'sensitivity',
      label: 'Sensitivity',
      type: ConfigType.NUMBER,
      defaultValue: 1.0,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      help: 'Audio sensitivity multiplier'
    },
    {
      key: 'enableSmoothing',
      label: 'Enable Smoothing',
      type: ConfigType.BOOLEAN,
      defaultValue: true,
      help: 'Smooth visualization transitions'
    },
    {
      key: 'colorScheme',
      label: 'Color Scheme',
      type: ConfigType.SELECT,
      defaultValue: 'neon',
      options: ['neon', 'classic', 'rainbow', 'monochrome'],
      help: 'Visualizer color scheme'
    }
  ],

  async initialize(context) {
    context.logger.info('Audio Visualizer Plugin initialized');

    // Add visualizer panel to UI
    const panelId = await context.ui.addComponent({
      type: ComponentType.PANEL,
      id: 'audio-visualizer-panel',
      props: {
        title: 'Audio Visualizer',
        position: 'bottom',
        height: 150,
        collapsible: true
      }
    });

    // Add canvas for visualization
    const canvasId = await context.ui.addComponent({
      type: ComponentType.CUSTOM,
      id: 'audio-visualizer-canvas',
      props: {
        parentId: panelId,
        element: 'canvas',
        attributes: {
          width: '100%',
          height: '100%',
          style: 'background: transparent;'
        }
      }
    });

    // Set up configuration watchers
    await context.config.watch('visualizationType', this.onConfigChanged.bind(this, context));
    await context.config.watch('barCount', this.onConfigChanged.bind(this, context));
    await context.config.watch('sensitivity', this.onConfigChanged.bind(this, context));

    // Listen for audio data
    await context.events.on('audio:data', this.onAudioData.bind(this, context, canvasId));

    context.logger.info('Audio Visualizer UI components added');
  },

  async onLoad() {
    console.log('Audio Visualizer Plugin loaded');
  },

  async onUnload() {
    console.log('Audio Visualizer Plugin unloaded');
  },

  async onPlay(mediaInfo) {
    // Only activate for audio files
    if (mediaInfo.type === MediaType.AUDIO) {
      await this.activateVisualizer();
    }
  },

  async onPause() {
    await this.deactivateVisualizer();
  },

  async onStop() {
    await this.deactivateVisualizer();
  },

  // Private methods (not part of Plugin interface but used internally)
  async onConfigChanged(context: any, newValue: any, oldValue: any) {
    context.logger.info(`Configuration changed: ${oldValue} -> ${newValue}`);
    // Trigger visualization refresh
    await context.events.emit('visualizer:refresh');
  },

  async onAudioData(context: any, canvasId: string, audioData: Float32Array) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const config = {
      type: await context.config.get('visualizationType', 'bars'),
      barCount: await context.config.get('barCount', 32),
      sensitivity: await context.config.get('sensitivity', 1.0),
      smoothing: await context.config.get('enableSmoothing', true),
      colorScheme: await context.config.get('colorScheme', 'neon')
    };

    this.renderVisualization(canvas, audioData, config);
  },

  renderVisualization(canvas: HTMLCanvasElement, audioData: Float32Array, config: any) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply selected visualization type
    switch (config.type) {
      case 'bars':
        this.renderBars(ctx, audioData, width, height, config);
        break;
      case 'waveform':
        this.renderWaveform(ctx, audioData, width, height, config);
        break;
      case 'particles':
        this.renderParticles(ctx, audioData, width, height, config);
        break;
      case 'spectrum':
        this.renderSpectrum(ctx, audioData, width, height, config);
        break;
    }
  },

  renderBars(ctx: CanvasRenderingContext2D, audioData: Float32Array, width: number, height: number, config: any) {
    const barCount = config.barCount;
    const barWidth = width / barCount;
    const sensitivity = config.sensitivity;

    ctx.fillStyle = this.getColor(config.colorScheme, 0);

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * audioData.length);
      const amplitude = Math.abs(audioData[dataIndex]) * sensitivity;
      const barHeight = amplitude * height;

      const x = i * barWidth;
      const y = height - barHeight;

      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  },

  renderWaveform(ctx: CanvasRenderingContext2D, audioData: Float32Array, width: number, height: number, config: any) {
    const sensitivity = config.sensitivity;
    const midY = height / 2;

    ctx.beginPath();
    ctx.strokeStyle = this.getColor(config.colorScheme, 0);
    ctx.lineWidth = 2;

    for (let i = 0; i < audioData.length; i += Math.floor(audioData.length / width)) {
      const x = (i / audioData.length) * width;
      const y = midY + (audioData[i] * sensitivity * midY);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  },

  renderParticles(ctx: CanvasRenderingContext2D, audioData: Float32Array, width: number, height: number, config: any) {
    const sensitivity = config.sensitivity;
    const particleCount = Math.floor(audioData.length / 10);

    for (let i = 0; i < particleCount; i++) {
      const dataIndex = i * 10;
      const amplitude = Math.abs(audioData[dataIndex]) * sensitivity;
      
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = amplitude * 10;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.getColor(config.colorScheme, i / particleCount);
      ctx.fill();
    }
  },

  renderSpectrum(ctx: CanvasRenderingContext2D, audioData: Float32Array, width: number, height: number, config: any) {
    // FFT-like visualization using frequency bins
    const binCount = 64;
    const binWidth = width / binCount;
    const sensitivity = config.sensitivity;

    // Calculate frequency bins
    const bins: number[] = new Array(binCount).fill(0);
    const binSize = Math.floor(audioData.length / binCount);

    for (let i = 0; i < binCount; i++) {
      let sum = 0;
      for (let j = 0; j < binSize; j++) {
        const index = i * binSize + j;
        if (index < audioData.length) {
          sum += Math.abs(audioData[index]);
        }
      }
      bins[i] = (sum / binSize) * sensitivity;
    }

    // Render spectrum
    for (let i = 0; i < binCount; i++) {
      const binHeight = bins[i] * height;
      const x = i * binWidth;
      const y;

      const gradient = ctx.createLinearGradient(0, y, 0, height);
      gradient.addColorStop(0, this.getColor(config.colorScheme, i / binCount));
      gradient.addColorStop(1, this.getTransparentColor(config.colorScheme, i / binCount));

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, binWidth - 1, binHeight);
    }
  },

  getColor(scheme: string, ratio: number): string {
    switch (scheme) {
      case 'neon':
        const hue = (ratio * 300 + 270) % 360; // Purple to cyan range
        return `hsl(${hue}, 100%, 65%)`;
      case 'classic':
        return '#00FFFF';
      case 'rainbow':
        const rainbowHue = ratio * 360;
        return `hsl(${rainbowHue}, 100%, 65%)`;
      case 'monochrome':
        const gray = Math.floor(255 * ratio);
        return `rgb(${gray}, ${gray}, ${gray})`;
      default:
        return '#8A2BE2'; // Default purple
    }
  },

  getTransparentColor(scheme: string, ratio: number): string {
    const baseColor = this.getColor(scheme, ratio);
    // Convert to rgba with transparency
    if (baseColor.startsWith('hsl')) {
      // Simplified conversion
      return baseColor.replace(')', ', 0.3)').replace('hsl', 'hsla');
    } else if (baseColor.startsWith('#')) {
      return baseColor + '4D'; // 30% opacity hex
    }
    return baseColor;
  },

  async activateVisualizer() {
    // Activate visualization processing
    console.log('Activating audio visualizer');
  },

  async deactivateVisualizer() {
    // Deactivate visualization processing
    console.log('Deactivating audio visualizer');
  }
};

export default AudioVisualizerPlugin;
