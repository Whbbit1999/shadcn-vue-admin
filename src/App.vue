<script setup lang="ts">
import Loading from '@/components/loading.vue'
import { Toaster } from '@/components/ui/sonner'
import { useSystemTheme } from '@/composables/use-system-theme'

useSystemTheme()
</script>

<template>
  <Toaster />

  <Suspense>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>

    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
