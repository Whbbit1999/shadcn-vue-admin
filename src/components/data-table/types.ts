import type { ColumnDef } from '@tanstack/vue-table'

export interface FacetedFilterOption {
  label: string
  value: string
  icon?: Component
}

export interface DataTableProps<T> {
  loading?: boolean
  columns: ColumnDef<T, any>[]
  data: T[]
}
