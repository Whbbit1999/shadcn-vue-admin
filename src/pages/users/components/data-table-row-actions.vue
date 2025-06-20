<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { Ellipsis } from 'lucide-vue-next'

import type { User } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<User>
}
const props = defineProps<DataTableRowActionsProps>()
const user = computed(() => props.row.original)
const isOpen = ref(false)

const showComponent = shallowRef<Component | null>(null)
type TCommand = 'edit' | 'delete'
function handleSelect(command: TCommand) {
  switch (command) {
    case 'edit':
      showComponent.value = defineAsyncComponent(() => import('./user-resource.vue'))
      break
    case 'delete':
      showComponent.value = defineAsyncComponent(() => import('./user-delete.vue'))
      break
  }
}
</script>

<template>
  <UiDialog v-model:open="isOpen">
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
        <UiDialogTrigger as-child>
          <UiDropdownMenuItem @click.stop="handleSelect('edit')">
            Edit
          </UiDropdownMenuItem>
        </UiDialogTrigger>

        <UiDialogTrigger as-child>
          <UiDropdownMenuItem @click.stop="handleSelect('delete')">
            Delete
            <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
        </UiDialogTrigger>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <UiDialogContent>
      <component :is="showComponent" :user="user" @close="isOpen = false" />
    </UiDialogContent>
  </UiDialog>
</template>
