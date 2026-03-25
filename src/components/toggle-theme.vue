<script setup lang="ts">
import { MoonIcon, SunIcon, SunMoonIcon } from '@lucide/vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton variant="outline" size="icon">
        <MoonIcon class=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <SunIcon class="absolute  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end">
      <UiDropdownMenuItem @click="mode = 'light'">
        <SunIcon />
        Light
      </UiDropdownMenuItem>
      <UiDropdownMenuItem @click="mode = 'dark'">
        <MoonIcon />
        Dark
      </UiDropdownMenuItem>
      <UiDropdownMenuItem @click="mode = 'auto'">
        <SunMoonIcon />
        System
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
