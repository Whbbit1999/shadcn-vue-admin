<script lang="ts" setup>
import Evaluation from '@/components/marketing/evaluation.vue'
import Features from '@/components/marketing/features.vue'
import Hero from '@/components/marketing/hero.vue'
import Logos from '@/components/marketing/logos.vue'
import PricingPlans from '@/components/marketing/pricing-plans/index.vue'
import Setup from '@/components/marketing/setup.vue'
</script>

<template>
  <div>
    <main class="mt-18">
      <Hero />
    </main>

    <main class="mt-8">
      <Logos />
    </main>

    <main class="mt-18">
      <Features />
    </main>

    <main class="mt-18">
      <Evaluation />
    </main>
    <main class="mt-18">
      <PricingPlans />
    </main>

    <main class="mt-18">
      <Setup />
    </main>
  </div>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: marketing
</route>
