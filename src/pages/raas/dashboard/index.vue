<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { ProductFilter } from '@/services/types/raas.type'

import { BasicPage } from '@/components/global-layout'
import FilterForm from '@/components/raas/filter-form.vue'
import ProductTable from '@/components/raas/product-table.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const { t } = useI18n()

const filters = ref<ProductFilter>({})

function handleFilterChange(newFilters: ProductFilter) {
  filters.value = { ...newFilters }
}

// 提取广告窗口选项，用于在表格标题旁边显示
const adWindowOptions = computed(() => [
  { label: t('raas.dashboard.last7Days'), value: '7d' },
  { label: t('raas.dashboard.last14Days'), value: '14d' },
  { label: t('raas.dashboard.last30Days'), value: '30d' },
])

// 处理广告窗口变化
function handleAdWindowChange(value: any) {
  if (value && (value === '7d' || value === '14d' || value === '30d')) {
    filters.value = { ...filters.value, ad_window: value as '7d' | '14d' | '30d' }
  }
}

// 获取当前广告窗口值
const currentAdWindow = computed(() => {
  return filters.value.ad_window || '30d'
})
</script>

<template>
  <BasicPage :title="t('raas.dashboard.title')" :description="t('raas.dashboard.description')" sticky>
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ t('raas.dashboard.filters') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterForm @filter-change="handleFilterChange" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>{{ t('raas.dashboard.mainTable') }}</CardTitle>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-muted-foreground">{{ t('raas.dashboard.adDataWindow') }}</span>
            <Select :model-value="currentAdWindow" @update:model-value="handleAdWindowChange">
              <SelectTrigger class="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in adWindowOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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
  auth: true
</route>
