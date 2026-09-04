<script setup lang="ts" generic="T extends RowData">
import type { RowData } from '@tanstack/vue-table'

import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PAGE_SIZES } from '@/constants/app'

import type { DataTableInstance } from './table'

interface DataTablePaginationProps {
  table: DataTableInstance<T>
}
const props = defineProps<DataTablePaginationProps>()

const currentPage = computed(() => props.table.atoms.pagination.get().pageIndex + 1)
const currentPageSize = computed(() => props.table.atoms.pagination.get().pageSize)
const totalPages = computed(() => props.table.getPageCount())
const canPreviousPage = computed(() => props.table.getCanPreviousPage())
const canNextPage = computed(() => props.table.getCanNextPage())

function handlePageSizeChange(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number')
    return

  const newPageSize = Number(value)
  if (Number.isFinite(newPageSize) && newPageSize > 0)
    props.table.setPageSize(newPageSize)
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
        <Select
          :model-value="`${currentPageSize}`"
          @update:model-value="handlePageSizeChange"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${currentPageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in PAGE_SIZES" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!canPreviousPage"
          @click="table.firstPage()"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeftIcon class="size-4" />
        </Button>
        <Button
          variant="outline"
          class="size-8 p-0"
          :disabled="!canPreviousPage"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeftIcon class="size-4" />
        </Button>
        <Button
          variant="outline"
          class="size-8 p-0"
          :disabled="!canNextPage"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRightIcon class="size-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!canNextPage"
          @click="table.lastPage()"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRightIcon class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
