<script setup lang="ts">
import { Trash2Icon } from '@lucide/vue'

import type { DataTableProps } from '@/components/data-table'

import { DataTable, DataTableBulkActions, useGenerateVueTable } from '@/components/data-table'

import type { Task } from '../data/schema'

import DataTableToolbar from './data-table-toolbar.vue'
import TaskDeleteBatch from './task-delete-batch.vue'

const props = defineProps<DataTableProps<Task>>()
const table = useGenerateVueTable<Task>(props)

const taskDeleteBatchOpen = ref(false)
</script>

<template>
  <DataTableBulkActions entity-name="task" :table="table">
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <UiButton
          variant="destructive"
          size="icon"
          class="size-8"
          aria-label="Delete selected tasks"
          title="Delete selected tasks"
          @click="taskDeleteBatchOpen = true"
        >
          <Trash2Icon />
          <span class="sr-only">Delete selected tasks</span>
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent>
        <p>Delete selected tasks</p>
      </UiTooltipContent>
    </UiTooltip>

    <TaskDeleteBatch
      v-model:open="taskDeleteBatchOpen"
      :table
    />
  </DataTableBulkActions>

  <DataTable :columns :table :data :loading>
    <template #toolbar>
      <DataTableToolbar :table="table" class="w-full overflow-x-auto" />
    </template>
  </DataTable>
</template>
