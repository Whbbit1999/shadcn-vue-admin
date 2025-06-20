<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Moon, Sun, SunMoon } from 'lucide-vue-next'

const mode = useColorMode()
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton variant="outline" size="icon">
        <Moon class=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Sun class="absolute  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end">
      <UiDropdownMenuItem @click="mode = 'light'">
        <Sun />
        Light
      </UiDropdownMenuItem>
      <UiDropdownMenuItem @click="mode = 'dark'">
        <Moon />
        Dark
      </UiDropdownMenuItem>
      <UiDropdownMenuItem @click="mode = 'auto'">
        <SunMoon />
        System
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
