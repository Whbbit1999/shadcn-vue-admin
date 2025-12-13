<script setup lang="ts">
import Error from '@/components/custom-error.vue'
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Error
      :code="500"
      subtitle="Internal Server Error"
      error="The server encountered an unexpected condition which prevented it from fulfilling the request."
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
  </route>
