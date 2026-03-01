import type { App } from 'vue'

import { useStorage } from '@vueuse/core'
import { createI18n } from 'vue-i18n'

import en from './en.json'
import zh from './zh.json'

const savedLocale = useStorage('app-locale', 'en')

export function setupI18n(app: App) {
  const i18n = createI18n({
    legacy: false,
    locale: savedLocale.value,
    fallbackLocale: 'en',
    messages: {
      zh,
      en,
    },
  })
  app.use(i18n)
}
