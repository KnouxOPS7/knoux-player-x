import { MediaFile, PlaybackState } from './types';

/**
 * KNOX Media Engine
 * Wraps HTML5 Video initially, designed to be swapped with Native HW renderers.
 */
export class MediaEngine {
  private video: HTMLVideoElement | null = null;

  bind(element: HTMLVideoElement) {
    this.video = element;
  }

  async load(file: MediaFile) {
    if (!this.video) return;
    this.video.src = file.url;
    this.video.load();
  }

  play() {
    this.video?.play();
  }

  pause() {
    this.video?.pause();
  }

  seek(time: number) {
    if (this.video) this.video.currentTime = time;
  }

  setVolume(vol: number) {
    if (this.video) this.video.volume = vol / 100;
  }

  setSpeed(rate: number) {
    if (this.video) this.video.playbackRate = rate;
  }

  getCurrentTime() {
    return this.video?.currentTime || 0;
  }

  getDuration() {
    return this.video?.duration || 0;
  }
}

export const engine = new MediaEngine();
