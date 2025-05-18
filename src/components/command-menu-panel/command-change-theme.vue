<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Moon, Sun, SunMoon } from 'lucide-vue-next'

import CommandItemHasIcon from './command-item-has-icon.vue'

defineEmits<{
  (e: 'click'): void
}>()

const mode = useColorMode()
</script>

<template>
  <UiCommandGroup heading="Theme">
    <UiCommandItem value="light" @click="mode = 'light', $emit('click')">
      <CommandItemHasIcon name="Light" :icon="Sun" />
    </UiCommandItem>
    <UiCommandItem value="dark" @click="mode = 'dark', $emit('click')">
      <CommandItemHasIcon name="Dark" :icon="Moon" />
    </UiCommandItem>
    <UiCommandItem value="system" @click="mode = 'auto', $emit('click')">
      <CommandItemHasIcon name="System" :icon="SunMoon" />
    </UiCommandItem>
  </UiCommandGroup>
</template>

<style scoped>
</style>
