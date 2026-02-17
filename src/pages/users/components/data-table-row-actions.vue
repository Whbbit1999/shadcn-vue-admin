<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { Ellipsis } from 'lucide-vue-next'

import { Modal, ModalContent } from '@/components/prop-ui/modal'

import type { User } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<User>
}
const props = defineProps<DataTableRowActionsProps>()
const user = computed(() => props.row.original)
const isOpen = ref(false)

const showComponent = shallowRef<Component | null>(null)
type TCommand = 'edit' | 'delete'

const componentLoader: Record<TCommand, () => Promise<{ default: Component }>> = {
  edit: () => import('./user-resource.vue'),
  delete: () => import('./user-delete.vue'),
}

async function handleSelect(command: TCommand) {
  const { default: component } = await componentLoader[command]()
  showComponent.value = component
  isOpen.value = true
}
</script>

<template>
  <Modal v-model:open="isOpen">
    <UiDropdownMenu>
      <UiDropdownMenuTrigger as-child>
        <UiButton
          variant="ghost"
          class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis class="size-4" />
          <span class="sr-only">Open menu</span>
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent align="end" class="w-[160px]">
        <UiDropdownMenuItem @click.stop="handleSelect('edit')">
          Edit
        </UiDropdownMenuItem>

        <UiDropdownMenuItem @click.stop="handleSelect('delete')">
          Delete
          <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <ModalContent>
      <component :is="showComponent" :user="user" @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
