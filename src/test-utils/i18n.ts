import { createI18n } from 'vue-i18n'

import type { Language } from '@/plugins/i18n'

import en from '@/plugins/i18n/en.json'
import zh from '@/plugins/i18n/zh.json'

/**
 * Build a vue-i18n instance for component tests.
 * Use it as `global: { plugins: [createTestI18n()] }` so templates can call `$t()`.
 */
export function createTestI18n(locale: Language = 'en') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: { en, zh },
  })
}

/**
 * Read a nested message, for example `getMessage(en, 'table.pagination.first')`.
 * A missing path returns undefined.
 */
export function getMessage(messages: Record<string, any>, key: string): unknown {
  return key.split('.').reduce<any>((acc, part) => acc?.[part], messages)
}

/**
 * Collect every leaf key of a messages object, for example ['nav.dashboard', 'nav.group.general'].
 */
export function collectKeys(messages: Record<string, any>, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value))
      return collectKeys(value, path)

    return [path]
  })
}
