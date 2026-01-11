<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { Ellipsis } from 'lucide-vue-next'

import { useModal } from '@/composables/use-modal'

import type { Billing } from './data/schema'

import { billingSchema } from './data/schema'

interface DataTableRowActionsProps {
  row: Row<Billing>
}
const props = defineProps<DataTableRowActionsProps>()

const billing = computed(() => billingSchema.parse(props.row.original))
const showComponent = shallowRef<Component | null>(null)
function handleSelect(command: string) {
  if (command === 'detail') {
    showComponent.value = defineAsyncComponent(() => import('./billing-detail.vue'))
  }
}
const { Modal, contentClass } = useModal()
</script>

<template>
  <component :is="Modal.Root">
    <UiDropdownMenu :modal="false">
      <UiDropdownMenuTrigger as-child>
        <UiButton
          variant="ghost"
          class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis class="size-4" />
          <span class="sr-only">Open menu</span>
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent>
        <UiDropdownMenuGroup>
          <component :is="Modal.Trigger" as-child>
            <UiDropdownMenuItem @select.stop="handleSelect('detail')">
              <span>Detail</span>
            </UiDropdownMenuItem>
          </component>
        </UiDropdownMenuGroup>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
    <component :is="Modal.Content" :class="contentClass">
      <component :is="showComponent" :billing="billing" />
    </component>
  </component>
</template>
