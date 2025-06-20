<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
</script>

<template>
  <h1 class="flex items-center gap-2 text-xl font-bold">
    <img :src="`${useColorMode().value === 'dark' ? '/logo.svg' : '/logo-black.svg'}`">
    <span>Shadcn Vue Admin</span>
  </h1>
</template>

<style scoped>
</style>
