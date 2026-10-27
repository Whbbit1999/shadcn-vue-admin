<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PlanCard from './plan-card.vue'

interface Plan {
  titleKey: string
  price: number
  billingCycleKey: string
  descriptionKey: string
  featureKeys: string[]
  buttonLabelKey: string
  discount?: number
  active?: boolean
}

const { t } = useI18n()

const plans: Plan[] = [
  {
    titleKey: 'billing.plan.free.title',
    price: 0,
    billingCycleKey: 'billing.plan.billingCycle',
    descriptionKey: 'billing.plan.free.description',
    featureKeys: [
      'billing.plan.free.features.feature1',
      'billing.plan.free.features.feature2',
      'billing.plan.free.features.feature3',
    ],
    buttonLabelKey: 'billing.plan.current',
    active: true,
  },
  {
    titleKey: 'billing.plan.smallBusiness.title',
    price: 19.99,
    discount: 49.99,
    billingCycleKey: 'billing.plan.billingCycle',
    descriptionKey: 'billing.plan.smallBusiness.description',
    featureKeys: [
      'billing.plan.smallBusiness.features.feature1',
      'billing.plan.smallBusiness.features.feature2',
      'billing.plan.smallBusiness.features.feature3',
    ],
    buttonLabelKey: 'billing.plan.switch',
  },
  {
    titleKey: 'billing.plan.enterprise.title',
    price: 199.99,
    discount: 499.99,
    billingCycleKey: 'billing.plan.billingCycle',
    descriptionKey: 'billing.plan.enterprise.description',
    featureKeys: [
      'billing.plan.enterprise.features.feature1',
      'billing.plan.enterprise.features.feature2',
      'billing.plan.enterprise.features.feature3',
    ],
    buttonLabelKey: 'billing.plan.switch',
  },
]
</script>

<template>
  <div class="p-2 rounded-md bg-secondary">
    <div class="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-3">
      <PlanCard
        v-for="(plan, index) in plans"
        :key="index"
        :title="t(plan.titleKey)"
        :price="plan.price"
        :discount="plan.discount"
        :billing-cycle="t(plan.billingCycleKey)"
        :description="t(plan.descriptionKey)"
        :features="plan.featureKeys.map(key => t(key))"
        :button-label="t(plan.buttonLabelKey)"
        :active="plan.active"
      />
    </div>
  </div>
</template>
