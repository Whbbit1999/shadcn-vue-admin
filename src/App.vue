<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Loading from '@/components/loading.vue'
import { Toaster } from '@/components/ui/sonner'
import { THEMES, useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { theme: t, radius } = storeToRefs(themeStore)

watchEffect(() => {
  document.documentElement.classList.remove(...THEMES.map(theme => `theme-${theme}`))
  document.documentElement.classList.add(`theme-${t.value}`)
  document.documentElement.style.setProperty('--radius', `${radius.value}rem`)
})
</script>

<template>
  <Toaster />
  <!-- <VueQueryDevtools /> -->

  <Suspense>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route" />
    </router-view>

    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
