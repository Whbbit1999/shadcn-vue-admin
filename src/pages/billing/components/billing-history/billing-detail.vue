<script lang="ts" setup>
import { useModal } from '@/composables/use-modal'

import type { Billing } from './data/schema'

import TransactionCard from '../transaction-card/index.vue'

defineProps<{
  billing: Billing
}>()
const { Modal } = useModal()
</script>

<template>
  <div>
    <component :is="Modal.Header">
      <component :is="Modal.Description" />
    </component>

    <TransactionCard
      :card-no="billing.id"
      :order-id="billing.orderId || ''"
      :price="billing.amount"
      currency="$"
      :state="billing.status"
      :updated-at="billing.date"
      :invoice-no="`${billing.id}`"
      :description="billing.description"
    />
  </div>
</template>
