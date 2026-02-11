<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

const filterForm = reactive<ProductFilter>({
  amazon_profile_name: undefined,
  category_name: undefined,
  hanna_org_name: undefined,
  raas_plan: undefined,
  status: undefined,
  marketplace: undefined,
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

function handleSearch() {
  const filters: ProductFilter = {}
  Object.entries(filterForm).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
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
  filterForm.marketplace = undefined
  emit('filterChange', {})
}
</script>

<template>
  <div class="space-y-3">
    <!-- Filters grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Row 1 -->
      <div class="space-y-1">
        <div class="text-xs font-medium text-muted-foreground">
          Amazon Profile
        </div>
        <Input
          v-model="filterForm.amazon_profile_name"
          :placeholder="t('raas.filter.amazonProfilePlaceholder')"
          class="h-8"
        />
      </div>

      <div class="space-y-1">
        <div class="text-xs font-medium text-muted-foreground">
          Marketplace
        </div>
        <Select v-model="filterForm.marketplace">
          <SelectTrigger class="h-8">
            <SelectValue :placeholder="t('raas.filter.marketplacePlaceholder')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="US">
              US
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-1">
        <div class="text-xs font-medium text-muted-foreground">
          Category
        </div>
        <Input
          v-model="filterForm.category_name"
          :placeholder="t('raas.filter.categoryPlaceholder')"
          class="h-8"
        />
      </div>

      <!-- Row 2 -->
      <div class="space-y-1">
        <div class="text-xs font-medium text-muted-foreground">
          Hanna Org
        </div>
        <Input
          v-model="filterForm.hanna_org_name"
          :placeholder="t('raas.filter.hannaOrgPlaceholder')"
          class="h-8"
        />
      </div>

      <div class="space-y-1">
        <div class="text-xs font-medium text-muted-foreground">
          Raas Plan
        </div>
        <Select v-model="filterForm.raas_plan">
          <SelectTrigger class="h-8">
            <SelectValue :placeholder="t('raas.filter.raasPlanPlaceholder')" />
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

      <div class="space-y-1">
        <div class="text-xs font-medium text-muted-foreground">
          {{ t('raas.filter.statusLabel') }}
        </div>
        <Select v-model="filterForm.status">
          <SelectTrigger class="h-8">
            <SelectValue :placeholder="t('raas.filter.statusPlaceholder')" />
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
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-2 pt-1">
      <Button size="sm" @click="handleSearch">
        {{ t('raas.filter.search') }}
      </Button>
      <Button size="sm" variant="outline" @click="handleReset">
        {{ t('raas.filter.reset') }}
      </Button>
    </div>
  </div>
</template>
