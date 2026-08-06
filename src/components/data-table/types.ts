import type { ColumnDef, RowData } from '@tanstack/vue-table'

import type { features } from './features'

export interface FacetedFilterOption {
  label: string
  value: string
  icon?: Component
}

export interface ServerPagination {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export interface DataTableProps<T extends RowData> {
  loading?: boolean
  columns: ColumnDef<typeof features, T, any>[]
  data: T[]
  serverPagination?: ServerPagination
}
