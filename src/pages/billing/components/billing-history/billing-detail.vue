<script lang="ts" setup>
import { VisuallyHidden } from 'reka-ui'

import { ModalDescription, ModalHeader, ModalTitle } from '@/components/prop-ui/modal'

import type { Billing } from './data/schema'

import TransactionCard from '../transaction-card/index.vue'

defineProps<{
  billing: Billing
}>()
</script>

<template>
  <div>
    <ModalHeader>
      <VisuallyHidden as-child>
        <ModalTitle />
        <ModalDescription :aria-describedby="undefined" />
      </VisuallyHidden>
    </ModalHeader>

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
