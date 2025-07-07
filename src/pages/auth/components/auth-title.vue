<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
const logo = computed(() => {
  return mode.value === 'dark' ? '/logo.svg' : '/logo-black.svg'
})
</script>

<template>
  <h1 class="flex items-center gap-2 text-xl font-bold">
    <img :src="logo">
    <span>Shadcn Vue Admin</span>
  </h1>
</template>

<style scoped>
</style>
