<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { EllipsisIcon, FilePenLineIcon, Trash2Icon } from '@lucide/vue'

import { Modal, ModalContent } from '@/components/prop-ui/modal'

import type { Task } from '../data/schema'

import { labels } from '../data/data'
import { taskSchema } from '../data/schema'
import TaskResourceDialog from './task-resource-dialog.vue'

const props = defineProps<DataTableRowActionsProps>()

interface DataTableRowActionsProps {
  row: Row<Task>
}
const task = computed(() => taskSchema.parse(props.row.original))

const taskLabel = shallowRef(task.value.label)

const isOpen = shallowRef(false)
const showComponent = shallowRef<Component | null>(null)

type TCommand = 'edit' | 'delete'

async function loadComponent(command: TCommand): Promise<Component> {
  if (command === 'edit')
    return TaskResourceDialog

  const { default: component } = await import('./task-delete.vue')
  return component
}

async function handleSelect(command: TCommand) {
  try {
    showComponent.value = await loadComponent(command)
    isOpen.value = true
  }
  catch (e) {
    console.error(`Failed to load component for "${command}"`, e)
  }
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
          <EllipsisIcon class="size-4" />
          <span class="sr-only">Open menu</span>
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent align="end" class="w-[160px]">
        <UiDropdownMenuItem @select.stop="handleSelect('edit')">
          <span>Edit</span>
          <UiDropdownMenuShortcut> <FilePenLineIcon class="size-4" /> </UiDropdownMenuShortcut>
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
          <UiDropdownMenuShortcut> <Trash2Icon class="size-4" /> </UiDropdownMenuShortcut>
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <ModalContent>
      <component :is="showComponent" :task="task" @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
