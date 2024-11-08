import { createI18n } from 'vue-i18n';
import en from '../locales/en/messages.js';
import fr from '../locales/fr/messages.js';
import es from '../locales/es/messages.js';
import ar from '../locales/ar/messages.js';
import de from '../locales/de/messages.js';
import ja from '../locales/ja/messages.js';
import ko from '../locales/ko/messages.js';
import zh from '../locales/zh/messages.js';
import ru from '../locales/ru/messages.js';

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', dir: 'ltr', code: 'en' },
  fr: { name: 'Français', dir: 'ltr', code: 'fr' },
  es: { name: 'Español', dir: 'ltr', code: 'es' },
  ar: { name: 'العربية', dir: 'rtl', code: 'ar' },
  de: { name: 'Deutsch', dir: 'ltr', code: 'de' },
  ja: { name: 'Japanese', dir: 'ltr', code: 'ja' },
  ko: { name: 'Korean', dir: 'ltr', code: 'ko' },
  zh: { name: 'Chinese', dir: 'ltr', code: 'zh' },
  ru: { name: 'Русский', dir: 'ltr', code: 'ru' },
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('userLanguage') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    es,
    ar,
    de,
    ja,
    ko,
    zh,
    ru,
  },
});

export default i18n;
