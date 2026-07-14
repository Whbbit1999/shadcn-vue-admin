import { defineStore } from 'pinia'

import type { ContentLayout, Radius, Theme } from '@/constants/themes'

export const useThemeStore = defineStore('system-config', () => {
  const radius = shallowRef(0.5)
  function setRadius(newRadius: Radius) {
    radius.value = newRadius
  }
  const theme = shallowRef<Theme>('zinc')
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  const contentLayout = shallowRef<ContentLayout>('centered')
  function setContentLayout(newContentLayout: ContentLayout) {
    contentLayout.value = newContentLayout
  }
  return {
    radius,
    setRadius,

    theme,
    setTheme,

    contentLayout,
    setContentLayout,
  }
}, {
  persist: true,
})
