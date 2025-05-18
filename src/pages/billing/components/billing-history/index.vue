<script setup lang="ts">
import type { Billing } from './data/schema'

import { columns } from './columns'
import DataTable from './data-table.vue'
import billings from './data/billings.json'
</script>

<template>
  <DataTable :data="billings as unknown as Billing[]" :columns />
</template>
