<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { Ellipsis, FilePenLine, Trash2 } from 'lucide-vue-next'

import { Modal, ModalContent } from '@/components/prop-ui/modal'

import type { Task } from '../data/schema'

import { labels } from '../data/data'
import { taskSchema } from '../data/schema'

const props = defineProps<DataTableRowActionsProps>()

interface DataTableRowActionsProps {
  row: Row<Task>
}
const task = computed(() => taskSchema.parse(props.row.original))

const taskLabel = ref(task.value.label)

const showComponent = shallowRef<Component | null>(null)
const isOpen = ref(false)

type TCommand = 'edit' | 'create' | 'delete'

const componentLoader: Record<TCommand, () => Promise<{ default: Component }>> = {
  edit: () => import('./task-resource-dialog.vue'),
  create: () => import('./task-resource-dialog.vue'),
  delete: () => import('./task-delete.vue'),
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
        <UiDropdownMenuItem @select.stop="handleSelect('edit')">
          <span>Edit</span>
          <UiDropdownMenuShortcut> <FilePenLine class="size-4" /> </UiDropdownMenuShortcut>
        </UiDropdownMenuItem>

        <UiDropdownMenuItem disabled>
          Make a copy
        </UiDropdownMenuItem>
        <UiDropdownMenuItem disabled>
          Favorite
        </UiDropdownMenuItem>

        <UiDropdownMenuSeparator />

        <UiDropdownMenuSub>
          <UiDropdownMenuSubTrigger>Labels</UiDropdownMenuSubTrigger>
          <UiDropdownMenuSubContent>
            <UiDropdownMenuRadioGroup v-model="taskLabel">
              <UiDropdownMenuRadioItem v-for="label in labels" :key="label.value" :value="label.value">
                {{ label.label }}
              </UiDropdownMenuRadioItem>
            </UiDropdownMenuRadioGroup>
          </UiDropdownMenuSubContent>
        </UiDropdownMenuSub>

        <UiDropdownMenuSeparator />

        <UiDropdownMenuItem @select.stop="handleSelect('delete')">
          <span>Delete</span>
          <UiDropdownMenuShortcut> <Trash2 class="size-4" /> </UiDropdownMenuShortcut>
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <ModalContent>
      <component :is="showComponent" :task="task" @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
