<script lang="ts" setup>
import { Icon } from '@iconify/vue'

import Marquee from '@/components/inspira-ui/marquee/index.vue'

const types = [
  { name: 'Nuxt', icon: 'simple-icons:nuxt' },
  { name: 'Vue', icon: 'simple-icons:vitess' },
  { name: 'Vite', icon: 'simple-icons:vite' },
  { name: 'vitest', icon: 'simple-icons:vitest' },
  { name: 'vscode', icon: 'simple-icons:visualstudiocode' },
  { name: 'mysql', icon: 'simple-icons:mysql' },
  { name: 'prisma', icon: 'simple-icons:prisma' },
]
</script>

<template>
  <div
    class="relative flex w-full flex-col items-center justify-center overflow-hidden -rotate-3"
  >
    <Marquee pause-on-hover reverse class="[--duration:50s]">
      <div
        v-for="type in types"
        :key="type.name"
        class="flex items-center gap-2 mx-4"
      >
        <Icon :icon="type.icon" class="w-12 h-12" />
        <span class="font-black text-4xl">{{ type.name }}</span>
      </div>
    </Marquee>

    <!-- Left Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-(--ui-bg) dark:from-(--ui-bg)"
    />

    <!-- Right Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-(--ui-bg) dark:from-(--ui-bg)"
    />
  </div>
</template>

<style scoped></style>
