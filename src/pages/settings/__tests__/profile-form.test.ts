// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { createTestI18n } from '@/test-utils/i18n'

import ProfileForm from '../components/profile-form.vue'

function mountProfileForm(locale: 'en' | 'zh') {
  return mount(ProfileForm, { global: { plugins: [createTestI18n(locale)] } })
}

describe('settings profile form', () => {
  it('renders english labels', () => {
    const text = mountProfileForm('en').text()

    expect(text).toContain('This is how others will see you on the site.')
    expect(text).toContain('Update profile')
    expect(text).toContain('Add URL')
  })

  it('renders chinese labels', () => {
    const text = mountProfileForm('zh').text()

    expect(text).toContain('个人资料')
    expect(text).toContain('更新个人资料')
    expect(text).toContain('添加链接')
    expect(text).not.toContain('Update profile')
  })

  it('keeps the mention placeholder inside the translated sentence', () => {
    const wrapper = mountProfileForm('zh')
    const mention = wrapper.findAll('span').find(node => node.text() === '@mention')

    expect(mention).toBeTruthy()
  })
})
