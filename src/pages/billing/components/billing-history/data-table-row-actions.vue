<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { Ellipsis } from 'lucide-vue-next'

import { Modal, ModalContent } from '@/components/prop-ui/modal'

import type { Billing } from './data/schema'

import { billingSchema } from './data/schema'

interface DataTableRowActionsProps {
  row: Row<Billing>
}
const props = defineProps<DataTableRowActionsProps>()

const billing = computed(() => billingSchema.parse(props.row.original))
const showComponent = shallowRef<Component | null>(null)
const isOpen = ref(false)

type TCommand = 'detail'

const componentLoader: Record<TCommand, () => Promise<{ default: Component }>> = {
  detail: () => import('./billing-detail.vue'),
}

async function handleSelect(command: TCommand) {
  const { default: component } = await componentLoader[command]()
  showComponent.value = component
  isOpen.value = true
}
</script>

<template>
  <Modal v-model:open="isOpen">
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
          <UiDropdownMenuItem @select.stop="handleSelect('detail')">
            <span>Detail</span>
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
    <ModalContent>
      <component :is="showComponent" :billing="billing" />
    </ModalContent>
  </Modal>
</template>
