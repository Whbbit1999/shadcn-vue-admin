import type { ColumnFiltersState, SortingState, TableOptionsWithReactiveData, VisibilityState } from '@tanstack/vue-table'

import { getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'

import { valueUpdater } from '@/lib/utils'

import type { DataTableProps } from './types'

export function generateVueTable<T>(props: DataTableProps<T>) {
  const sorting = ref<SortingState>([])
  const columnFilters = ref<ColumnFiltersState>([])
  const columnVisibility = ref<VisibilityState>({})
  const rowSelection = ref({})

  const useServerPagination = !!props.serverPagination

  const pageIndex = computed(() => {
    if (useServerPagination && props.serverPagination) {
      return props.serverPagination.page - 1
    }
    return 0
  })

  const pageSize = computed(() => {
    if (useServerPagination && props.serverPagination) {
      return props.serverPagination.pageSize
    }
    return 10
  })

  const pageCount = computed(() => {
    if (useServerPagination && props.serverPagination) {
      return Math.ceil(props.serverPagination.total / props.serverPagination.pageSize)
    }
    return -1
  })

  const tableConfig: TableOptionsWithReactiveData<T> = {
    get data() { return props.data },
    get columns() { return props.columns },
    state: {
      get sorting() { return sorting.value },
      get columnFilters() { return columnFilters.value },
      get columnVisibility() { return columnVisibility.value },
      get rowSelection() { return rowSelection.value },
    },
    enableRowSelection: true,
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  }

  if (useServerPagination) {
    tableConfig.state!.pagination = {
      get pageIndex() { return pageIndex.value },
      get pageSize() { return pageSize.value },
    }
    tableConfig.pageCount = pageCount.value
    tableConfig.manualPagination = true
  }
  else {
    tableConfig.getPaginationRowModel = getPaginationRowModel()
  }

  const table = useVueTable<T>(tableConfig)

  return table
}
