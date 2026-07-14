<script setup lang="ts">
import { toast } from 'vue-sonner'
import { z } from 'zod'

import Loading from '@/components/loading.vue'
import { Toaster } from '@/components/ui/sonner'
import { useSystemTheme } from '@/composables/use-system-theme'
import { envError } from '@/utils/env'

useSystemTheme()

onMounted(() => {
  if (envError) {
    const flattenError = z.flattenError(envError)
    toast.error('Env error: you should check your .env file', {
      description: h(
        'pre',
        { class: 'mt-2 rounded-md bg-slate-950 p-4 text-wrap' },
        h('code', { class: 'text-white' }, JSON.stringify(flattenError, null, 2)),
      ),
      duration: 10000,
    })
  }
})
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
