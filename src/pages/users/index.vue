<script setup lang="ts">
import { LoaderIcon } from '@lucide/vue'

import type { DataTableToolbarFilter } from '@/components/data-table'

import { DataTable, DataTableToolbar } from '@/components/data-table'
import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'

import { columns } from './components/columns'
import UserCreate from './components/user-create.vue'
import UserInvite from './components/user-invite.vue'
import { callTypes, userTypes } from './data/data'
import { users } from './data/users'

const loading = shallowRef(false)

const filters = [
  { column: 'status', title: 'Status', options: callTypes },
  { column: 'role', title: 'Role', options: userTypes },
] satisfies DataTableToolbarFilter[]

function mockLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <BasicPage
    title="Users"
    description="Users description"
    sticky
  >
    <template #actions>
      <UserInvite />
      <UserCreate />
      <Button variant="outline" @click="mockLoading">
        <LoaderIcon />Mock Loading
      </Button>
    </template>
    <DataTable :loading :data="users" :columns="columns">
      <template #toolbar="{ table }">
        <DataTableToolbar
          :table="table"
          :filters="filters"
          search-column="username"
          search-placeholder="Filter users by username..."
        />
      </template>
    </DataTable>
  </BasicPage>
</template>
