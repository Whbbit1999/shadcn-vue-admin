import type { App } from 'vue'

import { createI18n } from 'vue-i18n'

import en from './en.json'
import zh from './zh.json'

export function setupI18n(app: App) {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      zh,
      en,
    },
  })
  app.use(i18n)
}
