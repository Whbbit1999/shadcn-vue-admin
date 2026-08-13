<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { EllipsisIcon, FilePenLineIcon, Trash2Icon } from '@lucide/vue'

import type { features } from '@/components/data-table/features'

import { Modal, ModalContent } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { Task } from '../data/schema'

import { labels } from '../data/data'
import { taskSchema } from '../data/schema'
import TaskResourceDialog from './task-resource-dialog.vue'

const props = defineProps<DataTableRowActionsProps>()

interface DataTableRowActionsProps {
  row: Row<typeof features, Task>
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
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <EllipsisIcon class="size-4" />
          <span class="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-[160px]">
        <DropdownMenuItem @select.stop="handleSelect('edit')">
          <span>Edit</span>
          <DropdownMenuShortcut> <FilePenLineIcon class="size-4" /> </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          Make a copy
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Favorite
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup v-model="taskLabel">
              <DropdownMenuRadioItem v-for="label in labels" :key="label.value" :value="label.value">
                {{ label.label }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem @select.stop="handleSelect('delete')">
          <span>Delete</span>
          <DropdownMenuShortcut> <Trash2Icon class="size-4" /> </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <ModalContent>
      <component :is="showComponent" :task="task" @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
