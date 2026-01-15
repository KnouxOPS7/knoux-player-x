// Jest Setup for KNOUX Player X
// Mocks browser APIs not available in Node environment

import '@testing-library/jest-dom';

// Mock Web Audio API
class AudioContextMock {
    createGain = jest.fn(() => ({ connect: jest.fn(), gain: { value: 1 } }));
    createAnalyser = jest.fn(() => ({ connect: jest.fn(), fftSize: 2048 }));
    destination = {};
}
(global as any).AudioContext = AudioContextMock;
(global as any).webkitAudioContext = AudioContextMock;

// Mock LocalStorage
const localStorageMock = (function() {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

console.log("[TestEnv] KNOUX Setup Loaded");
