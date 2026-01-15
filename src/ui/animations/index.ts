/**
 * Project: KNOUX Player X™
 * File: src/ui/animations/index.ts
 * Author: knoux
 * Purpose: UI animation utilities and predefined animations for glassmorphism effects
 * Layer: Source -> UI -> Animations
 */

import { CSSProperties } from 'react';

// ========== ANIMATION CONFIGURATION ==========
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// ========== CORE ANIMATION CLASSES ==========
export class AnimationManager {
  private static readonly BASE_CONFIG: AnimationConfig = {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  };

  /**
   * Creates CSS transition string
   */
  static createTransition(
    properties: string | string[],
    config: Partial<AnimationConfig> = {}
  ): string {
    const cfg = { ...this.BASE_CONFIG, ...config };
    const props = Array.isArray(properties) ? properties.join(', ') : properties;
    
    return `${props} ${cfg.duration}ms ${cfg.easing} ${cfg.delay || 0}ms`;
  }

  /**
   * Creates CSS keyframes animation string
   */
  static createKeyframes(
    name: string,
    keyframes: Record<string, CSSProperties>,
    config: Partial<AnimationConfig> = {}
  ): string {
    const cfg = { ...this.BASE_CONFIG, ...config };
    
    return `
      @keyframes ${name} {
        ${Object.entries(keyframes).map(([progress, styles]) => `
          ${progress} {
            ${Object.entries(styles).map(([prop, value]) => 
              `${this.camelToKebab(prop)}: ${value};`
            ).join('\n            ')}
          }
        `).join('')}
      }
    `;
  }

  /**
   * Converts camelCase to kebab-case
   */
  private static camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  }

  /**
   * Applies glass morphism effect animation
   */
  static applyGlassEffect(
    element: HTMLElement,
    intensity: number = 1
  ): void {
    const animations = [
      this.createTransition(['opacity', 'transform', 'backdrop-filter'], { 
        duration: 200 * intensity 
      }),
      this.createTransition('box-shadow', { 
        duration: 300 * intensity 
      })
    ];

    element.style.transition = animations.join(', ');
  }
}

// ========== PREDEFINED ANIMATIONS ==========
export const Animations = {
  // Fade in animation
  fadeIn: (duration: number = 300): AnimationConfig => ({
    duration,
    easing: 'ease-out'
  }),

  // Fade out animation
  fadeOut: (duration: number = 300): AnimationConfig => ({
    duration,
    easing: 'ease-in'
  }),

  // Slide in from left
  slideInLeft: (distance: string = '100%', duration: number = 300): AnimationConfig => ({
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }),

  // Slide in from right
  slideInRight: (distance: string = '100%', duration: number = 300): AnimationConfig => ({
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }),

  // Slide in from top
  slideInDown: (distance: string = '100%', duration: number = 300): AnimationConfig => ({
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }),

  // Slide in from bottom
  slideInUp: (distance: string = '100%', duration: number = 300): AnimationConfig => ({
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }),

  // Scale animation
  scale: (scale: number = 1.05, duration: number = 200): AnimationConfig => ({
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }),

  // Rotate animation
  rotate: (degrees: number = 360, duration: number = 1000): AnimationConfig => ({
    duration,
    easing: 'linear',
    iterations: Infinity
  }),

  // Pulse animation
  pulse: (scale: number = 1.1, duration: number = 1000): AnimationConfig => ({
    duration,
    easing: 'ease-in-out',
    iterations: Infinity
  }),

  // Bounce animation
  bounce: (height: string = '20px', duration: number = 1000): AnimationConfig => ({
    duration,
    easing: 'cubic-bezier(0.5, 0.05, 0.5, 0.95)',
    iterations: Infinity
  }),

  // Shake animation
  shake: (intensity: string = '10px', duration: number = 500): AnimationConfig => ({
    duration,
    easing: 'ease-in-out'
  })
};

