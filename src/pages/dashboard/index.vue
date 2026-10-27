<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import OverviewContent from './components/overview-content.vue'

const { t } = useI18n()

const tabs = [
  { titleKey: 'dashboard.tabs.overview', value: 'overview' },
  { titleKey: 'dashboard.tabs.analytics', value: 'analytics', disabled: true },
  { titleKey: 'dashboard.tabs.reports', value: 'reports', disabled: true },
  { titleKey: 'dashboard.tabs.notifications', value: 'notifications', disabled: true },
]

const defaultTab = tabs[0].value
</script>

<template>
  <BasicPage
    :title="$t('dashboard.title')"
    :description="$t('dashboard.description')"
    sticky
  >
    <template #actions>
      <Button
        @click="() => toast(t('dashboard.toastGreeting'), {
          position: 'top-center',
        })"
      >
        {{ $t('download') }}
      </Button>
    </template>

    <Tabs :default-value="defaultTab" class="w-full">
      <TabsList>
        <TabsTrigger
          v-for="tab in tabs" :key="tab.value"
          :value="tab.value"
          :disabled="tab.disabled"
        >
          {{ $t(tab.titleKey) }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" class="space-y-4">
        <OverviewContent />
      </TabsContent>
    </Tabs>
  </BasicPage>
</template>
