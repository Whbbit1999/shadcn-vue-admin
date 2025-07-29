<script setup lang="ts">
import { Loader } from 'lucide-vue-next'

import Page from '@/components/global-layout/basic-page.vue'

import { columns } from './components/columns'
import DataTable from './components/data-table.vue'
import UserCreate from './components/user-create.vue'
import UserInvite from './components/user-invite.vue'
import { users } from './data/users'

const loading = ref(false)

function mockLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <Page
    title="Users"
    description="Users description"
    sticky
  >
    <template #actions>
      <UserInvite />
      <UserCreate />
      <UiButton variant="outline" @click="mockLoading">
        <Loader />Mock Loading
      </UiButton>
    </template>
    <div class="overflow-x-auto">
      <DataTable :loading :data="users" :columns="columns" />
    </div>
  </Page>
</template>
