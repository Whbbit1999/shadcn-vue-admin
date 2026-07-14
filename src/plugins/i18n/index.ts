import { useStorage } from '@vueuse/core'

export type Language = 'en' | 'zh'

export const SUPPORTED_LOCALES = new Set<Language>([
  'en',
  'zh',
])

export const DEFAULT_LOCALE: Language = 'en'

export const appLocale = useStorage<Language>('app-locale', DEFAULT_LOCALE)

export function validateAppLocale() {
  if (!SUPPORTED_LOCALES.has(appLocale.value)) {
    appLocale.value = DEFAULT_LOCALE
  }
}
