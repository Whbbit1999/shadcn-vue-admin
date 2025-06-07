<script setup lang="ts">
import type { TSort } from '@/components/sort-select/types'

import Page from '@/components/global-layout/basic-page.vue'
import SortSelect from '@/components/sort-select/index.vue'

import AppCard from './components/app-card.vue'
import apps from './data/apps'

const appList = ref(apps)

type AppType = 'all' | 'connected' | 'notConnected'

const searchTerm = ref('')
const appType = ref<AppType>('all')
const appTypes: AppType[] = [
  'all',
  'connected',
  'notConnected',
]

const sort = ref<TSort>('asc')

watch(searchTerm, (newValue) => {
  if (!newValue)
    appList.value = apps

  appList.value = apps.filter((app) => {
    return app.name.toLowerCase().includes(newValue.toLowerCase())
  })
})

watch(sort, (newValue) => {
  appList.value = apps.sort((a, b) => {
    if (newValue === 'asc')
      return a.name.localeCompare(b.name)
    return b.name.localeCompare(a.name)
  })
})

watch(appType, (newValue) => {
  appList.value = apps.filter((app) => {
    if (newValue === 'all')
      return true
    return newValue === 'connected'
      ? app.connected
      : !app.connected
  })
})
</script>

<template>
  <Page
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
        v-for="(app, index) in appList" :key="index"
        :app="app"
      />
    </main>
  </Page>
</template>

<style scoped>
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
