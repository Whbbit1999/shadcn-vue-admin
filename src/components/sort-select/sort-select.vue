<script setup lang="ts">
import { ArrowDownAZIcon, ArrowDownZAIcon, SlidersHorizontalIcon } from '@lucide/vue'

export type TSort = 'asc' | 'desc'

const sort = defineModel<TSort>('sort', { default: 'asc' })
</script>

<template>
  <UiSelect v-model:model-value="sort">
    <UiSelectTrigger class="w-16">
      <UiSelectValue>
        <SlidersHorizontalIcon :size="16" />
      </UiSelectValue>
    </UiSelectTrigger>
    <UiSelectContent align="end">
      <UiSelectItem value="asc">
        <div class="flex items-center gap-4">
          <ArrowDownAZIcon :size="16" />
          <span>Ascending</span>
        </div>
      </UiSelectItem>
      <UiSelectItem value="desc">
        <div class="flex items-center gap-4">
          <ArrowDownZAIcon :size="16" />
          <span>Descending</span>
        </div>
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>
