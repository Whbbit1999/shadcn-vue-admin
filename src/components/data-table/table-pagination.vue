<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/vue-table'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-vue-next'

import { PAGE_SIZES } from '@/constants/pagination'

import type { ServerPagination } from './types'

interface DataTablePaginationProps {
  table: Table<T>
  serverPagination?: ServerPagination
}
const props = defineProps<DataTablePaginationProps>()

const isServerPagination = computed(() => !!props.serverPagination)

const currentPage = computed(() => {
  if (isServerPagination.value && props.serverPagination) {
    return props.serverPagination.page
  }
  return props.table.getState().pagination.pageIndex + 1
})

const currentPageSize = computed(() => {
  if (isServerPagination.value && props.serverPagination) {
    return props.serverPagination.pageSize
  }
  return props.table.getState().pagination.pageSize
})

const totalPages = computed(() => {
  if (isServerPagination.value && props.serverPagination) {
    return Math.ceil(props.serverPagination.total / props.serverPagination.pageSize)
  }
  return props.table.getPageCount()
})

const canPreviousPage = computed(() => {
  if (isServerPagination.value) {
    return currentPage.value > 1
  }
  return props.table.getCanPreviousPage()
})

const canNextPage = computed(() => {
  if (isServerPagination.value) {
    return currentPage.value < totalPages.value
  }
  return props.table.getCanNextPage()
})

function handlePageSizeChange(value: any) {
  if (!value)
    return
  const newPageSize = Number(value)
  if (isServerPagination.value && props.serverPagination?.onPageSizeChange) {
    props.serverPagination.onPageSizeChange(newPageSize)
  }
  else {
    props.table.setPageSize(newPageSize)
  }
}

function goToFirstPage() {
  if (isServerPagination.value && props.serverPagination?.onPageChange) {
    props.serverPagination.onPageChange(1)
  }
  else {
    props.table.setPageIndex(0)
  }
}

function goToPreviousPage() {
  if (isServerPagination.value && props.serverPagination?.onPageChange) {
    props.serverPagination.onPageChange(currentPage.value - 1)
  }
  else {
    props.table.previousPage()
  }
}

function goToNextPage() {
  if (isServerPagination.value && props.serverPagination?.onPageChange) {
    props.serverPagination.onPageChange(currentPage.value + 1)
  }
  else {
    props.table.nextPage()
  }
}

function goToLastPage() {
  if (isServerPagination.value && props.serverPagination?.onPageChange) {
    props.serverPagination.onPageChange(totalPages.value)
  }
  else {
    props.table.setPageIndex(props.table.getPageCount() - 1)
  }
}
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
          :model-value="`${currentPageSize}`"
          @update:model-value="handlePageSizeChange"
        >
          <UiSelectTrigger class="h-8 w-[70px]">
            <UiSelectValue :placeholder="`${currentPageSize}`" />
          </UiSelectTrigger>
          <UiSelectContent side="top">
            <UiSelectItem v-for="pageSize in PAGE_SIZES" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div class="flex items-center space-x-2">
        <UiButton
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!canPreviousPage"
          @click="goToFirstPage"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft class="size-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="size-8 p-0"
          :disabled="!canPreviousPage"
          @click="goToPreviousPage"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeftIcon class="size-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="size-8 p-0"
          :disabled="!canNextPage"
          @click="goToNextPage"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRightIcon class="size-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!canNextPage"
          @click="goToLastPage"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight class="size-4" />
        </UiButton>
      </div>
    </div>
  </div>
</template>
