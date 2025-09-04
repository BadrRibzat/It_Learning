// i18n.ts
import i18next from 'i18next';
import { readFileSync } from 'fs';
import { join } from 'path';

const loadTranslations = (lng: string) => {
  try {
    const filePath = join(__dirname, '../data/translations', `${lng}.json`);
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading translations for ${lng}:`, error);
    return {};
  }
};

i18next.init({
  init: () => {
    const languages = ['en', 'fr', 'es', 'de', 'ar'];
    languages.forEach(lng => {
      const resources = loadTranslations(lng);
      i18next.addResourceBundle(lng, 'translation', resources);
    });
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
