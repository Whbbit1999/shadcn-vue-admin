<script setup lang="ts">
import { Trash2Icon } from 'lucide-vue-next'

import type { DataTableProps } from '@/components/data-table/types'

import BulkActions from '@/components/data-table/bulk-actions.vue'
import DataTable from '@/components/data-table/data-table.vue'
import { generateVueTable } from '@/components/data-table/use-generate-vue-table'

import type { Task } from '../data/schema'

import DataTableToolbar from './data-table-toolbar.vue'
import TaskDeleteBatch from './task-delete-batch.vue'

const props = defineProps<DataTableProps<Task>>()
const table = generateVueTable<Task>(props)

const taskDeleteBatchOpen = ref(false)
</script>

<template>
  <BulkActions entity-name="task" :table>
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
  </BulkActions>

  <DataTable :columns :table :data :loading>
    <template #toolbar>
      <DataTableToolbar :table="table" class="w-full overflow-x-auto" />
    </template>
  </DataTable>
</template>
