import type { Column, ColumnDef, OnChangeFn, PaginationState, Row, RowData, Table } from '@tanstack/vue-table'
import type { Component } from 'vue'

import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_arrHas,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/vue-table'

import { DEFAULT_PAGE_SIZE } from '@/constants/app'

export interface FacetedFilterOption<T extends string = string> {
  label: string
  value: T
  icon?: Component
}

export interface DataTableToolbarFilter {
  column: string
  title: string
  options: FacetedFilterOption[]
}

export interface DataTableServerPagination {
  state: PaginationState
  rowCount: number
  onChange: OnChangeFn<PaginationState>
}

export const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    arrHas: filterFn_arrHas,
    includesString: filterFn_includesString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
})

const dataTableHook = createTableHook({
  features: dataTableFeatures,
  enableRowSelection: true,
})

export function useDataTable<T extends RowData>(
  options: Parameters<typeof dataTableHook.useAppTable<T>>[0],
) {
  return dataTableHook.useAppTable<T>({
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    },
    ...options,
  })
}

export type DataTableColumn<T extends RowData, TValue = any> = Column<typeof dataTableFeatures, T, TValue>
export type DataTableColumnDef<T extends RowData, TValue = any> = ColumnDef<typeof dataTableFeatures, T, TValue>
export type DataTableInstance<T extends RowData> = Table<typeof dataTableFeatures, T>
export type DataTableRow<T extends RowData> = Row<typeof dataTableFeatures, T>

export interface DataTableProps<T extends RowData> {
  columns: DataTableColumnDef<T>[]
  data: readonly T[]
  loading?: boolean
  serverPagination?: DataTableServerPagination
}
