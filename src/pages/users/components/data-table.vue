<script setup lang="ts">
import type { DataTableProps } from '@/components/data-table'

import { DataTable, useGenerateVueTable } from '@/components/data-table'

import type { User } from '../data/schema'

import DataTableToolbar from './data-table-toolbar.vue'

const props = defineProps<DataTableProps<User>>()

const table = useGenerateVueTable<User>(props)
</script>

<template>
  <DataTable :columns :data :loading :table>
    <template #toolbar>
      <DataTableToolbar :table class="w-full overflow-x-auto" />
    </template>
  </DataTable>
</template>
