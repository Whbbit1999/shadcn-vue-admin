import type { RowData } from '@tanstack/vue-table'

import { h } from 'vue'

import { Checkbox } from '@/components/ui/checkbox'

import type { DataTableColumnDef } from './table'

import RadioCell from './radio-cell.vue'

const FIXED_WIDTH_COLUMN = {
  size: 32,
  minSize: 32,
  maxSize: 32,
  enableResizing: false,
} as const

export function createSelectColumn<T extends RowData>(): DataTableColumnDef<T> {
  return {
    id: 'select',
    ...FIXED_WIDTH_COLUMN,
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  }
}

export function createRadioSelectColumn<T extends RowData>(): DataTableColumnDef<T> {
  return {
    id: 'radio-select',
    ...FIXED_WIDTH_COLUMN,
    header: () => null,
    cell: ({ row, table }) => h(RadioCell, {
      checked: row.getIsSelected(),
      onClick: (event: MouseEvent) => {
        event.stopPropagation()
        table.toggleAllRowsSelected(false)
        row.toggleSelected(true)
      },
    }),
    enableSorting: false,
    enableHiding: false,
  }
}
