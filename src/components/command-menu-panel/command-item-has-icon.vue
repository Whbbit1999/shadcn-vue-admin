<script setup lang="ts">
import type { Component } from 'vue'

import { Milestone } from 'lucide-vue-next'

const { icon } = defineProps<{
  name: string
  icon?: Component
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <component :is="icon" v-if="icon" class="w-4 h-4" />
    <Milestone v-else class="w-4 h-4" />
    {{ name }}
  </div>
</template>

<style scoped>
</style>
