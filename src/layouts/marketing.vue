<script setup lang="ts">
import { RouterView } from 'vue-router'

import Footer from '@/components/marketing-layout/the-footer.vue'
import Header from '@/components/marketing-layout/the-header.vue'
</script>

<template>
  <div class="container mx-auto ">
    <div class="mx-2 lg:p-0">
      <Header />

      <main>
        <RouterView />
      </main>

      <Footer />
    </div>
  </div>
</template>
