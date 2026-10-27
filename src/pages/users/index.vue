<script setup lang="ts">
import { FolderOpenIcon, LoaderIcon } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

import type { DataTableToolbarFilter } from '@/components/data-table'

import { DataTable, DataTableToolbar } from '@/components/data-table'
import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'
import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

import { createColumns } from './components/columns'
import UserCreate from './components/user-create.vue'
import UserInvite from './components/user-invite.vue'
import { callTypes, userTypes } from './data/data'
import { users } from './data/users'

const { t } = useI18n()

const loading = shallowRef(false)

const columns = computed(() => createColumns(t))

const filters = computed<DataTableToolbarFilter[]>(() => [
  {
    column: 'status',
    title: t('users.filters.status'),
    options: callTypes.map(({ labelKey, ...option }) => ({ ...option, label: t(labelKey) })),
  },
  {
    column: 'role',
    title: t('users.filters.role'),
    options: userTypes.map(({ labelKey, ...option }) => ({ ...option, label: t(labelKey) })),
  },
])

function mockLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <BasicPage
    :title="$t('users.title')"
    :description="$t('users.description')"
    sticky
  >
    <template #actions>
      <UserInvite />
      <UserCreate />
      <Button variant="outline" @click="mockLoading">
        <LoaderIcon />{{ $t('users.actions.mockLoading') }}
      </Button>
    </template>
    <DataTable :loading :data="users" :columns="columns">
      <template #toolbar="{ table }">
        <DataTableToolbar
          :table="table"
          :filters="filters"
          search-column="username"
          :search-placeholder="$t('users.table.searchPlaceholder')"
        />
      </template>

      <template #empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpenIcon />
          </EmptyMedia>
          <EmptyTitle>{{ $t('users.empty.title') }}</EmptyTitle>
          <EmptyDescription>
            {{ $t('users.empty.description') }}
          </EmptyDescription>
        </EmptyHeader>
      </template>
    </DataTable>
  </BasicPage>
</template>
