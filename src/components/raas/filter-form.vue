<script setup lang="ts">
import { reactive } from 'vue'

import type { ProductFilter } from '@/services/types/raas.type'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const emit = defineEmits<{
  (e: 'filterChange', filters: ProductFilter): void
}>()

const filterForm = reactive<ProductFilter>({
  amazon_profile_name: undefined,
  category_name: undefined,
  hanna_org_name: undefined,
  raas_plan: undefined,
  status: undefined,
  ad_window: '30d',
})

const raasPlanOptions = [
  { label: 'Climb Plan', value: 'Climb Plan' },
  { label: 'Sprint - Top100', value: 'Sprint - Top100' },
  { label: 'Sprint - Top1', value: 'Sprint - Top1' },
]

const statusOptions = [
  { label: 'ONGOING', value: 'ONGOING' },
  { label: 'SUCCESS', value: 'SUCCESS' },
  { label: 'CANCELLED', value: 'CANCELLED' },
]

const adWindowOptions = [
  { label: '最近 7 天', value: '7d' },
  { label: '最近 14 天', value: '14d' },
  { label: '最近 30 天', value: '30d' },
]

function handleSearch() {
  const filters: ProductFilter = {}
  Object.entries(filterForm).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      filters[key as keyof ProductFilter] = value as any
    }
  })
  emit('filterChange', filters)
}

function handleReset() {
  filterForm.amazon_profile_name = undefined
  filterForm.hanna_org_name = undefined
  filterForm.raas_plan = undefined
  filterForm.category_name = undefined
  filterForm.status = undefined
  filterForm.ad_window = '30d'
  emit('filterChange', { ad_window: '30d' })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Row 1: Primary search filters -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <div class="space-y-1.5">
        <div class="text-xs font-medium text-muted-foreground">
          Amazon Profile
        </div>
        <Input
          v-model="filterForm.amazon_profile_name"
          placeholder="请输入 Amazon Profile"
          class="h-9"
        />
      </div>
      <div class="space-y-1.5">
        <div class="text-xs font-medium text-muted-foreground">
          Hanna Org
        </div>
        <Input
          v-model="filterForm.hanna_org_name"
          placeholder="请输入 Hanna Org"
          class="h-9"
        />
      </div>
      <div class="space-y-1.5">
        <div class="text-xs font-medium text-muted-foreground">
          Category
        </div>
        <Input
          v-model="filterForm.category_name"
          placeholder="请输入 Category"
          class="h-9"
        />
      </div>
      <div class="space-y-1.5">
        <div class="text-xs font-medium text-muted-foreground">
          Raas Plan
        </div>
        <Select v-model="filterForm.raas_plan">
          <SelectTrigger class="h-9">
            <SelectValue placeholder="请选择 Raas Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in raasPlanOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-1.5">
        <div class="text-xs font-medium text-muted-foreground">
          状态
        </div>
        <Select v-model="filterForm.status">
          <SelectTrigger class="h-9">
            <SelectValue placeholder="请选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-1.5">
        <div class="text-xs font-medium text-muted-foreground">
          广告数据窗口
        </div>
        <Select v-model="filterForm.ad_window">
          <SelectTrigger class="h-9">
            <SelectValue placeholder="选择时间窗口" />
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
    </div>

    <!-- Row 2: Action buttons -->
    <div class="flex items-center gap-2">
      <Button size="sm" @click="handleSearch">
        搜索
      </Button>
      <Button size="sm" variant="outline" @click="handleReset">
        重置
      </Button>
    </div>
  </div>
</template>
