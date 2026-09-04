import { describe, expect, it } from 'vitest'
import { computed, effectScope, nextTick, shallowRef } from 'vue'

import { DEFAULT_PAGE_SIZE } from '@/constants/app'

import type { DataTableColumnDef } from '../table'

import { useDataTable } from '../table'

interface Person {
  id: number
  name: string
  status: 'active' | 'inactive'
}

const data: Person[] = [
  { id: 1, name: 'Ada', status: 'active' },
  { id: 2, name: 'Grace', status: 'inactive' },
  { id: 3, name: 'Linus', status: 'active' },
]

const columns: DataTableColumnDef<Person>[] = [
  { accessorKey: 'name' },
  { accessorKey: 'status', filterFn: 'arrHas' },
]

describe('useDataTable', () => {
  it('uses the shared default page size', () => {
    const scope = effectScope()
    const table = scope.run(() => useDataTable<Person>({ columns, data }))!

    expect(table.atoms.pagination.get().pageSize).toBe(DEFAULT_PAGE_SIZE)

    scope.stop()
  })

  it('owns filtering and pagination state', () => {
    const scope = effectScope()
    const table = scope.run(() => useDataTable<Person>({ columns, data }))!

    table.getColumn('status')?.setFilterValue(['active'])
    expect(table.getFilteredRowModel().rows).toHaveLength(2)

    table.setPageSize(1)
    table.nextPage()
    expect(table.atoms.pagination.get()).toEqual({ pageIndex: 1, pageSize: 1 })
    expect(table.getRowModel().rows[0]?.original.name).toBe('Linus')

    scope.stop()
  })

  it('uses controlled pagination for server-provided rows', async () => {
    const scope = effectScope()
    const pagination = shallowRef({ pageIndex: 0, pageSize: 2 })
    const rowCount = shallowRef(5)
    const table = scope.run(() => useDataTable<Person>({
      columns,
      data,
      manualPagination: true,
      rowCount,
      state: computed(() => ({ pagination: pagination.value })),
      onPaginationChange: (next) => {
        pagination.value = typeof next === 'function' ? next(pagination.value) : next
      },
    }))!

    expect(table.getRowModel().rows).toHaveLength(3)
    expect(table.getPageCount()).toBe(3)

    table.nextPage()
    expect(pagination.value).toEqual({ pageIndex: 1, pageSize: 2 })

    rowCount.value = 9
    await nextTick()
    expect(table.getPageCount()).toBe(5)

    scope.stop()
  })
})
