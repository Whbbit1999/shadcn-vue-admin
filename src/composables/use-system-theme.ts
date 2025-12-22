import { storeToRefs } from 'pinia'
import { watch } from 'vue'

import { THEMES } from '@/constants/themes'
import { useThemeStore } from '@/stores/theme'

export function useSystemTheme() {
  const themeStore = useThemeStore()
  const { setTheme, setRadius } = themeStore
  const { theme, radius } = storeToRefs(themeStore)

  if (typeof document !== 'undefined') {
    watch(theme, (theme) => {
      document.documentElement.classList.remove(...THEMES.map(t => `theme-${t}`))
      document.documentElement.classList.add(`theme-${theme}`)
    }, { immediate: true })

    watch(radius, (radius) => {
      document.documentElement.style.setProperty('--radius', `${radius}rem`)
    }, { immediate: true })
  }

  return {
    theme,
    radius,
    setTheme,
    setRadius,
  }
}
