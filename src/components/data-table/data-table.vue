<script setup lang="ts" generic="T">
import type {
  ColumnDef,
  Table as VueTable,
} from '@tanstack/vue-table'

import {
  FlexRender,
} from '@tanstack/vue-table'

import DataTableLoading from '@/components/data-table/table-loading.vue'
import DataTablePagination from '@/components/data-table/table-pagination.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps {
  loading?: boolean
  columns: ColumnDef<T, any>[]
  data: T[]
  table: VueTable<T>
}
defineProps<DataTableProps>()
</script>

<template>
  <div class="space-y-4">
    <DataTableToolbar :table="table" class="w-full overflow-x-auto" />
    <slot name="toolbar" />

    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-if="!loading">
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DataTableLoading v-if="loading" />
    </div>

    <DataTablePagination :table="table" />
  </div>
</template>
