<script setup lang="ts">
import { ref } from 'vue'

import type { ProductFilter } from '@/services/types/raas.type'

import { BasicPage } from '@/components/global-layout'
import FilterForm from '@/components/raas/filter-form.vue'
import ProductTable from '@/components/raas/product-table.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const filters = ref<ProductFilter>({})

function handleFilterChange(newFilters: ProductFilter) {
  filters.value = newFilters
}
</script>

<template>
  <BasicPage title="Raas Dashboard" description="Raas 产品管理与进度追踪" sticky>
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>筛选器</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterForm @filter-change="handleFilterChange" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raas 产品主表 & 进度追踪</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable :filters="filters" />
        </CardContent>
      </Card>
    </div>
  </BasicPage>
</template>

<route lang="yml">
meta:
  auth: false
</route>
