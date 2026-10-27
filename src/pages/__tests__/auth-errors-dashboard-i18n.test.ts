import { describe, expect, it } from 'vitest'

import en from '@/plugins/i18n/en.json'
import zh from '@/plugins/i18n/zh.json'

import { chartSeries } from '../dashboard/components/overview-chart.data'
import { resolveErrorPage } from '../errors/data/error-pages'

const localeMessages: [string, Record<string, any>][] = [
  ['en', en],
  ['zh', zh],
]

function getMessage(messages: Record<string, any>, key: string): unknown {
  return key.split('.').reduce<any>((acc, part) => acc?.[part], messages)
}

const AUTH_KEYS = [
  'login',
  'email',
  'password',
  'forgotPassword',
  'forgotPasswordPage.continue',
  'auth.loginDescription',
  'auth.noAccount',
  'auth.signUp',
  'auth.signIn',
  'auth.signUpDescription',
  'auth.haveAccount',
  'auth.forgotPasswordTitle',
  'auth.forgotPasswordDescription',
  'auth.dontHaveAccount',
  'auth.signUpLink',
  'auth.firstName',
  'auth.lastName',
  'auth.confirmPassword',
  'auth.createAccount',
  'auth.orContinueWith',
  'auth.agreeToLogin',
  'auth.agreeToSignUp',
  'auth.and',
  'auth.termsOfService',
  'auth.privacyPolicy',
  'auth.twoFactorTitle',
  'auth.twoFactorDescription',
  'auth.verify',
  'auth.noCodeReceived',
  'auth.resendCode',
]

const ERROR_KEYS = [
  'errors.goBack',
  'errors.backToHome',
]

const DASHBOARD_KEYS = [
  'download',
  'dashboard.title',
  'dashboard.description',
  'dashboard.toastGreeting',
  'dashboard.tabs.overview',
  'dashboard.tabs.analytics',
  'dashboard.tabs.reports',
  'dashboard.tabs.notifications',
  'dashboard.stats.totalRevenue',
  'dashboard.stats.subscriptions',
  'dashboard.stats.sales',
  'dashboard.stats.activeNow',
  'dashboard.stats.changeFromLastMonth',
  'dashboard.stats.changeSinceLastHour',
  'dashboard.chart.title',
  'dashboard.chart.description',
  'dashboard.chart.selectRange',
  'dashboard.chart.ranges.last3Months',
  'dashboard.chart.ranges.last30Days',
  'dashboard.chart.ranges.last7Days',
  'dashboard.recentSales.title',
  'dashboard.recentSales.description',
]

const ERROR_PAGE_CODES = ['401', '403', '404', '500', '503']

describe('auth, errors and dashboard messages', () => {
  it('defines every auth key in both locales', () => {
    for (const [locale, messages] of localeMessages) {
      for (const key of AUTH_KEYS) {
        const value = getMessage(messages, key)
        expect(value, `${key} missing in ${locale}`).toBeTypeOf('string')
        expect(value, `${key} empty in ${locale}`).not.toBe('')
      }
    }
  })

  it('defines every error key in both locales', () => {
    for (const [locale, messages] of localeMessages) {
      const keys = [...ERROR_KEYS]

      for (const code of ERROR_PAGE_CODES) {
        const { subtitleKey, descriptionKey } = resolveErrorPage(code)
        keys.push(subtitleKey, descriptionKey)
      }

      for (const key of keys) {
        const value = getMessage(messages, key)
        expect(value, `${key} missing in ${locale}`).toBeTypeOf('string')
        expect(value, `${key} empty in ${locale}`).not.toBe('')
      }
    }
  })

  it('defines every dashboard key in both locales', () => {
    for (const [locale, messages] of localeMessages) {
      for (const key of [...DASHBOARD_KEYS, ...Object.values(chartSeries)]) {
        const value = getMessage(messages, key)
        expect(value, `${key} missing in ${locale}`).toBeTypeOf('string')
        expect(value, `${key} empty in ${locale}`).not.toBe('')
      }
    }
  })

  it('translates the new namespaces for the zh locale', () => {
    for (const namespace of ['auth', 'errors', 'dashboard']) {
      expect(getMessage(zh, namespace)).not.toEqual(getMessage(en, namespace))
    }

    expect(zh.auth.signUp).toBe('注册')
    expect(zh.errors.pageNotFound.title).toBe('页面未找到')
    expect(zh.dashboard.tabs.overview).toBe('概览')
  })
})
