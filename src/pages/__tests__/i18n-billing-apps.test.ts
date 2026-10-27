// @vitest-environment happy-dom

import type { Component } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'

import en from '@/plugins/i18n/en.json'
import zh from '@/plugins/i18n/zh.json'

import { pickReply } from '../ai-talk/data/replies'
import apps from '../apps/data/apps'
import BillingPlan from '../billing/components/billing-plan/index.vue'

type Messages = Record<string, any>

const localeMessages: [string, Messages][] = [
  ['en', en],
  ['zh', zh],
]

const namespaces = ['billing', 'apps', 'aiTalk'] as const

function getMessage(messages: Messages, key: string): unknown {
  return key.split('.').reduce<any>((acc, part) => acc?.[part], messages)
}

function leafKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null)
    return [prefix]

  return Object.entries(value).flatMap(([key, child]) => leafKeys(child, prefix ? `${prefix}.${key}` : key))
}

function translateWith(messages: Messages) {
  return (key: string) => getMessage(messages, key) as string
}

function mountWithLocale(component: Component, locale: 'en' | 'zh') {
  const i18n = createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, zh } })

  return mount(component, { global: { plugins: [i18n] } })
}

describe('billing, apps and aiTalk messages', () => {
  it('defines every added key in both locales', () => {
    for (const namespace of namespaces) {
      const enKeys = leafKeys(en[namespace]).sort()
      const zhKeys = leafKeys(zh[namespace]).sort()

      expect(zhKeys, `${namespace} keys missing in zh`).toEqual(enKeys)
    }
  })

  it('does not leave any added message empty', () => {
    for (const namespace of namespaces) {
      for (const key of leafKeys(en[namespace])) {
        for (const [locale, messages] of localeMessages) {
          const value = getMessage(messages, `${namespace}.${key}`)

          expect(value, `${namespace}.${key} missing in ${locale}`).toBeTypeOf('string')
          expect((value as string).trim(), `${namespace}.${key} empty in ${locale}`).not.toBe('')
        }
      }
    }
  })

  it('translates the added namespaces for the zh locale', () => {
    for (const namespace of namespaces) {
      expect(zh[namespace]).not.toEqual(en[namespace])
    }

    expect(zh.billing.history.title).toBe('账单记录')
    expect(zh.apps.title).toBe('应用')
    expect(zh.aiTalk.thinking).toBe('正在思考...')
  })
})

describe('apps data', () => {
  it('points every app description at a translated key', () => {
    for (const app of apps) {
      for (const [locale, messages] of localeMessages) {
        const value = getMessage(messages, app.descKey)

        expect(value, `${app.descKey} missing in ${locale}`).toBeTypeOf('string')
        expect(value).not.toBe('')
      }
    }
  })
})

describe('aiTalk replies', () => {
  it('answers an english keyword in english', () => {
    expect(pickReply('hello', translateWith(en))).toBe(en.aiTalk.answer.greeting)
  })

  it('answers a chinese keyword in chinese', () => {
    expect(pickReply('你好', translateWith(zh))).toBe(zh.aiTalk.answer.greeting)
  })

  it('matches chinese and english keywords for the same topic', () => {
    expect(pickReply('what can you do', translateWith(en))).toBe(en.aiTalk.answer.capabilities)
    expect(pickReply('你有什么功能', translateWith(zh))).toBe(zh.aiTalk.answer.capabilities)
    expect(pickReply('your strengths', translateWith(en))).toBe(en.aiTalk.answer.strengths)
    expect(pickReply('你的优点', translateWith(zh))).toBe(zh.aiTalk.answer.strengths)
    expect(pickReply('weaknesses', translateWith(en))).toBe(en.aiTalk.answer.weaknesses)
    expect(pickReply('你的缺点', translateWith(zh))).toBe(zh.aiTalk.answer.weaknesses)
    expect(pickReply('what is the weather', translateWith(en))).toBe(en.aiTalk.answer.weather)
    expect(pickReply('今天天气怎么样', translateWith(zh))).toBe(zh.aiTalk.answer.weather)
  })

  it('falls back to one of the default replies', () => {
    const defaultReplies = [
      en.aiTalk.answer.defaults.default1,
      en.aiTalk.answer.defaults.default2,
      en.aiTalk.answer.defaults.default3,
      en.aiTalk.answer.defaults.default4,
    ]

    expect(defaultReplies).toContain(pickReply('tell me a joke', translateWith(en)))

    const zhDefaultReplies = [
      zh.aiTalk.answer.defaults.default1,
      zh.aiTalk.answer.defaults.default2,
      zh.aiTalk.answer.defaults.default3,
      zh.aiTalk.answer.defaults.default4,
    ]

    expect(zhDefaultReplies).toContain(pickReply('讲个笑话', translateWith(zh)))
  })
})

describe('billing plan component', () => {
  it('renders plan labels through useI18n in script setup', () => {
    const enText = mountWithLocale(BillingPlan, 'en').text()

    expect(enText).toContain('Small Business')
    expect(enText).toContain('Switch to this plan')

    const zhText = mountWithLocale(BillingPlan, 'zh').text()

    expect(zhText).toContain('小微企业版')
    expect(zhText).toContain('切换到该套餐')
    expect(zhText).not.toContain('Switch to this plan')
  })
})
