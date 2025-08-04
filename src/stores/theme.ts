import type { Component } from 'vue'

import { MoveHorizontal, UnfoldHorizontal } from 'lucide-vue-next'
import { defineStore } from 'pinia'
import { h } from 'vue'

export const THEMES = ['zinc', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet'] as const
export type Theme = typeof THEMES[number]

export const themes: { theme: Theme, primaryColor: string }[] = [
  { theme: 'zinc', primaryColor: 'oklch(44.2% 0.017 285.786)' },
  { theme: 'red', primaryColor: 'oklch(57.7% 0.245 27.325)' },
  { theme: 'rose', primaryColor: 'oklch(0.645 0.246 16.439)' },
  { theme: 'orange', primaryColor: 'oklch(0.705 0.213 47.604)' },
  { theme: 'green', primaryColor: 'oklch(0.723 0.219 149.579)' },
  { theme: 'blue', primaryColor: 'oklch(48.8% 0.243 264.376)' },
  { theme: 'yellow', primaryColor: 'oklch(68.1% 0.162 75.834)' },
  { theme: 'violet', primaryColor: 'oklch(0.606 0.25 292.717)' },
] as const

export const RADIUS = [0, 0.25, 0.5, 0.75, 1]
export type Radius = typeof RADIUS[number]

export type ContentLayout = 'full' | 'centered'
export const contentLayouts: { label: string, value: ContentLayout, icon: Component }[] = [
  { label: 'Full', value: 'full', icon: h(UnfoldHorizontal) },
  { label: 'Centered', value: 'centered', icon: h(MoveHorizontal) },
]

export const useThemeStore = defineStore('system-config', () => {
  const radius = ref(0.5)
  function setRadius(newRadius: Radius) {
    radius.value = newRadius
  }
  const theme = ref<Theme>('zinc')
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  const contentLayout = ref<ContentLayout>('centered')
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
