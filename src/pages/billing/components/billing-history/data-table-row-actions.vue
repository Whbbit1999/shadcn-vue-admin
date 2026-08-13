<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { EllipsisIcon } from '@lucide/vue'

import type { features } from '@/components/data-table/features'

import { Modal, ModalContent } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { Billing } from './data/schema'

import { billingSchema } from './data/schema'

interface DataTableRowActionsProps {
  row: Row<typeof features, Billing>
}
const props = defineProps<DataTableRowActionsProps>()

const billing = computed(() => billingSchema.parse(props.row.original))
const showComponent = shallowRef<Component | null>(null)
const isOpen = shallowRef(false)

type TCommand = 'detail'

const componentLoader: Record<TCommand, () => Promise<{ default: Component }>> = {
  detail: () => import('./billing-detail.vue'),
}

async function handleSelect(command: TCommand) {
  try {
    const { default: component } = await componentLoader[command]()
    showComponent.value = component
    isOpen.value = true
  }
  catch (e) {
    console.error(`Failed to load component for "${command}"`, e)
  }
}
</script>

<template>
  <Modal v-model:open="isOpen">
    <DropdownMenu :modal="false">
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <EllipsisIcon class="size-4" />
          <span class="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem @select.stop="handleSelect('detail')">
            <span>Detail</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <ModalContent>
      <component :is="showComponent" :billing="billing" />
    </ModalContent>
  </Modal>
</template>
