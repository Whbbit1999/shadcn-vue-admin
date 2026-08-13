<script setup lang="ts" generic="T extends RowData">
import type { Column, RowData, Table as VueTable } from '@tanstack/vue-table'
import type { CSSProperties } from 'vue'

import { FolderOpenIcon } from '@lucide/vue'
import { FlexRender } from '@tanstack/vue-table'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { features } from './features'
import type { DataTableProps } from './types'

import DataTableLoading from './table-loading.vue'
import DataTablePagination from './table-pagination.vue'

defineProps<DataTableProps<T> & {
  table: VueTable<typeof features, T>
}>()

function getCommonPinningStyles(column: Column<typeof features, T>): CSSProperties {
  const isPinned = column.getIsPinned()
  return {
    left: isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    right: isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
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
              <FlexRender v-if="!header.isPlaceholder" :header="header" />
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
                <FlexRender :cell="cell" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderOpenIcon />
                  </EmptyMedia>
                  <EmptyTitle>No result found.</EmptyTitle>
                  <EmptyDescription>
                    Please try a different search term or check the spelling.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DataTableLoading v-if="loading" />
    </div>

    <DataTablePagination v-if="!loading" :table="table" :server-pagination="serverPagination" />
  </div>
</template>
