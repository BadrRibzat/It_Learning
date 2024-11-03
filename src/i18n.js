import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    message: {
      hello: 'Hello world',
    },
  },
  ar: {
    message: {
      hello: 'مرحبا بالعالم',
    },
  },
  // Add other languages here
};

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n;
