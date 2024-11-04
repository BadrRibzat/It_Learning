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
  fr: {
    message: {
      hello: 'Bonjour le monde',
    },
  },
  es: {
    message: {
      hello: 'Hola mundo',
    },
  },
  de: {
    message: {
      hello: 'Hallo Welt',
    },
  },
  ja: {
    message: {
      hello: 'こんにちは世界',
    },
  },
  ko: {
    message: {
      hello: '안녕하세요 세계',
    },
  },
  zh: {
    message: {
      hello: '你好，世界',
    },
  },
};

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n;
