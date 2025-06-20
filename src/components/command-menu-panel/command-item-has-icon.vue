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
    <component :is="icon" v-if="icon" class="size-4" />
    <Milestone v-else class="size-4" />
    {{ name }}
  </div>
</template>

<style scoped>
</style>
