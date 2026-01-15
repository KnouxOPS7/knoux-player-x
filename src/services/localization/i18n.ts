// Author: knoux (أبو ريتاج) — KNOUX Player X™ Premium Architecture
// Generated on: 2026-01-15 01:13:15

export const resources = {
  ar: { translation: { "welcome": "أهلاً بك في كنوج بلاير" } },
  en: { translation: { "welcome": "Welcome to KNOUX Player" } }
};

export const getLang = () => localStorage.getItem('lang') || 'en';
