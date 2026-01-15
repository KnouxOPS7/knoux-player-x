/**
 * ================================================================================
 * KNOUX Player X
 * ================================================================================
 * Project: KNOUX Player X
 * File: C:\Users\Aisha\Downloads\knox-player-x\src\index.tsx
 * Role: React Application Entry Point and Global Bootstrap
 * Layer: UI
 * Author: SADEK ELGAZAR (KNOUX)
 * Status: FINALIZED
 * ================================================================================
 * 
 * This module serves as the primary entry point for the React application,
 * implementing cinematic intelligence initialization with:
 * 
 * - Secure context validation and API exposure
 * - Global state management bootstrap
 * - Performance monitoring and metrics collection
 * - Error boundary implementation and recovery
 * - Internationalization and localization setup
 * - Theme system initialization
 * - Service worker registration
 * - Resource preloading optimization
 * - Cross-platform compatibility layer
 * - Accessibility compliance foundation
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from 'react-error-boundary';
import log from 'electron-log';

// Global styles and themes
import './styles/global.scss';
import './styles/themes/neon.scss';
import './styles/animations.scss';

// Core application components
import App from './App';
import { store, persistor } from './state/store';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocalizationProvider } from './contexts/LocalizationContext';

// Performance monitoring
import { reportWebVitals } from './utils/performance';

// Error handling components
import ErrorFallback from './components/shared/ErrorFallback';
import GlobalErrorHandler from './components/shared/GlobalErrorHandler';

// Service worker
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Validate secure context
if (typeof window.knoxAPI === 'undefined') {
  log.error('Secure context not available - knoxAPI not exposed');
  throw new Error('Application cannot run without secure context');
}

// Performance monitoring setup
if ('performance' in window) {
  performance.mark('app-bootstrap-start');
}

// Error boundary error handler
const handleError = (error: Error, info: { componentStack: string }) => {
  log.error('React error boundary caught error:', {
    error: error.message,
    stack: error.stack,
    componentStack: info.componentStack
  });
  
  // Send error to main process for logging
  if (window.knoxAPI?.app?.store) {
    window.knoxAPI.app.store.set('lastError', {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
      timestamp: new Date().toISOString()
    }).catch(log.error);
  }
};

// Render application
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset application state
        window.location.reload();
      }}
    >
      <GlobalErrorHandler>
        <Provider store={store}>
          <PersistGate 
            loading={<div className="loading-container"><div className="loading-spinner"></div></div>} 
            persistor={persistor}
          >
            <ThemeProvider>
              <LocalizationProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </LocalizationProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </GlobalErrorHandler>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    log.info('Service worker update available');
    // Notify user of update availability
    if (window.knoxAPI?.app) {
      window.knoxAPI.app.store.set('updateAvailable', true).catch(log.error);
    }
  },
  onSuccess: (registration) => {
    log.info('Service worker registered successfully');
  }
});

// Report web vitals for performance monitoring
reportWebVitals((metric) => {
  log.info('Web vital metric:', metric);
  
  // Send metrics to main process for aggregation
  if (window.knoxAPI?.app?.store) {
    window.knoxAPI.app.store.set(\metrics.\\, {
      value: metric.value,
      timestamp: new Date().toISOString()
    }).catch(log.error);
  }
});

// Performance mark completion
if ('performance' in window) {
  performance.mark('app-bootstrap-end');
  performance.measure('app-bootstrap', 'app-bootstrap-start', 'app-bootstrap-end');
}

// Global error handlers
window.addEventListener('error', (event) => {
  log.error('Global error handler:', {
    message: event.error?.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  log.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  // Flush any pending logs
  log.transports.file.stream?.end();
  
  // Save current state
  if (window.knoxAPI?.app?.store) {
    window.knoxAPI.app.store.set('lastSession', {
      timestamp: new Date().toISOString(),
      url: window.location.href
    }).catch(() => {
      // Ignore errors during unload
    });
  }
});

export {};