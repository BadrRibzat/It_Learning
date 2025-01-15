import { createI18n } from 'vue-i18n';
import { LANGUAGES } from '@/config';
import en from '../locales/en/messages.js';
import fr from '../locales/fr/messages.js';
import es from '../locales/es/messages.js';
import ar from '../locales/ar/messages.js';
import de from '../locales/de/messages.js';
import ja from '../locales/ja/messages.js';
import ko from '../locales/ko/messages.js';
import zh from '../locales/zh/messages.js';
import ru from '../locales/ru/messages.js';

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

export const SUPPORTED_LANGUAGES = LANGUAGES;

export default i18n;
