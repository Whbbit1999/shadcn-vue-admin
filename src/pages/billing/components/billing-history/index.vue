<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { DataTable } from '@/components/data-table'

import type { Billing } from './data/schema'

import { createColumns } from './columns'
import billings from './data/billings.json' with { type: 'json' }

const { t } = useI18n()

const columns = computed(() => createColumns(t))
</script>

<template>
  <DataTable :data="billings as unknown as Billing[]" :columns>
    <template #toolbar>
      <h2 class="my-2 mb-4 text-lg font-bold">
        {{ $t('billing.history.title') }}
      </h2>
    </template>
  </DataTable>
</template>
