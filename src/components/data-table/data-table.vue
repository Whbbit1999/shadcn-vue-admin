<script setup lang="ts" generic="T">
import type { Column, Table as VueTable } from '@tanstack/vue-table'
import type { CSSProperties } from 'vue'

import { FlexRender } from '@tanstack/vue-table'

import DataTableLoading from '@/components/data-table/table-loading.vue'
import DataTablePagination from '@/components/data-table/table-pagination.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { DataTableProps } from './types'

import NoResultFound from '../no-result-found.vue'

defineProps<DataTableProps<T> & {
  table: VueTable<T>
}>()

function getCommonPinningStyles(column: Column<T>): CSSProperties {
  const isPinned = column.getIsPinned()
  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: `${column.getSize()}px`,
    zIndex: isPinned ? 1 : 0,
  }
}
</script>

<template>
  <div class="space-y-4">
    <slot name="toolbar" />

    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :style="getCommonPinningStyles(header.column)"
              :class="{ 'bg-background': header.column.getIsPinned() }"
            >
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
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :style="getCommonPinningStyles(cell.column)"
                :class="{ 'bg-background': cell.column.getIsPinned() }"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              <NoResultFound />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DataTableLoading v-if="loading" />
    </div>

    <DataTablePagination v-if="!loading" :table="table" :server-pagination="serverPagination" />
  </div>
</template>
