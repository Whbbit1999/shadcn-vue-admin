<script lang="ts" setup>
import { BasicPage } from '@/components/global-layout'

import BillingHistory from './components/billing-history/index.vue'
import BillingPlan from './components/billing-plan/index.vue'
</script>

<template>
  <BasicPage
    title="Plans & Billing"
    description="Manage your plan and billing history here."
  >
    <BillingPlan />
    <BillingHistory class="mt-2" />
  </BasicPage>
</template>
