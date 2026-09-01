<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

import { AUTH_CONFIG } from '@/config/auth.ts'
import { SITE_CONFIG } from '@/config/site'

const mode = useColorMode()
const logo = computed(() => mode.value === 'dark' ? SITE_CONFIG.logo.dark : SITE_CONFIG.logo.light)
</script>

<template>
  <h1 class="flex items-center gap-2 text-xl font-bold">
    <img :src="logo">

    <span>{{ AUTH_CONFIG.title }}</span>
  </h1>
</template>
