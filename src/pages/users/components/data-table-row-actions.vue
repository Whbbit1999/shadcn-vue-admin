<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Component } from 'vue'

import { EllipsisIcon } from '@lucide/vue'

import type { features } from '@/components/data-table/features'

import { Modal, ModalContent } from '@/components/prop-ui/modal'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { User } from '../data/schema'

import UserResource from './user-resource.vue'

interface DataTableRowActionsProps {
  row: Row<typeof features, User>
}
const props = defineProps<DataTableRowActionsProps>()
const user = computed(() => props.row.original)
const isOpen = shallowRef(false)

const showComponent = shallowRef<Component | null>(null)
type TCommand = 'edit' | 'delete'

async function loadComponent(command: TCommand): Promise<Component> {
  if (command === 'edit')
    return UserResource

  const { default: component } = await import('./user-delete.vue')
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
        <DropdownMenuItem @click.stop="handleSelect('edit')">
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem @click.stop="handleSelect('delete')">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <ModalContent>
      <component :is="showComponent" :user="user" @close="isOpen = false" />
    </ModalContent>
  </Modal>
</template>
