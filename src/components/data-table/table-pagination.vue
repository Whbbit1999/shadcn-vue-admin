<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/vue-table'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-vue-next'

interface DataTablePaginationProps {
  table: Table<T>
}
defineProps<DataTablePaginationProps>()
</script>

<template>
  <div class="flex items-center justify-between px-2 py-2 bg-background">
    <div class="flex-1" />
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="hidden text-sm font-medium line-clamp-1 md:block">
          Rows per page
        </p>
        <UiSelect
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="Number(table.setPageSize)"
        >
          <UiSelectTrigger class="h-8 w-[70px]">
            <UiSelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </UiSelectTrigger>
          <UiSelectContent side="top">
            <UiSelectItem v-for="pageSize in [10, 20, 30, 40, 50]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <UiButton
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft class="size-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="size-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeftIcon class="size-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="size-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRightIcon class="size-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight class="size-4" />
        </UiButton>
      </div>
    </div>
  </div>
</template>
