import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '../auth'
import { useSidebarConfigStore } from '../sidebar-config'
import { useThemeStore } from '../theme'

describe('stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates auth state', () => {
    const authStore = useAuthStore()

    expect(authStore.isLogin).toBe(false)

    authStore.isLogin = true

    expect(authStore.isLogin).toBe(true)
  })

  it('updates theme preferences', () => {
    const themeStore = useThemeStore()

    themeStore.setTheme('blue')
    themeStore.setRadius(0.75)
    themeStore.setContentLayout('full')

    expect(themeStore.theme).toBe('blue')
    expect(themeStore.radius).toBe(0.75)
    expect(themeStore.contentLayout).toBe('full')
  })

  it('updates sidebar navigation mode', () => {
    const sidebarConfigStore = useSidebarConfigStore()

    expect(sidebarConfigStore.navigationMode).toBe('collapsible')

    sidebarConfigStore.setNavigationMode('vercel')

    expect(sidebarConfigStore.navigationMode).toBe('vercel')
  })
})
