// @vitest-environment happy-dom

import type { Component } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import en from '@/plugins/i18n/en.json'
import zh from '@/plugins/i18n/zh.json'
import { createTestI18n } from '@/test-utils/i18n'

import { pickReply } from '../ai-talk/data/replies'
import BillingPlan from '../billing/components/billing-plan/index.vue'
import UserResource from '../users/components/user-resource.vue'

function mountWithLocale(component: Component, locale: 'en' | 'zh', stubs: Record<string, any> = {}) {
  return mount(component, { global: { plugins: [createTestI18n(locale)], stubs } })
}

/** The modal title components need a dialog root, so render their slots plainly. */
const modalStubs = {
  ModalHeader: { template: '<div><slot /></div>' },
  ModalTitle: { template: '<h2><slot /></h2>' },
  ModalDescription: { template: '<p><slot /></p>' },
  UserForm: true,
}

function translateWith(messages: Record<string, any>) {
  return (key: string) => key.split('.').reduce<any>((acc, part) => acc?.[part], messages) as string
}

describe('localized pages render', () => {
  it('renders the user create dialog in both locales', () => {
    const enText = mountWithLocale(UserResource, 'en', modalStubs).text()
    expect(enText).toContain('New User')
    expect(enText).toContain('Create new user')

    const zhText = mountWithLocale(UserResource, 'zh', modalStubs).text()
    expect(zhText).toContain('新建用户')
    expect(zhText).not.toContain('New User')
  })

  it('renders the billing plan card in both locales', () => {
    const enText = mountWithLocale(BillingPlan, 'en').text()
    expect(enText).toContain('Small Business')
    expect(enText).toContain('Switch to this plan')

    const zhText = mountWithLocale(BillingPlan, 'zh').text()
    expect(zhText).toContain('小微企业版')
    expect(zhText).not.toContain('Switch to this plan')
  })

  it('translates every page namespace for the zh locale', () => {
    for (const namespace of ['users', 'tasks', 'billing', 'apps', 'aiTalk', 'auth', 'errors', 'dashboard']) {
      expect(zh[namespace as 'auth'], `${namespace} is not translated`).not.toEqual(en[namespace as 'auth'])
    }
  })
})

describe('ai talk reply bot', () => {
  it('answers the same topic for an english and a chinese keyword', () => {
    const t = translateWith(en)
    const tZh = translateWith(zh)

    expect(pickReply('what can you do', t)).toBe(en.aiTalk.answer.capabilities)
    expect(pickReply('你有什么功能', tZh)).toBe(zh.aiTalk.answer.capabilities)
    expect(pickReply('your strengths', t)).toBe(en.aiTalk.answer.strengths)
    expect(pickReply('你的优点', tZh)).toBe(zh.aiTalk.answer.strengths)
    expect(pickReply('weaknesses', t)).toBe(en.aiTalk.answer.weaknesses)
    expect(pickReply('你的缺点', tZh)).toBe(zh.aiTalk.answer.weaknesses)
    expect(pickReply('what is the weather', t)).toBe(en.aiTalk.answer.weather)
    expect(pickReply('今天天气怎么样', tZh)).toBe(zh.aiTalk.answer.weather)
    expect(pickReply('你好', tZh)).toBe(zh.aiTalk.answer.greeting)
  })

  it('falls back to one of the default replies', () => {
    const enDefaults = Object.values(en.aiTalk.answer.defaults)
    const zhDefaults = Object.values(zh.aiTalk.answer.defaults)

    expect(enDefaults).toContain(pickReply('tell me a joke', translateWith(en)))
    expect(zhDefaults).toContain(pickReply('讲个笑话', translateWith(zh)))
  })
})
