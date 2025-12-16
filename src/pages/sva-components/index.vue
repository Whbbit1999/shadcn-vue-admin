<script lang="ts" setup>
import { BasicPage } from '@/components/global-layout'

import Copy from './components/copy.vue'
import InlineTip from './components/inline-tip.vue'
import StatusBadge from './components/status-badge.vue'
</script>

<template>
  <BasicPage
    title="SVA Components"
    description="shadcn-vue-admin custom components"
    sticky
  >
    <div class="flex flex-col gap-4">
      <StatusBadge />

      <Copy />

      <InlineTip />
    </div>
  </BasicPage>
</template>
