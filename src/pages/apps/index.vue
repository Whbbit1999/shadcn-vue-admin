<script setup lang="ts">
import type { TSort } from '@/components/sort-select'

import { BasicPage } from '@/components/global-layout'
import { SortSelect } from '@/components/sort-select'

import AppCard from './components/app-card.vue'
import apps from './data/apps'

type AppType = 'all' | 'connected' | 'notConnected'

const searchTerm = shallowRef('')
const appType = shallowRef<AppType>('all')
const appTypes: AppType[] = [
  'all',
  'connected',
  'notConnected',
]

const sort = shallowRef<TSort>('asc')

const appList = computed(() => {
  const normalizedSearchTerm = searchTerm.value.trim().toLowerCase()

  return apps
    .filter((app) => {
      return !normalizedSearchTerm || app.name.toLowerCase().includes(normalizedSearchTerm)
    })
    .filter((app) => {
      if (appType.value === 'all')
        return true
      return appType.value === 'connected' ? app.connected : !app.connected
    })
    .sort((a, b) => {
      if (sort.value === 'asc')
        return a.name.localeCompare(b.name)
      return b.name.localeCompare(a.name)
    })
})
</script>

<template>
  <BasicPage
    title="Apps"
    description="Apps description"
    sticky
  >
    <div class="flex items-end justify-between sm:items-center">
      <div class="flex flex-col gap-4 sm:flex-row">
        <UiInput
          v-model:model-value="searchTerm"
          placeholder="Filter apps..."
          class="h-9 w-40 lg:w-[250px]"
        />

        <UiSelect v-model:model-value="appType">
          <UiSelectTrigger class-name="w-36">
            <UiSelectValue>{{ appType }}</UiSelectValue>
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem v-for="type in appTypes" :key="type" :value="type">
              {{ type }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>

      <SortSelect v-model:sort="sort" />
    </div>
    <main class="grid grid-cols-1 gap-4 mt-2 lg:grid-cols-3">
      <AppCard
        v-for="app in appList" :key="app.name"
        :app="app"
      />
    </main>
  </BasicPage>
</template>

<route lang="yaml">
meta:
  auth: true
</route>
