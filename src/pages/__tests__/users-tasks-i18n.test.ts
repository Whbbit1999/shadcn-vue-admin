// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'

import en from '@/plugins/i18n/en.json'
import zh from '@/plugins/i18n/zh.json'

import UserResource from '../users/components/user-resource.vue'

const localeMessages: [string, Record<string, any>][] = [
  ['en', en],
  ['zh', zh],
]

const usersKeys = [
  'users.title',
  'users.description',
  'users.actions.create',
  'users.actions.invite',
  'users.actions.mockLoading',
  'users.actions.edit',
  'users.actions.delete',
  'users.actions.cancel',
  'users.actions.openMenu',
  'users.table.username',
  'users.table.email',
  'users.table.phoneNumber',
  'users.table.status',
  'users.table.role',
  'users.table.searchPlaceholder',
  'users.filters.status',
  'users.filters.role',
  'users.status.active',
  'users.status.inactive',
  'users.status.invited',
  'users.status.suspended',
  'users.role.superadmin',
  'users.role.admin',
  'users.role.manager',
  'users.role.cashier',
  'users.create.title',
  'users.create.description',
  'users.edit.title',
  'users.edit.description',
  'users.invite.title',
  'users.invite.description',
  'users.inviteForm.email',
  'users.inviteForm.role',
  'users.inviteForm.description',
  'users.inviteForm.submit',
  'users.form.firstName',
  'users.form.lastName',
  'users.form.username',
  'users.form.email',
  'users.form.phoneNumber',
  'users.form.status',
  'users.form.role',
  'users.form.selectStatus',
  'users.form.selectRole',
  'users.form.saveChanges',
  'users.delete.title',
  'users.delete.description',
  'users.delete.toastTitle',
  'users.empty.title',
  'users.empty.description',
  'users.toast.submitted',
]

const tasksKeys = [
  'tasks.title',
  'tasks.description',
  'tasks.actions.create',
  'tasks.actions.import',
  'tasks.actions.edit',
  'tasks.actions.delete',
  'tasks.actions.cancel',
  'tasks.actions.makeCopy',
  'tasks.actions.favorite',
  'tasks.actions.labels',
  'tasks.actions.openMenu',
  'tasks.actions.deleteSelected',
  'tasks.table.task',
  'tasks.table.title',
  'tasks.table.status',
  'tasks.table.priority',
  'tasks.table.searchPlaceholder',
  'tasks.filters.status',
  'tasks.filters.priority',
  'tasks.status.backlog',
  'tasks.status.todo',
  'tasks.status.inProgress',
  'tasks.status.done',
  'tasks.status.canceled',
  'tasks.priority.low',
  'tasks.priority.medium',
  'tasks.priority.high',
  'tasks.label.bug',
  'tasks.label.feature',
  'tasks.label.documentation',
  'tasks.create.title',
  'tasks.create.description',
  'tasks.edit.title',
  'tasks.edit.description',
  'tasks.form.title',
  'tasks.form.titlePlaceholder',
  'tasks.form.status',
  'tasks.form.label',
  'tasks.form.priority',
  'tasks.form.selectStatus',
  'tasks.form.submit',
  'tasks.importDialog.title',
  'tasks.importDialog.description',
  'tasks.importDialog.file',
  'tasks.importDialog.fileRequired',
  'tasks.delete.title',
  'tasks.delete.description',
  'tasks.delete.toastTitle',
  'tasks.deleteBatch.title',
  'tasks.deleteBatch.description',
  'tasks.deleteBatch.warning',
  'tasks.deleteBatch.confirmHint',
  'tasks.deleteBatch.confirmPlaceholder',
  'tasks.deleteBatch.warningTitle',
  'tasks.deleteBatch.warningDescription',
  'tasks.deleteBatch.confirmInvalid',
  'tasks.deleteBatch.loading',
  'tasks.deleteBatch.success',
  'tasks.deleteBatch.error',
  'tasks.empty.title',
  'tasks.empty.description',
  'tasks.bulk.entityName',
  'tasks.toast.submitted',
]

const translationKeys = [...usersKeys, ...tasksKeys]

function getMessage(messages: Record<string, any>, key: string): unknown {
  return key.split('.').reduce<any>((acc, part) => acc?.[part], messages)
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
}

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory())
      return collectSourceFiles(path)
    return /\.(?:vue|ts)$/.test(entry) ? [path] : []
  })
}

const pagesDir = resolve(__dirname, '..')
const sourceFiles = [
  ...collectSourceFiles(join(pagesDir, 'users')),
  ...collectSourceFiles(join(pagesDir, 'tasks')),
]
const sourceKeys = new Set<string>()
for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf-8')
  for (const match of source.matchAll(/['"`]((?:users|tasks)\.[\w.]+)['"`]/g))
    sourceKeys.add(match[1])
}

function mountUserResource(locale: 'en' | 'zh') {
  const i18n = createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, zh } })
  return mount(UserResource, {
    global: {
      plugins: [i18n],
      stubs: {
        ModalHeader: { template: '<div><slot /></div>' },
        ModalTitle: { template: '<h2><slot /></h2>' },
        ModalDescription: { template: '<p><slot /></p>' },
        UserForm: true,
      },
    },
  })
}

describe('users and tasks messages', () => {
  it('defines every expected key in both locales', () => {
    for (const [locale, messages] of localeMessages) {
      for (const key of translationKeys) {
        expect(getMessage(messages, key), `${key} missing in ${locale}`).toBeTypeOf('string')
        expect(getMessage(messages, key), `${key} is empty in ${locale}`).not.toBe('')
      }
    }
  })

  it('defines every key referenced by the users and tasks source files', () => {
    expect(sourceKeys.size).toBeGreaterThan(0)

    for (const [locale, messages] of localeMessages) {
      for (const key of sourceKeys) {
        const value = getMessage(messages, key)
        expect(value, `${key} used in source but missing in ${locale}`).toBeTypeOf('string')
        expect(value, `${key} is empty in ${locale}`).not.toBe('')
      }
    }
  })

  it('keeps interpolation placeholders in sync across locales', () => {
    for (const key of translationKeys) {
      const enValue = getMessage(en, key) as string
      const zhValue = getMessage(zh, key) as string
      expect(placeholders(zhValue), `${key} has different placeholders in zh`).toEqual(placeholders(enValue))
    }
  })

  it('translates the users and tasks namespaces for the zh locale', () => {
    expect(zh.users.title).toBe('用户')
    expect(zh.users.table.email).toBe('邮箱')
    expect(zh.tasks.title).toBe('任务')
    expect(zh.tasks.status.inProgress).toBe('进行中')
    expect(zh.tasks.actions.deleteSelected).toBe('删除所选任务')
  })
})

describe('localized users page components', () => {
  it('renders the create title through useI18n in script setup', () => {
    const text = mountUserResource('en').text()

    expect(text).toContain('New User')
    expect(text).toContain('Create new user')
  })

  it('renders the chinese create title without leftover english copy', () => {
    const text = mountUserResource('zh').text()

    expect(text).toContain('新建用户')
    expect(text).toContain('创建新用户')
    expect(text).not.toContain('New User')
  })
})
