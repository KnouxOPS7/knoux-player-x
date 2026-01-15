// Author: knoux (أبو ريتاج) — KNOUX Player X™
// Module: Entry Point Gate
// Status: CLOSED | PRODUCTION READY | VITE COMPATIBLE

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// استيراد الأنظمة الجمالية والعالمية
import './ui/styles/global.css';

// إضافة تأثير التحميل الأولي (Boot Up Logic)
const bootSequence = async () => {
    console.log("%c KNOUX PLAYER X ", "background: #7C3AED; color: white; font-weight: bold; padding: 5px;");
    console.log("Core Boot: SUCCESSFUL");
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("CRITICAL: Root element not found. Boot failed.");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

bootSequence();
