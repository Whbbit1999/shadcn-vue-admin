<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/vue-table'

import { RefreshCcw, Settings2 } from 'lucide-vue-next'

interface DataTableViewOptionsProps {
  table: Table<T>
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
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton
        variant="outline"
        size="sm"
        class="hidden h-8 ml-auto lg:flex"
      >
        <Settings2 class="size-4 mr-2" />
        Columns View
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end" class="w-[150px]">
      <UiDropdownMenuLabel>Toggle columns</UiDropdownMenuLabel>
      <UiDropdownMenuSeparator />

      <UiDropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        class="capitalize"
        :model-value="column.getIsVisible()"
        @update:model-value="(value:boolean) => column.toggleVisibility(!!value)"
      >
        {{ column.id }}
      </UiDropdownMenuCheckboxItem>

      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem
        class="capitalize"
        @click="resetColumnVisible"
      >
        <RefreshCcw />
        Reset
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
