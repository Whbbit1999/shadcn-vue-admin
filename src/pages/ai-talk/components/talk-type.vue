<script setup lang="ts">
import { RadioTowerIcon, SparklesIcon } from '@lucide/vue'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import type { TalkMode } from '../types'

const type = defineModel<TalkMode>('type', {
  default: 'deep-think',
})

const types = [
  { type: 'deep-think', icon: SparklesIcon },
  { type: 'online', icon: RadioTowerIcon },
] satisfies { type: TalkMode, icon: Component }[]
</script>

<template>
  <ToggleGroup v-model="type" type="single" variant="outline" size="sm">
    <ToggleGroupItem v-for="modelType in types" :key="modelType.type" class="px-4" :value="modelType.type" :aria-label="modelType.type">
      <component :is="modelType.icon" class="size-4 mr-1" />
      {{ modelType.type }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>
