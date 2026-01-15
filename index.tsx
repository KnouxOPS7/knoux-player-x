import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * KNOX Player X™ Entry Point
 * Initializing application context and strict mounting.
 */

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("KNOX: Failed to mount. Root element missing.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
