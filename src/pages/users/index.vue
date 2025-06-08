<script setup lang="ts">
import Page from '@/components/global-layout/basic-page.vue'

import { columns } from './components/columns'
import DataTable from './components/data-table.vue'
import UserCreate from './components/user-create.vue'
import UserInvite from './components/user-invite.vue'
import { users } from './data/users'
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
    </template>
    <div class="overflow-x-auto">
      <DataTable :data="users" :columns="columns" />
    </div>
  </Page>
</template>
