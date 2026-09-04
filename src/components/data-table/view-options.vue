<script setup lang="ts" generic="T extends RowData">
import type { RowData } from '@tanstack/vue-table'

import { RefreshCcwIcon, Settings2Icon } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { DataTableInstance } from './table'

interface DataTableViewOptionsProps {
  table: DataTableInstance<T>
}

const props = defineProps<DataTableViewOptionsProps>()

const columns = computed(() => props.table.getAllColumns()
  .filter(
    column =>
      typeof column.accessorFn !== 'undefined' && column.getCanHide(),
  ))

function resetColumnVisible() {
  columns.value.forEach(column => column.toggleVisibility(true))
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="hidden h-8 ml-auto lg:flex"
      >
        <Settings2Icon class="size-4 mr-2" />
        Columns View
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[150px]">
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        class="capitalize"
        :model-value="column.getIsVisible()"
        @update:model-value="(value:boolean) => column.toggleVisibility(!!value)"
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="capitalize"
        @click="resetColumnVisible"
      >
        <RefreshCcwIcon />
        Reset
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
