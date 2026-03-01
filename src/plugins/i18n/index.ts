import { useStorage } from '@vueuse/core'

export type Language = 'en' | 'zh'

export const SUPPORTED_LOCALES = new Set<Language>([
  'en',
  'zh',
])

export const DEFAULT_LOCALE: Language = 'en'

export const appLocale = useStorage<Language>('app-locale', 'en')
