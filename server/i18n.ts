// i18n.ts
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { resolve } from 'path';

i18next
  .use(Backend)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: resolve(__dirname, './data/translations/{{lng}}.json'),
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((err) => {
    console.error('Failed to initialize i18next:', err);
  });

export default i18next;
