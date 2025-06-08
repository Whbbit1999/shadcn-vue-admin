<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { RADIUS, useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { setRadius } = themeStore
const { radius } = storeToRefs(themeStore)

watchEffect(() => {
  document.documentElement.style.setProperty('--radius', `${radius.value}rem`)
})
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <UiLabel for="radius" class="text-xs">
      Radius
    </UiLabel>
    <div class="grid grid-cols-5 gap-2 py-1.5">
      <UiButton
        v-for="rayon in RADIUS" :key="rayon"
        variant="outline"
        class="justify-center h-8 px-3"
        :class="rayon === radius ? 'border-foreground border-2' : ''"
        @click="setRadius(rayon)"
      >
        <span class="text-xs">{{ rayon }}</span>
      </UiButton>
    </div>
  </div>
</template>
