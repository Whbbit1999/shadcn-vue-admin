import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { navData, otherPages, settingsNavItems } from '@/constants/sidebar-data'
import en from '@/plugins/i18n/en.json'
import zh from '@/plugins/i18n/zh.json'
import { collectKeys, getMessage } from '@/test-utils/i18n'

const SRC_DIR = fileURLToPath(new URL('../../..', import.meta.url))

/**
 * Intentional placeholders: the pricing cards show no billing cycle or period.
 * Keep them empty instead of showing a made-up label.
 */
const ALLOWED_EMPTY_KEY = /^marketing\.pricingPlans\.\w+\.billing\.(?:cycle|period)$/

const locales: [string, Record<string, any>][] = [
  ['en', en],
  ['zh', zh],
]

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry)

    if (statSync(fullPath).isDirectory())
      return entry === '__tests__' ? [] : listSourceFiles(fullPath)

    return /\.(?:vue|ts)$/.test(entry) ? [fullPath] : []
  })
}

function collectUsedKeys(): { key: string, file: string }[] {
  const pattern = /(?:\$t|\bt)\(\s*'([\w.]+)'/g
  const used: { key: string, file: string }[] = []

  for (const file of listSourceFiles(SRC_DIR)) {
    if (file.includes('/test-utils/'))
      continue

    const source = readFileSync(file, 'utf-8')
    for (const match of source.matchAll(pattern))
      used.push({ key: match[1], file: relative(SRC_DIR, file) })
  }

  return used
}

function mainNavKeys(): string[] {
  const groups = [...navData, ...otherPages]
  const keys: string[] = [...settingsNavItems.map(item => item.titleKey)]

  for (const group of groups) {
    keys.push(group.titleKey)
    for (const item of group.items) {
      keys.push(item.titleKey)
      for (const subItem of item.items ?? [])
        keys.push(subItem.titleKey)
    }
  }

  return [...new Set(keys)]
}

describe('locale files', () => {
  it('define the same keys', () => {
    const enKeys = collectKeys(en).sort()
    const zhKeys = collectKeys(zh).sort()

    expect(zhKeys.filter(key => !enKeys.includes(key))).toEqual([])
    expect(enKeys.filter(key => !zhKeys.includes(key))).toEqual([])
  })

  it('have no empty message', () => {
    for (const [locale, messages] of locales) {
      for (const key of collectKeys(messages)) {
        const value = getMessage(messages, key)
        expect(typeof value, `${locale}: ${key}`).toBe('string')

        if (!ALLOWED_EMPTY_KEY.test(key))
          expect(String(value).trim(), `${locale}: ${key}`).not.toBe('')
      }
    }
  })
})

describe('locale files: message shape', () => {
  const interpolation = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()

  it('uses the same interpolation placeholders in both locales', () => {
    for (const key of collectKeys(en)) {
      const enValue = getMessage(en, key)
      const zhValue = getMessage(zh, key)

      if (typeof enValue !== 'string' || typeof zhValue !== 'string')
        continue

      expect(interpolation(zhValue), `${key} has different placeholders in zh`).toEqual(interpolation(enValue))
    }
  })

  it('does not fall back to the key itself', () => {
    for (const [locale, messages] of locales) {
      for (const key of collectKeys(messages)) {
        // vue-i18n renders the key when a message is missing; a copy-pasted key
        // would show up in the UI the same way.
        expect(getMessage(messages, key), `${locale}: ${key}`).not.toBe(key)
      }
    }
  })
})

describe('navigation labels', () => {
  it('resolve in every locale', () => {
    for (const key of mainNavKeys()) {
      for (const [locale, messages] of locales) {
        const value = getMessage(messages, key)
        expect(typeof value, `${locale}: ${key}`).toBe('string')
        // A missing key returns the key itself: the sidebar would show `nav.x`.
        expect(value, `${locale}: ${key}`).not.toBe(key)
      }
    }
  })
})

describe('translation keys used in components', () => {
  it('exist in every locale', () => {
    const used = collectUsedKeys()
    expect(used.length).toBeGreaterThan(100)

    for (const [locale, messages] of locales) {
      const missing = used
        .filter(({ key }) => typeof getMessage(messages, key) !== 'string')
        .map(({ key, file }) => `${locale}: ${key} (${file})`)

      expect(missing).toEqual([])
    }
  })
})
