/**
 * Project: KNOUX Player X™
 * File: src/state/middleware/index.ts
 * Author: knoux
 * Purpose: Redux middleware for state management including logging, analytics, and persistence
 * Layer: Source -> State -> Middleware
 */

import { Middleware, Action, Dispatch, MiddlewareAPI } from 'redux';
import { RootState } from '../store';

// ========== LOGGING MIDDLEWARE ==========
export const loggingMiddleware: Middleware<{}, RootState> = (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  const startTime = Date.now();
  const prevState = api.getState();
  
  // Log action dispatch
  console.group(`%c ACTION ${action.type}`, 'color: #00FFFF; font-weight: bold');
  console.log('%c PREVIOUS STATE', 'color: #8A2BE2; font-weight: bold', prevState);
  console.log('%c ACTION', 'color: #FF00FF; font-weight: bold', action);
  
  // Execute next middleware/reducer
  const result = next(action);
  
  const newState = api.getState();
  const endTime = Date.now();
  
  console.log('%c NEXT STATE', 'color: #00FF00; font-weight: bold', newState);
  console.log('%c DURATION', 'color: #FFA500; font-weight: bold', `${endTime - startTime}ms`);
  console.groupEnd();
  
  return result;
};

// ========== ANALYTICS MIDDLEWARE ==========
export interface AnalyticsEvent {
  type: string;
  payload: any;
  timestamp: number;
  state: Partial<RootState>;
}

export const analyticsMiddleware: Middleware<{}, RootState> = (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  // Track specific actions for analytics
  const trackedActions = [
    'PLAYER/PLAY',
    'PLAYER/PAUSE',
    'PLAYER/STOP',
    'PLAYER/SEEK',
    'MEDIA/ADD_TO_PLAYLIST',
    'MEDIA/REMOVE_FROM_PLAYLIST',
    'PLAYLIST/CREATE',
    'PLAYLIST/DELETE',
    'SETTINGS/UPDATE_THEME',
    'SETTINGS/UPDATE_LANGUAGE'
  ];
  
  if (trackedActions.includes(action.type)) {
    const state = api.getState();
    const analyticsEvent: AnalyticsEvent = {
      type: action.type,
      payload: (action as any).payload,
      timestamp: Date.now(),
      state: {
        playback: state.playback,
        settings: state.settings
      }
    };
    
    // Send to analytics service (mock implementation)
    sendAnalyticsEvent(analyticsEvent);
  }
  
  return next(action);
};

// Mock analytics sender
const sendAnalyticsEvent = (event: AnalyticsEvent): void => {
  // In production, this would send to an analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('[ANALYTICS]', event);
  }
};

// ========== ERROR HANDLING MIDDLEWARE ==========
export const errorMiddleware: Middleware<{}, RootState> = () => (next: Dispatch) => (action: Action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux Middleware Error:', error);
    
    // Log error to error tracking service
    logError(error as Error, {
      action,
      timestamp: Date.now()
    });
    
    // Re-throw error for global error handler
    throw error;
  }
};

// Mock error logger
const logError = (error: Error, context: any): void => {
  // In production, this would send to an error tracking service
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR TRACKING]', error, context);
  }
};

// ========== PERSISTENCE MIDDLEWARE ==========
export interface PersistenceConfig {
  key: string;
  storage: Storage;
  whitelist?: string[];
  blacklist?: string[];
  throttle?: number;
}

export const createPersistenceMiddleware = (config: PersistenceConfig): Middleware<{}, RootState> => {
  let saveTimer: NodeJS.Timeout | null = null;
  
  return (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    const result = next(action);
    
    // Throttle persistence updates
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    
    saveTimer = setTimeout(() => {
      const state = api.getState();
      const stateToSave = filterStateForPersistence(state, config);
      
      try {
        config.storage.setItem(config.key, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Failed to persist state:', error);
      }
    }, config.throttle || 1000);
    
    return result;
  };
};

const filterStateForPersistence = (state: RootState, config: PersistenceConfig): Partial<RootState> => {
  if (config.whitelist) {
    const filteredState: Partial<RootState> = {};
    config.whitelist.forEach(key => {
      if (key in state) {
        (filteredState as any)[key] = (state as any)[key];
      }
    });
    return filteredState;
  }
  
  if (config.blacklist) {
    const filteredState = { ...state };
    config.blacklist.forEach(key => {
      delete (filteredState as any)[key];
    });
    return filteredState;
  }
  
  return state;
};

// ========== PERFORMANCE MONITORING MIDDLEWARE ==========
export const performanceMiddleware: Middleware<{}, RootState> = () => (next: Dispatch) => (action: Action) => {
  const startTime = performance.now();
  
  const result = next(action);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Log slow actions
  if (duration > 16) { // > 1 frame at 60fps
    console.warn(`Slow action detected: ${action.type} (${duration.toFixed(2)}ms)`);
  }
  
  return result;
};

// ========== VALIDATION MIDDLEWARE ==========
export const validationMiddleware: Middleware<{}, RootState> = () => (next: Dispatch) => (action: Action) => {
  // Validate action structure
  if (!action.type) {
    throw new Error('Action must have a type');
  }
  
  // Validate specific action payloads
  switch (action.type) {
    case 'PLAYER/SET_VOLUME':
      const volume = (action as any).payload;
      if (typeof volume !== 'number' || volume < 0 || volume > 2) {
        console.warn('Invalid volume value:', volume);
      }
      break;
      
    case 'PLAYER/SEEK':
      const position = (action as any).payload;
      if (typeof position !== 'number' || position < 0) {
        console.warn('Invalid seek position:', position);
      }
      break;
  }
  
  return next(action);
};

// ========== COMPOSED MIDDLEWARE ==========
export const createMiddlewares = () => {
  const middlewares: Middleware[] = [];
  
  // Add middlewares conditionally based on environment
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(loggingMiddleware);
    middlewares.push(performanceMiddleware);
  }
  
  middlewares.push(validationMiddleware);
  middlewares.push(errorMiddleware);
  middlewares.push(analyticsMiddleware);
  
  return middlewares;
};

export default {
  loggingMiddleware,
  analyticsMiddleware,
  errorMiddleware,
  createPersistenceMiddleware,
  performanceMiddleware,
  validationMiddleware,
  createMiddlewares
};
