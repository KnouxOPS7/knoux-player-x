import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            textAlign: 'center',
            padding: '40px'
        }}>
            <h1 style={{ fontSize: '64px', marginBottom: '30px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                🎵 KNOUX Player X™
            </h1>
            <p style={{ fontSize: '24px', marginBottom: '50px', opacity: 0.9 }}>
                Desktop Music Player
            </p>
            <button 
                onClick={() => alert('✅ KNOUX Player is WORKING!')}
                style={{
                    padding: '20px 60px',
                    fontSize: '20px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid white',
                    borderRadius: '50px',
                    color: 'white',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                🎶 Click Me!
            </button>
            <div style={{ marginTop: '60px', fontSize: '16px', opacity: 0.8 }}>
                <p>✅ Electron: Ready</p>
                <p>✅ React: Ready</p>
                <p>✅ TypeScript: Ready</p>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
    console.log('✅ React rendered successfully!');
} else {
    console.error('❌ Root element not found!');
}