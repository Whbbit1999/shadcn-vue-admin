<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { Ellipsis, FilePenLine, Trash2 } from 'lucide-vue-next'

import { useModal } from '@/composables/use-modal'

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

type TCommand = 'edit' | 'create' | 'delete'
function handleSelect(command: TCommand) {
  switch (command) {
    case 'edit':
      showComponent.value = defineAsyncComponent(() => import('./task-resource-dialog.vue'))
      break
    case 'create':
      showComponent.value = defineAsyncComponent(() => import('./task-resource-dialog.vue'))
      break
    case 'delete':
      showComponent.value = defineAsyncComponent(() => import('./task-delete.vue'))
      break
  }
}

const isOpen = ref(false)
const { Modal, contentClass } = useModal()
</script>

<template>
  <component :is="Modal.Root" v-model:open="isOpen">
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
        <component :is="Modal.Trigger" as-child>
          <UiDropdownMenuItem @select.stop="handleSelect('edit')">
            <span>Edit</span>
            <UiDropdownMenuShortcut> <FilePenLine class="size-4" /> </UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
        </component>

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

        <component :is="Modal.Trigger" as-child>
          <UiDropdownMenuItem @select.stop="handleSelect('delete')">
            <span>Delete</span>
            <UiDropdownMenuShortcut> <Trash2 class="size-4" /> </UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
        </component>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <component :is="Modal.Content" :class="contentClass">
      <component :is="showComponent" :task="task" @close="isOpen = false" />
    </component>
  </component>
</template>
