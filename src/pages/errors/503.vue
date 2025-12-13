<script setup lang="ts">
import Error from '@/components/custom-error.vue'
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Error
      :code="503"
      subtitle="Service Unavailable"
      error="The server is currently unable to handle the request due to a temporary overloading or maintenance of the server."
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
  </route>
