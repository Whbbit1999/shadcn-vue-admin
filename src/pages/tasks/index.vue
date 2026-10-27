<script setup lang="ts">
import { FolderOpenIcon, Trash2Icon } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

import type { DataTableToolbarFilter } from '@/components/data-table'

import { DataTable, DataTableBulkActions, DataTableToolbar } from '@/components/data-table'
import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'
import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { createColumns } from './components/columns'
import TaskCreate from './components/task-create.vue'
import TaskDeleteBatch from './components/task-delete-batch.vue'
import TaskImport from './components/task-import.vue'
import { priorities, statuses } from './data/data'
import tasks from './data/tasks.json'

const { t } = useI18n()

const taskDeleteBatchOpen = shallowRef(false)

const columns = computed(() => createColumns(t))

const filters = computed<DataTableToolbarFilter[]>(() => [
  {
    column: 'status',
    title: t('tasks.filters.status'),
    options: statuses.map(({ labelKey, ...option }) => ({ ...option, label: t(labelKey) })),
  },
  {
    column: 'priority',
    title: t('tasks.filters.priority'),
    options: priorities.map(({ labelKey, ...option }) => ({ ...option, label: t(labelKey) })),
  },
])
</script>

<template>
  <BasicPage
    :title="$t('tasks.title')"
    :description="$t('tasks.description')"
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
          :search-placeholder="$t('tasks.table.searchPlaceholder')"
        />
      </template>

      <template #empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpenIcon />
          </EmptyMedia>
          <EmptyTitle>{{ $t('tasks.empty.title') }}</EmptyTitle>
          <EmptyDescription>
            {{ $t('tasks.empty.description') }}
          </EmptyDescription>
        </EmptyHeader>
      </template>

      <template #bulk-actions="{ table }">
        <DataTableBulkActions :entity-name="$t('tasks.bulk.entityName')" :table="table">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="destructive"
                size="icon"
                class="size-8"
                :aria-label="$t('tasks.actions.deleteSelected')"
                :title="$t('tasks.actions.deleteSelected')"
                @click="taskDeleteBatchOpen = true"
              >
                <Trash2Icon />
                <span class="sr-only">{{ $t('tasks.actions.deleteSelected') }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ $t('tasks.actions.deleteSelected') }}</p>
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
