<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { THEMES, themes, useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { setTheme } = themeStore
const { theme: t } = storeToRefs(themeStore)

watchEffect(() => {
  document.documentElement.classList.remove(...THEMES.map(theme => `theme-${theme}`))
  document.documentElement.classList.add(`theme-${t.value}`)
})
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <UiLabel for="radius" class="text-xs">
      Color
    </UiLabel>
    <div class="grid grid-cols-2 gap-2 py-1.5">
      <UiButton
        v-for="theme in themes" :key="theme.theme"
        variant="outline"
        class="justify-center h-8 px-3"
        :class="t === theme.theme ? 'border-foreground border-2' : ''"
        @click="setTheme(theme.theme)"
      >
        <span
          :style="{
            '--theme-primary': theme.primaryColor,
          }"
          class="size-2 rounded-full bg-[var(--theme-primary)]"
        />
        <span class="text-xs">{{ theme.theme[0].toUpperCase() }}{{ theme.theme.slice(1) }}</span>
      </UiButton>
    </div>
  </div>
</template>
