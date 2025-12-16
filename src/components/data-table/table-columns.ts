import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'

import Checkbox from '@/components/ui/checkbox/Checkbox.vue'

import RadioCell from './radio-cell.vue'

export const SelectColumn: ColumnDef<any> = {
  id: 'select',
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

export const RadioSelectColumn: ColumnDef<any> = {
  id: 'radio-select',
  header: () => null,
  cell: ({ row, table }) => h(RadioCell, {
    checked: row.getIsSelected(),
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      // cancel selection of all rows
      table.toggleAllRowsSelected(false)
      // select the current row
      row.toggleSelected(true)
    },
  }),
  enableSorting: false,
  enableHiding: false,
}
