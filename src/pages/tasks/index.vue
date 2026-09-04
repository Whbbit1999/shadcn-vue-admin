<script setup lang="ts">
import { Trash2Icon } from '@lucide/vue'

import type { DataTableToolbarFilter } from '@/components/data-table'

import { DataTable, DataTableBulkActions, DataTableToolbar } from '@/components/data-table'
import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { columns } from './components/columns'
import TaskCreate from './components/task-create.vue'
import TaskDeleteBatch from './components/task-delete-batch.vue'
import TaskImport from './components/task-import.vue'
import { priorities, statuses } from './data/data'
import tasks from './data/tasks.json'

const taskDeleteBatchOpen = shallowRef(false)

const filters = [
  { column: 'status', title: 'Status', options: statuses },
  { column: 'priority', title: 'Priority', options: priorities },
] satisfies DataTableToolbarFilter[]
</script>

<template>
  <BasicPage
    title="Tasks"
    description="Tasks description"
    sticky
  >
    <template #actions>
      <TaskImport />
      <TaskCreate />
    </template>
    <DataTable :data="tasks" :columns="columns">
      <template #toolbar="{ table }">
        <DataTableToolbar
          :table="table"
          :filters="filters"
          search-column="title"
          search-placeholder="Filter tasks..."
        />
      </template>

      <template #bulk-actions="{ table }">
        <DataTableBulkActions entity-name="task" :table="table">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="destructive"
                size="icon"
                class="size-8"
                aria-label="Delete selected tasks"
                title="Delete selected tasks"
                @click="taskDeleteBatchOpen = true"
              >
                <Trash2Icon />
                <span class="sr-only">Delete selected tasks</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected tasks</p>
            </TooltipContent>
          </Tooltip>

          <TaskDeleteBatch
            v-model:open="taskDeleteBatchOpen"
            :table="table"
          />
        </DataTableBulkActions>
      </template>
    </DataTable>
  </BasicPage>
</template>
