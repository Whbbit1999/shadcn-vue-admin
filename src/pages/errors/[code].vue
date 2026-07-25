<script setup lang="ts">
import Error from '@/components/custom-error.vue'

import { resolveErrorPage } from './data/error-pages'

const route = useRoute()
const code = computed(() => {
  const value = (route.params as { code?: string | string[] }).code
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
})
const errorPage = computed(() => resolveErrorPage(code.value))
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Error
      :code="errorPage.code"
      :subtitle="errorPage.subtitle"
      :error="errorPage.error"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
