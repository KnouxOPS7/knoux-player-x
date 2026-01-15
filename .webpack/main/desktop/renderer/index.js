"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
console.log('BOOT: renderer entry loaded');
const client_1 = require("react-dom/client");
require("./styles/app.css");
const App = () => {
    const [theme, setTheme] = (0, react_1.useState)('dark');
    const palette = (0, react_1.useMemo)(() => theme === 'dark'
        ? {
            background: 'radial-gradient(circle at top left, #8a2be2 0%, #4b0082 30%, #050013 70%, #000000 100%)',
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
        }, [theme]);
    return (react_1.default.createElement("div", { className: `app ${theme === 'dark' ? 'theme-dark' : 'theme-light'}` },
        react_1.default.createElement("div", { className: "card" },
            react_1.default.createElement("div", { style: {
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: 'radial-gradient(circle at 10% 0%, rgba(236, 72, 153, 0.32), transparent 55%), radial-gradient(circle at 90% 100%, rgba(59, 130, 246, 0.32), transparent 55%)',
                    mixBlendMode: 'screen',
                    opacity: theme === 'dark' ? 0.9 : 0.5,
                } }),
            react_1.default.createElement("header", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                    position: 'relative',
                    zIndex: 1,
                } },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { style: {
                            fontSize: 13,
                            textTransform: 'uppercase',
                            letterSpacing: 4,
                            color: palette.textSecondary,
                            marginBottom: 8,
                        } }, "KNOUX PLAYER X\u2122"),
                    react_1.default.createElement("h1", { style: {
                            fontSize: 32,
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            textShadow: '0 0 16px rgba(216, 180, 254, 0.6), 0 0 32px rgba(147, 51, 234, 0.9)',
                        } },
                        react_1.default.createElement("span", { style: {
                                fontSize: 26,
                            } }, "\uD83C\uDFA7"),
                        "Cinematic Intelligence Console")),
                react_1.default.createElement("button", { onClick: () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark')), style: {
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
                        boxShadow: theme === 'dark'
                            ? '0 0 18px rgba(147, 51, 234, 0.7)'
                            : '0 0 12px rgba(124, 58, 237, 0.4)',
                    } },
                    react_1.default.createElement("span", null, theme === 'dark' ? '☀️ وضع نهاري' : '🌑 وضع ليلي'))),
            react_1.default.createElement("main", { className: "grid" },
                react_1.default.createElement("section", { style: {
                        borderRadius: 24,
                        padding: 20,
                        border: '1px solid rgba(255,255,255,0.16)',
                        background: 'linear-gradient(145deg, rgba(15,23,42,0.72), rgba(49,46,129,0.52))',
                        boxShadow: '0 18px 40px rgba(15,23,42,0.8), 0 0 40px rgba(129, 140, 248, 0.45)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    } },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { style: {
                                fontSize: 13,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                color: palette.textSecondary,
                                marginBottom: 10,
                            } }, "Quantum Playback Engine"),
                        react_1.default.createElement("h2", { style: {
                                fontSize: 22,
                                margin: 0,
                                marginBottom: 12,
                            } }, "Ready to orchestrate your media universe"),
                        react_1.default.createElement("p", { style: {
                                margin: 0,
                                fontSize: 14,
                                lineHeight: 1.6,
                                color: palette.textSecondary,
                                maxWidth: 520,
                            } }, "Electron + React + TypeScript are wired and compiled. Connect your engine, IPC bridges, and AI modules and this console becomes the heart of KNOUX Player X\u2122.")),
                    react_1.default.createElement("button", { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                            try {
                                const preset = yield window.knouxAPI.invoke('knux:dsp:preset', 'flat');
                                alert(`✅ DSP Preset loaded:\nGain=${preset.gain}, Bass=${preset.bass}, Treble=${preset.treble}`);
                            }
                            catch (err) {
                                console.error('DSP preset invoke failed', err);
                                alert('❌ DSP preset invoke failed. Check console.');
                            }
                        }), className: "accent-btn" }, "Boot KNOUX Core")),
                react_1.default.createElement("aside", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                    } },
                    react_1.default.createElement("div", { style: {
                            borderRadius: 20,
                            padding: 16,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(15,23,42,0.74)',
                            boxShadow: '0 14px 30px rgba(15,23,42,0.85), 0 0 30px rgba(59,130,246,0.45)',
                        } },
                        react_1.default.createElement("div", { style: {
                                fontSize: 13,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                color: palette.textSecondary,
                                marginBottom: 8,
                            } }, "Runtime Status"),
                        react_1.default.createElement("ul", { style: {
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                fontSize: 14,
                                display: 'grid',
                                gap: 6,
                            } },
                            react_1.default.createElement("li", null, "\u2705 Electron main process compiled"),
                            react_1.default.createElement("li", null, "\u2705 Preload sandbox exposed as knouxAPI"),
                            react_1.default.createElement("li", null, "\u2705 React 18 + TypeScript wired"),
                            react_1.default.createElement("li", null, "\u2705 Webpack 5 + asset pipeline ready"))),
                    react_1.default.createElement("div", { style: {
                            borderRadius: 20,
                            padding: 16,
                            border: '1px dashed rgba(255,255,255,0.18)',
                            background: 'rgba(15,23,42,0.48)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            fontSize: 13,
                            color: palette.textSecondary,
                        } },
                        react_1.default.createElement("div", { style: { fontWeight: 600, color: palette.textPrimary } }, "Next KNOUX steps"),
                        react_1.default.createElement("div", null, "\u2022 \u0648\u0635\u0644 media_engine \u0645\u0639 IPC bridges \u0641\u064A desktop/main."),
                        react_1.default.createElement("div", null, "\u2022 \u062B\u0628\u062A AI modules \u0645\u0646 src/modules \u0648\u0631\u0628\u0637\u0647\u0627 \u0645\u0639 \u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u062A\u062D\u0643\u0645."),
                        react_1.default.createElement("div", null, "\u2022 \u0627\u0631\u0628\u0637 \u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u0645\u0643\u062A\u0628\u0629/\u0627\u0644\u062A\u0631\u0645\u064A\u0632\u0627\u062A \u0645\u0639 \u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0645\u062A\u0635\u0641\u062D.")))))));
};
const container = document.getElementById('root');
if (container) {
    const root = (0, client_1.createRoot)(container);
    root.render(react_1.default.createElement(App, null));
    console.log('✅ React rendered successfully!');
}
else {
    console.error('❌ Root element not found!');
}
//# sourceMappingURL=index.js.map