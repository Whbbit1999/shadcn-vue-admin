<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import Error from '@/components/custom-error.vue'
import { Button } from '@/components/ui/button'

import { resolveErrorPage } from './data/error-pages'

const { t } = useI18n()
const route = useRoute('/errors/[code]')
const errorPage = computed(() => resolveErrorPage(route.params.code))
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Error
      :code="errorPage.code"
      :subtitle="t(errorPage.subtitleKey)"
      :error="t(errorPage.descriptionKey)"
    >
      <div class="flex justify-center gap-2">
        <Button variant="outline" @click="$router.back()">
          {{ $t('errors.goBack') }}
        </Button>
        <Button @click="$router.push('/')">
          {{ $t('errors.backToHome') }}
        </Button>
      </div>
    </Error>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
