<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'

import { X } from 'lucide-vue-next'
import { computed } from 'vue'

import DataTableFacetedFilter from '@/components/data-table/faceted-filter.vue'
import DataTableViewOptions from '@/components/data-table/view-options.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import type { User } from '../data/schema'

import { callTypes, userTypes } from '../data/data'

interface DataTableToolbarProps {
  table: Table<User>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center flex-1 space-x-2">
      <Input
        placeholder="Filter tasks..."
        :model-value="(table.getColumn('username')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('username')?.setFilterValue($event.target.value)"
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('role')"
        :column="table.getColumn('role')"
        title="Role"
        :options="callTypes"
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('role')"
        :column="table.getColumn('role')"
        title="Role"
        :options="userTypes"
      />

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <X class="size-4 ml-2" />
      </Button>
    </div>
    <DataTableViewOptions :table="table" />
  </div>
</template>
