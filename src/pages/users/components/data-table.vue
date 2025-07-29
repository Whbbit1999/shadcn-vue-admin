<script setup lang="ts">
import type { DataTableProps } from '@/components/data-table/types'

import DataTable from '@/components/data-table/data-table.vue'
import { generateVueTable } from '@/components/data-table/use-generate-vue-table'

import type { User } from '../data/schema'

import DataTableToolbar from './data-table-toolbar.vue'

const props = defineProps<DataTableProps<User>>()

const table = generateVueTable<User>(props)
</script>

<template>
  <DataTable :columns :data :loading :table>
    <template #toolbar>
      <DataTableToolbar :table class="w-full overflow-x-auto" />
    </template>
  </DataTable>
</template>
