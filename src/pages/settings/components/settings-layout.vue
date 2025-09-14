<script setup lang="ts">
import Page from '@/components/global-layout/basic-page.vue'
import TwoColLayout from '@/components/global-layout/two-col.vue'

import SettingsAside from './settings-aside.vue'
</script>

<template>
  <Page
    title="Settings"
    description="Manage your store settings."
  >
    <TwoColLayout>
      <template #aside>
        <SettingsAside />
      </template>

      <slot />
    </TwoColLayout>
  </Page>
</template>
