import type { ColumnDef } from '@tanstack/vue-table'

import DataTableColumnHeader from '@/components/data-table/column-header.vue'
import { Badge } from '@/components/ui/badge'

import type { Billing } from './data/schema'

import DataTableRowActions from './data-table-row-actions.vue'
import { statuses } from './data/data'

export const columns: ColumnDef<Billing>[] = [

  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader<Billing>, { column, title: 'ID' }),
    cell: ({ row }) => h('div', { }, row.getValue('id')),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => h(DataTableColumnHeader<Billing>, { column, title: 'amount' }),
    cell: ({ row }) => h('div', { }, row.getValue('amount')),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => h(DataTableColumnHeader<Billing>, { column, title: 'billing date' }),
    cell: ({ row }) => h('div', { }, row.getValue('date')),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'plan',
    header: ({ column }) => h(DataTableColumnHeader<Billing>, { column, title: 'billing plan' }),
    cell: ({ row }) => h('div', { }, row.getValue('plan')),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader<Billing>, { column, title: 'status' }),
    cell: ({ row }) => {
      const status = statuses.find(status => status.value === row.getValue('status'))
      if (!status)
        return h('div', { }, row.getValue('status'))

      const style = {
        color: status.color,
      }

      return h(Badge, {
        class: 'flex max-w-[100px] items-center',
        style,
        variant: 'secondary',
      }, () => [
        status.icon && h(status.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground', style }),
        h('span', status.label),
      ])
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'orderId',
    header: ({ column }) => h(DataTableColumnHeader<Billing>, { column, title: 'Order ID' }),
    cell: ({ row }) => h('div', { }, row.getValue('orderId') || 'N/A'),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
