<script setup lang="ts">
import Error from '@/components/custom-error.vue'
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Error
      :code="401"
      subtitle="Unauthorized"
      error="You are not authorized to access this page."
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
