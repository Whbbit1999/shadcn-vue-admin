<script setup lang="ts">
import Error from '@/components/custom-error.vue'

import { resolveErrorPage } from './data/error-pages'

const route = useRoute('/errors/[code]')
const errorPage = computed(() => resolveErrorPage(route.params.code))
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
