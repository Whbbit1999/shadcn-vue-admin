<script setup lang="ts">
import { RadioTowerIcon, SparklesIcon } from '@lucide/vue'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import type { TalkMode } from '../types'

const type = defineModel<TalkMode>('type', {
  default: 'deep-think',
})

const types = [
  { type: 'deep-think', icon: SparklesIcon, labelKey: 'aiTalk.talkType.deepThink' },
  { type: 'online', icon: RadioTowerIcon, labelKey: 'aiTalk.talkType.online' },
] satisfies { type: TalkMode, icon: Component, labelKey: string }[]
</script>

<template>
  <ToggleGroup v-model="type" type="single" variant="outline" size="sm">
    <ToggleGroupItem v-for="modelType in types" :key="modelType.type" class="px-4" :value="modelType.type" :aria-label="$t(modelType.labelKey)">
      <component :is="modelType.icon" class="size-4 mr-1" />
      {{ $t(modelType.labelKey) }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>
