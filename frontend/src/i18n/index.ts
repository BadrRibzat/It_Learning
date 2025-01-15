import { createI18n, I18n } from "vue-i18n";
import { LocaleMessage } from "./types";

import enUS from "./locales/en-US.json";
import arSA from "./locales/ar-SA.json";
import frFR from "./locales/fr-FR.json";
import deDE from "./locales/de-DE.json";
import esES from "./locales/es-ES.json";
import jaJP from "./locales/ja-JP.json";
import koKR from "./locales/ko-KR.json";
import zhCN from "./locales/zh-CN.json";

export default createI18n({
  legacy: false,
  locale: "en-US",
  fallbackLocale: "en-US",
  messages: {
    "en-US": enUS as LocaleMessage,
    "ar-SA": arSA as LocaleMessage,
    "fr-FR": frFR as LocaleMessage,
    "de-DE": deDE as LocaleMessage,
    "es-ES": esES as LocaleMessage,
    "ja-JP": jaJP as LocaleMessage,
    "ko-KR": koKR as LocaleMessage,
    "zh-CN": zhCN as LocaleMessage,
  },
  numberFormats: {
    // Add number formats for each locale
  },
  dateTimeFormats: {
    // Add date/time formats for each locale
  },
}) as I18n;
