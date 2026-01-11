<script lang="ts" setup>
import PlanCard from './plan-card.vue'

const plans = [
  {
    title: 'Free',
    price: 0,
    billingCycle: 'month',
    description: 'Get started with the free plan and explore all the features.',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
    buttonLabel: 'Current Plan',
    active: true,
  },
  {
    title: 'Small Business',
    price: 19.99,
    discount: 49.99,
    billingCycle: 'month',
    description: 'Start growing your business with our small business plan.',
    features: [
      'Every free plan feature',
      '10 users',
      '10G storage',
    ],
    buttonLabel: 'Switch to this plan',
  },
  {
    title: 'Enterprise',
    price: 199.99,
    discount: 499.99,
    billingCycle: 'month',
    description: 'Get the best of everything with our enterprise plan.',
    features: [
      'Every small business plan feature',
      'Unlimited users',
      'Unlimited storage',
    ],
    buttonLabel: 'Switch to this plan',
  },
]
</script>

<template>
  <div class="p-2 rounded-md bg-secondary">
    <div class="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-3">
      <PlanCard
        v-for="(plan, index) in plans"
        :key="index"
        :title="plan.title"
        :price="plan.price"
        :discount="plan.discount"
        :billing-cycle="plan.billingCycle"
        :description="plan.description"
        :features="plan.features"
        :button-label="plan.buttonLabel"
        :active="plan.active"
      />
    </div>
  </div>
</template>
