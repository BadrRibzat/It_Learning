import { createI18n } from 'vue-i18n'
import messages from '@/locales/en/messages.js'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: messages
  }
})

export default i18n
