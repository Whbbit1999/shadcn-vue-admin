<script setup lang="ts">
import type { DataTableProps } from '@/components/data-table/types'

import DataTable from '@/components/data-table/data-table.vue'
import { generateVueTable } from '@/components/data-table/use-generate-vue-table'

import type { Task } from '../data/schema'

import DataTableToolbar from './data-table-toolbar.vue'

const props = defineProps<DataTableProps<Task>>()
const table = generateVueTable<Task>(props)
</script>

<template>
  <DataTable :columns :table :data :loading>
    <template #toolbar>
      <DataTableToolbar :table="table" class="w-full overflow-x-auto" />
    </template>
  </DataTable>
</template>