// ========== GLASSMORPHISM ANIMATIONS ==========
export const GlassAnimations = {
  /**
   * Neon glow pulse effect
   */
  neonPulse: `
    @keyframes neonPulse {
      0% {
        box-shadow: 0 0 5px rgba(138, 43, 226, 0.3),
                    0 0 10px rgba(0, 255, 255, 0.3);
      }
      50% {
        box-shadow: 0 0 10px rgba(138, 43, 226, 0.5),
                    0 0 20px rgba(0, 255, 255, 0.5);
      }
      100% {
        box-shadow: 0 0 5px rgba(138, 43, 226, 0.3),
                    0 0 10px rgba(0, 255, 255, 0.3);
      }
    }
  `,

  /**
   * Glass reflection sweep
   */
  glassSweep: `
    @keyframes glassSweep {
      0% {
        background-position: -100% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,

  /**
   * Liquid morph transition
   */
  liquidMorph: `
    @keyframes liquidMorph {
      0% {
        border-radius: 12px 12px 40% 12px;
      }
      25% {
        border-radius: 12px 40% 12px 12px;
      }
      50% {
        border-radius: 40% 12px 12px 12px;
      }
      75% {
        border-radius: 12px 12px 12px 40%;
      }
      100% {
        border-radius: 12px 12px 40% 12px;
      }
    }
  `,

  /**
   * Hologram flicker effect
   */
  hologramFlicker: `
    @keyframes hologramFlicker {
      0%, 100% {
        opacity: 0.9;
        transform: translateY(0);
      }
      25% {
        opacity: 0.7;
        transform: translateY(-1px);
      }
      50% {
        opacity: 0.95;
        transform: translateY(1px);
      }
      75% {
        opacity: 0.8;
        transform: translateY(0);
      }
    }
  `
};

// ========== TRANSITION UTILITY FUNCTIONS ==========
export class TransitionUtils {
  /**
   * Creates smooth hover effect with glass morphism
   */
  static createGlassHoverTransition(): CSSProperties {
    return {
      transition: AnimationManager.createTransition([
        'transform',
        'box-shadow',
        'backdrop-filter'
      ], { duration: 200 }),
      transform: 'translateY(0)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    };
  }

  /**
   * Creates active press effect
   */
  static createPressTransition(): CSSProperties {
    return {
      transition: AnimationManager.createTransition('all', { duration: 100 }),
      transform: 'translateY(1px) scale(0.98)'
    };
  }

  /**
   * Creates focus ring animation
   */
  static createFocusTransition(): CSSProperties {
    return {
      transition: AnimationManager.createTransition('box-shadow', { duration: 150 }),
      boxShadow: '0 0 0 3px rgba(138, 43, 226, 0.3)'
    };
  }

  /**
   * Creates smooth entrance animation
   */
  static createEntranceAnimation(delay: number = 0): CSSProperties {
    return {
      animation: `fadeInSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`
    };
  }
}

// ========== CSS KEYFRAMES DEFINITIONS ==========
export const Keyframes = {
  /**
   * Fade in with slight upward movement
   */
  fadeInSlideUp: `
    @keyframes fadeInSlideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  /**
   * Fade out with downward movement
   */
  fadeOutSlideDown: `
    @keyframes fadeOutSlideDown {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(20px);
      }
    }
  `,

  /**
   * Spin rotation
   */
  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,

  /**
   * Loading spinner with dual color
   */
  loadingSpinner: `
    @keyframes loadingSpinner {
      0% {
        transform: rotate(0deg);
        border-top-color: #8A2BE2;
        border-right-color: #8A2BE2;
      }
      50% {
        transform: rotate(180deg);
        border-top-color: #00FFFF;
        border-right-color: #00FFFF;
      }
      100% {
        transform: rotate(360deg);
        border-top-color: #8A2BE2;
        border-right-color: #8A2BE2;
      }
    }
  `
};

// ========== ANIMATION HOOKS (FOR REACT COMPONENTS) ==========
export interface UseAnimationProps {
  initialOpacity?: number;
  initialScale?: number;
  animateOnMount?: boolean;
}

export const AnimationHooks = {
  /**
   * Hook for fade animations
   */
  useFade(initialOpacity: number = 0): CSSProperties {
    return {
      opacity: initialOpacity,
      transition: AnimationManager.createTransition('opacity')
    };
  },

  /**
   * Hook for scale animations
   */
  useScale(initialScale: number = 0.8): CSSProperties {
    return {
      transform: `scale(${initialScale})`,
      transition: AnimationManager.createTransition('transform')
    };
  },

  /**
   * Hook for combined fade and scale
   */
  useFadeScale(initialOpacity: number = 0, initialScale: number = 0.8): CSSProperties {
    return {
      opacity: initialOpacity,
      transform: `scale(${initialScale})`,
      transition: AnimationManager.createTransition(['opacity', 'transform'])
    };
  }
};

export default {
  AnimationManager,
  Animations,
  GlassAnimations,
  TransitionUtils,
  Keyframes,
  AnimationHooks
};
