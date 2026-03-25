<script setup lang="ts">
import { MoonIcon, SunIcon, SunMoonIcon } from '@lucide/vue'
import { useColorMode } from '@vueuse/core'

import CommandItemHasIcon from './command-item-has-icon.vue'

defineEmits<{
  (e: 'click'): void
}>()

const mode = useColorMode()
</script>

<template>
  <UiCommandGroup heading="Theme">
    <UiCommandItem value="light" @click="mode = 'light', $emit('click')">
      <CommandItemHasIcon name="Light" :icon="SunIcon" />
    </UiCommandItem>
    <UiCommandItem value="dark" @click="mode = 'dark', $emit('click')">
      <CommandItemHasIcon name="Dark" :icon="MoonIcon" />
    </UiCommandItem>
    <UiCommandItem value="system" @click="mode = 'auto', $emit('click')">
      <CommandItemHasIcon name="System" :icon="SunMoonIcon" />
    </UiCommandItem>
  </UiCommandGroup>
</template>
