import { h } from 'vue'

import type { DataTableColumnDef } from '@/components/data-table'

import { createSelectColumn, DataTableColumnHeader } from '@/components/data-table'
import { Copy } from '@/components/prop-ui/copy'
import Badge from '@/components/ui/badge/Badge.vue'

import type { User } from '../data/schema'

import { callTypes, userTypes } from '../data/data'
import DataTableRowActions from './data-table-row-actions.vue'

export const columns: DataTableColumnDef<User>[] = [
  createSelectColumn<User>(),
  {
    accessorKey: 'username',
    header: ({ column }) => h(DataTableColumnHeader<User>, { column, title: 'username' }),
    cell: ({ row }) => h('div', { }, row.getValue('username')),
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
  },

  {
    accessorKey: 'email',
    header: ({ column }) => h(DataTableColumnHeader<User>, { column, title: 'Email' }),
    cell: ({ row }) => h('div', { }, [
      h('span', {}, row.getValue('email')),
      h(Copy, { class: 'ml-2', size: 'icon-xs', content: (row.getValue('email') || '') as string }),
    ]),
    enableSorting: false,
    enableResizing: true,
  },

  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => h(DataTableColumnHeader<User>, { column, title: 'PhoneNumber' }),
    cell: ({ row }) => h('div', { }, row.getValue('phoneNumber')),
    enableSorting: false,
    enableResizing: true,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader<User>, { column, title: 'Status' }),

    cell: ({ row }) => {
      const callType = callTypes.find(callType => callType.value === row.getValue('status'))

      if (!callType)
        return null

      return h(Badge, { class: `${callType.style || ''}`, variant: 'outline' }, () => callType.label)
    },
    filterFn: 'arrHas',
    enableResizing: true,
  },

  {
    accessorKey: 'role',
    header: ({ column }) => h(DataTableColumnHeader<User>, { column, title: 'Role' }),
    cell: ({ row }) => {
      const priority = userTypes.find(
        priority => priority.value === row.getValue('role'),
      )

      if (!priority)
        return null

      return h('div', { class: 'flex items-center' }, [
        priority.icon && h(priority.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground' }),
        h('span', {}, priority.label),
      ])
    },
    enableSorting: false,
    enableResizing: true,
    filterFn: 'arrHas',
  },

  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
