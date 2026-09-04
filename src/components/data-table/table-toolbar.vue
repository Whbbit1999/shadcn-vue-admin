<script setup lang="ts" generic="T extends RowData">
import type { RowData } from '@tanstack/vue-table'

import { XIcon } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import type { DataTableInstance, DataTableToolbarFilter } from './table'

import DataTableFacetedFilter from './faceted-filter.vue'
import DataTableViewOptions from './view-options.vue'

interface DataTableToolbarProps<T extends RowData> {
  filters?: DataTableToolbarFilter[]
  searchColumn: string
  searchPlaceholder: string
  table: DataTableInstance<T>
}

const props = withDefaults(defineProps<DataTableToolbarProps<T>>(), {
  filters: () => [],
})

const isFiltered = computed(() => props.table.atoms.columnFilters.get().length > 0)
const searchColumn = computed(() => props.table.getColumn(props.searchColumn))

function handleSearchInput(event: Event) {
  searchColumn.value?.setFilterValue((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 flex-col items-start gap-2 md:flex-row md:items-center">
      <Input
        v-if="searchColumn"
        :model-value="(searchColumn.getFilterValue() as string) ?? ''"
        :placeholder="searchPlaceholder"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="handleSearchInput"
      />

      <div v-if="filters.length" class="flex gap-2">
        <template v-for="filter in filters" :key="filter.column">
          <DataTableFacetedFilter
            v-if="table.getColumn(filter.column)"
            :column="table.getColumn(filter.column)"
            :options="filter.options"
            :title="filter.title"
          />
        </template>
      </div>

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <XIcon class="size-4" />
      </Button>
    </div>

    <DataTableViewOptions :table="table" />
  </div>
</template>
