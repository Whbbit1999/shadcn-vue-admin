<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { contentLayouts, useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { setContentLayout } = themeStore
const { contentLayout } = storeToRefs(themeStore)
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <UiLabel for="radius" class="text-xs">
      Content Layout
    </UiLabel>
    <div class="grid grid-cols-2 gap-2 py-1.5">
      <UiButton
        v-for="layout in contentLayouts" :key="layout.label"
        variant="outline"
        class="justify-center h-8 px-3"
        :class="contentLayout === layout.value ? 'border-foreground border-2' : ''"
        @click="setContentLayout(layout.value)"
      >
        <component :is="layout.icon" />
        {{ layout.label }}
      </UiButton>
    </div>
  </div>
</template>

<style scoped>

</style>
