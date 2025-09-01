<script lang="ts" setup>
import Page from '@/components/global-layout/basic-page.vue'

import Copy from './components/copy.vue'
import StatusBadge from './components/status-badge.vue'
</script>

<template>
  <Page
    title="SVA Components"
    description="shadcn-vue-admin custom components"
    sticky
  >
    <div class="flex flex-col gap-4">
      <StatusBadge />

      <Copy />
    </div>
  </Page>
</template>
