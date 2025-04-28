<script lang="ts" setup>
import Footer from '@/components/marketing-layout/the-footer.vue'
import Header from '@/components/marketing-layout/the-header.vue'
</script>

<template>
  <div class="container mx-auto ">
    <div class="mx-2 lg:p-0">
      <Header />

      <main>
        <router-view />
      </main>

      <Footer />
    </div>
  </div>
</template>

<style scoped>

</style>
