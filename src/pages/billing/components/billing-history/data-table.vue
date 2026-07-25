<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'

import { DataTable, useGenerateVueTable } from '@/components/data-table'

import type { Billing } from './data/schema'

import DataTableToolbar from './data-table-toolbar.vue'

interface DataTableProps {
  columns: ColumnDef<Billing, any>[]
  data: Billing[]
}

const props = defineProps<DataTableProps>()
const table = useGenerateVueTable<Billing>(props)
</script>

<template>
  <DataTable :columns :data :table>
    <template #toolbar>
      <DataTableToolbar />
    </template>
  </DataTable>
</template>
