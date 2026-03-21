<script setup lang="ts">
import { ArrowDownAZ, ArrowDownZA, SlidersHorizontal } from 'lucide-vue-next'

import type { TSort } from './types'

const emits = defineEmits<{
  (e: 'update:sort', payload: TSort): void
}>()

const sort = defineModel<TSort>({ default: 'asc' })
watch(sort, (newValue) => {
  emits('update:sort', newValue!)
})
</script>

<template>
  <UiSelect v-model:model-value="sort">
    <UiSelectTrigger class="w-16">
      <UiSelectValue>
        <SlidersHorizontal :size="16" />
      </UiSelectValue>
    </UiSelectTrigger>
    <UiSelectContent align="end">
      <UiSelectItem value="asc">
        <div class="flex items-center gap-4">
          <ArrowDownAZ :size="16" />
          <span>Ascending</span>
        </div>
      </UiSelectItem>
      <UiSelectItem value="desc">
        <div class="flex items-center gap-4">
          <ArrowDownZA :size="16" />
          <span>Descending</span>
        </div>
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>
