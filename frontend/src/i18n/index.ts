import { createI18n, I18n } from "vue-i18n";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import zh from "./locales/zh.json";

export default createI18n({
  legacy: false,
  locale: "en-US",
  fallbackLocale: "en-US",
  messages: {
    "en-US": en,
    "ar-SA": ar,
    "fr-FR": fr,
    "de-DE": de,
    "es-ES": es,
    "ja-JP": ja,
    "ko-KR": ko,
    "zh-CN": zh,
  },
  numberFormats: {
    // Add number formats for each locale
  },
  dateTimeFormats: {
    // Add date/time formats for each locale
  },
}) as I18n;
