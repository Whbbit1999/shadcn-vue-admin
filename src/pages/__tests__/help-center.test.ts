// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'

import en from '@/plugins/i18n/en.json'
import zh from '@/plugins/i18n/zh.json'

import { socialMediaAccounts } from '../help-center-data'
import HelpCenter from '../help-center.vue'

const localeMessages: [string, Record<string, any>][] = [
  ['en', en],
  ['zh', zh],
]

function getMessage(messages: Record<string, any>, key: string): unknown {
  return key.split('.').reduce<any>((acc, part) => acc?.[part], messages)
}

function mountHelpCenter(locale: 'en' | 'zh') {
  const i18n = createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, zh } })
  return mount(HelpCenter, { global: { plugins: [i18n] } })
}

describe('socialMediaAccounts', () => {
  it('lists the supported community channels', () => {
    expect(socialMediaAccounts.map(account => account.title)).toEqual(['GitHub', 'Discord', 'Bilibili'])
  })

  it('uses https URLs or an intentionally empty URL', () => {
    for (const account of socialMediaAccounts) {
      expect(account.url === '' || account.url.startsWith('https://')).toBe(true)
    }
  })

  it('keeps localized descriptions in sync across locales', () => {
    for (const account of socialMediaAccounts) {
      for (const [locale, messages] of localeMessages) {
        const value = getMessage(messages, account.descKey)
        expect(value, `${account.descKey} missing in ${locale}`).toBeTypeOf('string')
        expect(value).not.toBe('')
      }
    }
  })
})

describe('helpCenter messages', () => {
  it('defines every key used by the page in both locales', () => {
    const keys = [
      'helpCenter.title',
      'helpCenter.description',
      'helpCenter.alertTitle',
      'helpCenter.alertDescription',
    ]

    for (const [locale, messages] of localeMessages) {
      for (const key of keys) {
        expect(getMessage(messages, key), `${key} missing in ${locale}`).toBeTypeOf('string')
      }
    }
  })

  it('translates the help center copy for the zh locale', () => {
    expect(zh.helpCenter).not.toEqual(en.helpCenter)
    expect(zh.helpCenter.community.bilibili).toBe('在哔哩哔哩上找到我们')
  })
})

describe('help center page', () => {
  it('renders the english copy', () => {
    const text = mountHelpCenter('en').text()

    expect(text).toContain('Help Center')
    expect(text).toContain('Heads up!')
    expect(text).toContain('The source code of Shadcn Vue Admin is publicly available on GitHub.')
  })

  it('renders the chinese copy without leftover english descriptions', () => {
    const text = mountHelpCenter('zh').text()

    expect(text).toContain('帮助中心')
    expect(text).toContain('提示')
    expect(text).toContain('在哔哩哔哩上找到我们')
    expect(text).not.toContain('The source code of Shadcn Vue Admin')
  })

  it('links each channel to its url', () => {
    const links = mountHelpCenter('en').findAll('a').map(link => link.attributes('href'))

    expect(links).toEqual(socialMediaAccounts.map(account => account.url || '#'))
  })
})
