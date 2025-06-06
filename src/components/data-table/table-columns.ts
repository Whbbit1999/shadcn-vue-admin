import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'

import Checkbox from '@/components/ui/checkbox/Checkbox.vue'

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
