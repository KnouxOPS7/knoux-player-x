import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

type Theme = 'dark' | 'light';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  const palette = useMemo(
    () =>
      theme === 'dark'
        ? {
            background:
              'radial-gradient(circle at top left, #8a2be2 0%, #4b0082 30%, #050013 70%, #000000 100%)',
            cardBackground: 'rgba(12, 3, 40, 0.72)',
            accent: '#c084ff',
            accentSoft: 'rgba(192, 132, 255, 0.18)',
            textPrimary: '#fdfbff',
            textSecondary: 'rgba(232, 223, 255, 0.78)',
          }
        : {
            background: 'linear-gradient(135deg, #fdfbff 0%, #e9ddff 40%, #f7efff 100%)',
            cardBackground: 'rgba(255, 255, 255, 0.86)',
            accent: '#7c3aed',
            accentSoft: 'rgba(124, 58, 237, 0.12)',
            textPrimary: '#1f102b',
            textSecondary: 'rgba(55, 30, 90, 0.78)',
          },
    [theme]
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: palette.background,
        color: palette.textPrimary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '32px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          height: '100%',
          maxHeight: 560,
          borderRadius: 32,
          background: palette.cardBackground,
          boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 40px rgba(168, 85, 247, 0.56)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(26px)',
          WebkitBackdropFilter: 'blur(26px)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 10% 0%, rgba(236, 72, 153, 0.32), transparent 55%), radial-gradient(circle at 90% 100%, rgba(59, 130, 246, 0.32), transparent 55%)',
            mixBlendMode: 'screen',
            opacity: theme === 'dark' ? 0.9 : 0.5,
          }}
        />

        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: 4,
                color: palette.textSecondary,
                marginBottom: 8,
              }}
            >
              KNOUX PLAYER X™
            </div>
            <h1
              style={{
                fontSize: 32,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textShadow: '0 0 16px rgba(216, 180, 254, 0.6), 0 0 32px rgba(147, 51, 234, 0.9)',
              }}
            >
              <span
                style={{
                  fontSize: 26,
                }}
              >
                🎧
              </span>
              Cinematic Intelligence Console
            </h1>
          </div>
          <button
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            style={{
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '8px 18px',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              background: palette.accentSoft,
              color: palette.textPrimary,
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow:
                theme === 'dark'
                  ? '0 0 18px rgba(147, 51, 234, 0.7)'
                  : '0 0 12px rgba(124, 58, 237, 0.4)',
            }}
          >
            <span>{theme === 'dark' ? '☀️ وضع نهاري' : '🌑 وضع ليلي'}</span>
          </button>
        </header>

        <main
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2.1fr) minmax(0, 1.2fr)',
            gap: 24,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <section
            style={{
              borderRadius: 24,
              padding: 20,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'linear-gradient(145deg, rgba(15,23,42,0.72), rgba(49,46,129,0.52))',
              boxShadow: '0 18px 40px rgba(15,23,42,0.8), 0 0 40px rgba(129, 140, 248, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: palette.textSecondary,
                  marginBottom: 10,
                }}
              >
                Quantum Playback Engine
              </div>
              <h2
                style={{
                  fontSize: 22,
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Ready to orchestrate your media universe
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: palette.textSecondary,
                  maxWidth: 520,
                }}
              >
                Electron + React + TypeScript are wired and compiled. Connect your engine, IPC
                bridges, and AI modules and this console becomes the heart of KNOUX Player X™.
              </p>
            </div>

            <button
              onClick={() => alert('✅ KNOUX core pipeline is alive. Hook your media engine next.')}
              style={{
                marginTop: 24,
                alignSelf: 'flex-start',
                padding: '14px 32px',
                borderRadius: 999,
                border: '0',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                background: 'linear-gradient(120deg, #a855f7, #ec4899, #f97316)',
                color: '#0b0214',
                cursor: 'pointer',
                boxShadow:
                  '0 12px 32px rgba(168, 85, 247, 0.65), 0 0 24px rgba(236, 72, 153, 0.85)',
                transform: 'translateY(0)',
                transition:
                  'transform 0.16s ease-out, box-shadow 0.16s ease-out, filter 0.16s ease-out',
                filter: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.5))',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 18px 42px rgba(168, 85, 247, 0.9), 0 0 32px rgba(236, 72, 153, 1)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 12px 32px rgba(168, 85, 247, 0.65), 0 0 24px rgba(236, 72, 153, 0.85)';
              }}
            >
              Boot KNOUX Core
            </button>
          </section>

          <aside
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                borderRadius: 20,
                padding: 16,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(15,23,42,0.74)',
                boxShadow: '0 14px 30px rgba(15,23,42,0.85), 0 0 30px rgba(59,130,246,0.45)',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: palette.textSecondary,
                  marginBottom: 8,
                }}
              >
                Runtime Status
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: 14,
                  display: 'grid',
                  gap: 6,
                }}
              >
                <li>✅ Electron main process compiled</li>
                <li>✅ Preload sandbox exposed as knouxAPI</li>
                <li>✅ React 18 + TypeScript wired</li>
                <li>✅ Webpack 5 + asset pipeline ready</li>
              </ul>
            </div>

            <div
              style={{
                borderRadius: 20,
                padding: 16,
                border: '1px dashed rgba(255,255,255,0.18)',
                background: 'rgba(15,23,42,0.48)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontSize: 13,
                color: palette.textSecondary,
              }}
            >
              <div style={{ fontWeight: 600, color: palette.textPrimary }}>Next KNOUX steps</div>
              <div>• وصل media_engine مع IPC bridges في desktop/main.</div>
              <div>• ثبت AI modules من src/modules وربطها مع واجهة التحكم.</div>
              <div>• اربط مكتبة المكتبة/الترميزات مع واجهة المتصفح.</div>
            </div>
          </aside>
        </main>
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
