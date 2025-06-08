<script lang="ts" setup>
import type { BasicColorSchema } from '@vueuse/core'
import type { Component } from 'vue'

import { useColorMode } from '@vueuse/core'
import { Moon, Sun, SunMoon } from 'lucide-vue-next'

const mode = useColorMode()

const colorModes: {
  colorMode: BasicColorSchema
  icon: Component
}[] = [
  { colorMode: 'light', icon: Sun },
  { colorMode: 'dark', icon: Moon },
  { colorMode: 'auto', icon: SunMoon },
]

function setColorMode(colorMode: BasicColorSchema) {
  mode.value = colorMode
}
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <UiLabel for="radius" class="text-xs">
      Color Mode
    </UiLabel>
    <div class="grid grid-cols-3 gap-2 py-1.5">
      <UiButton
        v-for="item in colorModes" :key="item.colorMode"
        variant="outline"
        class="justify-center items-center h-8 px-3"
        :class="item.colorMode === mode ? 'border-foreground border-2' : ''"
        @click="setColorMode(item.colorMode)"
      >
        <component :is="item.icon" />
        <span class="text-xs">{{ item.colorMode }}</span>
      </UiButton>
    </div>
  </div>
</template>

<style scoped>

</style>
