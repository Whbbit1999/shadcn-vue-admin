<script setup lang="ts">
import Error from '@/components/custom-error.vue'
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Error
      :code="404"
      subtitle="Page Not Found"
      error="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
    />
  </div>
</template>

<style scoped>
</style>

<route lang="yaml">
  meta:
    layout: false
</route>
