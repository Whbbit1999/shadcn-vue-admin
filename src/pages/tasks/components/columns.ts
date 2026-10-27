import type { ComposerTranslation } from 'vue-i18n'

import { h } from 'vue'

import type { DataTableColumnDef } from '@/components/data-table'

import { createSelectColumn, DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'

import type { Task } from '../data/schema'

import { labels, priorities, statuses } from '../data/data'
import DataTableRowActions from './data-table-row-actions.vue'

export function createColumns(t: ComposerTranslation): DataTableColumnDef<Task>[] {
  return [
    createSelectColumn<Task>(),
    {
      accessorKey: 'id',
      header: ({ column }) => h(DataTableColumnHeader<Task>, { column, title: t('tasks.table.task') }),
      cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('id')),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => h(DataTableColumnHeader<Task>, { column, title: t('tasks.table.title') }),

      cell: ({ row }) => {
        const label = labels.find(label => label.value === row.original.label)

        return h('div', { class: 'flex space-x-2' }, [
          label ? h(Badge, { variant: 'outline' }, () => t(label.labelKey)) : null,
          h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('title')),
        ])
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => h(DataTableColumnHeader<Task>, { column, title: t('tasks.table.status') }),

      cell: ({ row }) => {
        const status = statuses.find(
          status => status.value === row.getValue('status'),
        )

        if (!status)
          return null

        return h('div', { class: 'flex w-[100px] items-center' }, [
          status.icon && h(status.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground' }),
          h('span', t(status.labelKey)),
        ])
      },
      filterFn: 'arrHas',
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => h(DataTableColumnHeader<Task>, { column, title: t('tasks.table.priority') }),
      cell: ({ row }) => {
        const priority = priorities.find(
          priority => priority.value === row.getValue('priority'),
        )

        if (!priority)
          return null

        return h('div', { class: 'flex items-center' }, [
          priority.icon && h(priority.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground' }),
          h('span', {}, t(priority.labelKey)),
        ])
      },
      filterFn: 'arrHas',
    },
    {
      id: 'actions',
      cell: ({ row }) => h(DataTableRowActions, { row }),
    },
  ]
}
