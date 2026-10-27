<script setup lang="ts">
import { BasicPage } from '@/components/global-layout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { socialMediaAccounts } from './help-center-data'
</script>

<template>
  <BasicPage
    :title="$t('helpCenter.title')"
    :description="$t('helpCenter.description')"
  >
    <Alert>
      <AlertTitle>{{ $t('helpCenter.alertTitle') }}</AlertTitle>
      <AlertDescription>
        {{ $t('helpCenter.alertDescription') }}
      </AlertDescription>
    </Alert>

    <ul class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="account in socialMediaAccounts" :key="account.title">
        <a :href="account.url || '#'" target="_blank" rel="noopener noreferrer" class="block p-4 border rounded-lg shadow-sm bg-background border-border">
          <h2 class="mb-2 text-lg font-bold">
            {{ account.title }}
          </h2>
          <p class="text-sm text-stone-500">
            {{ $t(account.descKey) }}
          </p>
        </a>
      </li>
    </ul>
  </BasicPage>
</template>
