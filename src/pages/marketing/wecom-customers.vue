<script setup lang="ts">
import type { DateValue } from 'reka-ui'

import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { Eye, RefreshCw, Search, X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import type { WeComCustomer, WeComCustomerListParams } from '@/services/types/marketing.type'

import { BasicPage } from '@/components/global-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMarketingApi } from '@/services/api/marketing.api'

const { useGetWeComCustomers, useGetWeComCustomerDetail } = useMarketingApi()

const followerStaffOptions = [
  '19357117081',
  'apollo_captain',
  'apollo-nasa',
  '19357694505',
  '19357106882',
  '19357119703',
  'apollo_spark',
  'apollo2',
  '19357635821',
]

const filters = ref({
  search: '',
  owner_userid: 'all',
  corp_name: '',
  gender: 'all',
  type: 'all',
  tag: '',
  follow_created_date: '',
  updated_date: '',
})

const pagination = ref({
  page: 1,
  pageSize: 20,
})

const selectedExternalUserid = ref<string>()
const detailOpen = ref(false)
const followCreatedCalendarOpen = ref(false)
const updatedCalendarOpen = ref(false)
const calendarPlaceholder = today(getLocalTimeZone())

const datePattern = /^\d{4}-\d{2}-\d{2}$/

function dateParam(value: string) {
  const trimmed = value.trim()
  return datePattern.test(trimmed) ? trimmed : undefined
}

function calendarDate(value: string) {
  const trimmed = value.trim()
  if (!datePattern.test(trimmed))
    return undefined

  try {
    return parseDate(trimmed)
  }
  catch {
    return undefined
  }
}

const followCreatedCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(filters.value.follow_created_date),
  set: (value) => {
    filters.value.follow_created_date = value?.toString() ?? ''
  },
})

const updatedCalendarValue = computed<DateValue | undefined>({
  get: () => calendarDate(filters.value.updated_date),
  set: (value) => {
    filters.value.updated_date = value?.toString() ?? ''
  },
})

const queryParams = computed<WeComCustomerListParams>(() => ({
  page: pagination.value.page,
  page_size: pagination.value.pageSize,
  search: filters.value.search.trim(),
  owner_userid: filters.value.owner_userid === 'all' ? undefined : filters.value.owner_userid,
  corp_name: filters.value.corp_name.trim(),
  gender: filters.value.gender === 'all' ? undefined : Number(filters.value.gender),
  type: filters.value.type === 'all' ? undefined : Number(filters.value.type),
  tag: filters.value.tag.trim(),
  follow_created_from: dateParam(filters.value.follow_created_date),
  follow_created_to: dateParam(filters.value.follow_created_date),
  updated_from: dateParam(filters.value.updated_date),
  updated_to: dateParam(filters.value.updated_date),
}))

const { data, isLoading, isFetching, isError, refetch } = useGetWeComCustomers(queryParams)
const { data: detailData, isLoading: detailLoading } = useGetWeComCustomerDetail(selectedExternalUserid)

const customers = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const totalPages = computed(() => data.value?.total_pages ?? 1)

watch(filters, () => {
  pagination.value.page = 1
}, { deep: true })

function clearFilters() {
  filters.value = {
    search: '',
    owner_userid: 'all',
    corp_name: '',
    gender: 'all',
    type: 'all',
    tag: '',
    follow_created_date: '',
    updated_date: '',
  }
}

function openDetail(customer: WeComCustomer) {
  selectedExternalUserid.value = customer.external_userid
  detailOpen.value = true
}

function formatDate(value?: string | null) {
  if (!value)
    return '-'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function genderLabel(value?: number | null) {
  if (value === 1)
    return 'Male'
  if (value === 2)
    return 'Female'
  return 'Unknown'
}

function typeLabel(value?: number | null) {
  if (value === 1)
    return 'WeChat'
  if (value === 2)
    return 'Enterprise'
  return 'Unknown'
}

function relationTags(tags: unknown) {
  if (!Array.isArray(tags))
    return []

  return tags
    .map((tag) => {
      if (tag && typeof tag === 'object') {
        const record = tag as Record<string, unknown>
        return record.tag_name ?? record.name ?? record.tagid
      }
      return tag
    })
    .filter(Boolean)
    .map(String)
}
</script>

<template>
  <BasicPage title="WeCom Customers" description="External customer ownership and tag summaries" sticky>
    <div class="space-y-4">
      <Card>
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Filters</CardTitle>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" :disabled="isFetching" @click="refetch()">
                <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': isFetching }" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" @click="clearFilters">
                <X class="mr-2 size-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div class="space-y-1.5 xl:col-span-2">
              <div class="text-xs font-medium text-muted-foreground">
                Keyword
              </div>
              <div class="relative">
                <Search class="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
                <Input v-model="filters.search" class="pl-8" placeholder="Name, company, userid" />
              </div>
            </div>

            <div class="space-y-1.5 xl:col-span-2">
              <div class="text-xs font-medium text-muted-foreground">
                Apollo follower staff
              </div>
              <Select v-model="filters.owner_userid">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="All follower staffs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All follower staffs
                  </SelectItem>
                  <SelectItem v-for="userid in followerStaffOptions" :key="userid" :value="userid">
                    {{ userid }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <div class="text-xs font-medium text-muted-foreground">
                Company
              </div>
              <Input v-model="filters.corp_name" placeholder="Company name" />
            </div>

            <div class="space-y-1.5">
              <div class="text-xs font-medium text-muted-foreground">
                Tag
              </div>
              <Input v-model="filters.tag" placeholder="Tag name or id" />
            </div>

            <div class="space-y-1.5">
              <div class="text-xs font-medium text-muted-foreground">
                Gender
              </div>
              <Select v-model="filters.gender">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All genders
                  </SelectItem>
                  <SelectItem value="1">
                    Male
                  </SelectItem>
                  <SelectItem value="2">
                    Female
                  </SelectItem>
                  <SelectItem value="0">
                    Unknown
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <div class="text-xs font-medium text-muted-foreground">
                Customer type
              </div>
              <Select v-model="filters.type">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All types
                  </SelectItem>
                  <SelectItem value="1">
                    WeChat
                  </SelectItem>
                  <SelectItem value="2">
                    Enterprise
                  </SelectItem>
                  <SelectItem value="0">
                    Unknown
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5 xl:col-span-1">
              <div class="text-xs font-medium text-muted-foreground">
                Follow createtime
              </div>
              <Popover v-model:open="followCreatedCalendarOpen">
                <PopoverAnchor>
                  <Input
                    v-model="filters.follow_created_date"
                    class="w-[150px] text-left"
                    inputmode="numeric"
                    placeholder="YYYY-MM-DD"
                    @click="followCreatedCalendarOpen = true"
                    @focus="followCreatedCalendarOpen = true"
                  />
                </PopoverAnchor>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar
                    v-model="followCreatedCalendarValue"
                    calendar-label="Follow createtime"
                    initial-focus
                    layout="month-and-year"
                    :default-placeholder="calendarPlaceholder"
                    @update:model-value="followCreatedCalendarOpen = false"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div class="space-y-1.5 xl:col-span-1">
              <div class="text-xs font-medium text-muted-foreground">
                Contact updated_at
              </div>
              <Popover v-model:open="updatedCalendarOpen">
                <PopoverAnchor>
                  <Input
                    v-model="filters.updated_date"
                    class="w-[150px] text-left"
                    inputmode="numeric"
                    placeholder="YYYY-MM-DD"
                    @click="updatedCalendarOpen = true"
                    @focus="updatedCalendarOpen = true"
                  />
                </PopoverAnchor>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar
                    v-model="updatedCalendarValue"
                    calendar-label="Contact updated_at"
                    initial-focus
                    layout="month-and-year"
                    :default-placeholder="calendarPlaceholder"
                    @update:model-value="updatedCalendarOpen = false"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Customer List</CardTitle>
            <div class="text-sm text-muted-foreground">
              {{ total }} customers
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="min-w-[220px]">
                    Identity
                  </TableHead>
                  <TableHead class="min-w-[180px]">
                    Company
                  </TableHead>
                  <TableHead class="min-w-[130px]">
                    Gender / Type
                  </TableHead>
                  <TableHead class="min-w-[110px] text-right">
                    Followers
                  </TableHead>
                  <TableHead class="min-w-[180px]">
                    Owners
                  </TableHead>
                  <TableHead class="min-w-[220px]">
                    Tags
                  </TableHead>
                  <TableHead class="min-w-[180px]">
                    Updated
                  </TableHead>
                  <TableHead class="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="isLoading">
                  <TableCell colspan="8" class="h-28 text-center text-muted-foreground">
                    Loading customers...
                  </TableCell>
                </TableRow>
                <TableRow v-else-if="isError">
                  <TableCell colspan="8" class="h-28 text-center text-destructive">
                    Failed to load customers.
                  </TableCell>
                </TableRow>
                <TableRow v-else-if="customers.length === 0">
                  <TableCell colspan="8" class="h-28 text-center text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
                <TableRow v-for="customer in customers" v-else :key="customer.external_userid">
                  <TableCell>
                    <div class="flex items-center gap-3">
                      <img
                        v-if="customer.avatar"
                        :src="customer.avatar"
                        alt=""
                        class="size-9 shrink-0 rounded-full object-cover"
                      >
                      <div v-else class="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                        {{ (customer.name || customer.external_userid).slice(0, 2).toUpperCase() }}
                      </div>
                      <div class="min-w-0">
                        <div class="truncate font-medium">
                          {{ customer.name || '-' }}
                        </div>
                        <div class="truncate text-xs text-muted-foreground">
                          {{ customer.external_userid }}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="max-w-[220px] truncate">
                      {{ customer.corp_name || '-' }}
                    </div>
                    <div class="max-w-[220px] truncate text-xs text-muted-foreground">
                      {{ customer.position || customer.corp_full_name || '-' }}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{{ genderLabel(customer.gender) }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ typeLabel(customer.type) }}
                    </div>
                  </TableCell>
                  <TableCell class="text-right tabular-nums">
                    {{ customer.follower_count }}
                  </TableCell>
                  <TableCell>
                    <div class="max-w-[220px] truncate">
                      {{ customer.owner_summary || '-' }}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div class="flex max-w-[260px] flex-wrap gap-1">
                        <Badge v-for="tag in customer.tag_summary.slice(0, 4)" :key="tag" variant="secondary">
                          {{ tag }}
                        </Badge>
                        <Tooltip v-if="customer.tag_summary.length > 4">
                          <TooltipTrigger as-child>
                            <Badge class="cursor-help" variant="outline">
                              +{{ customer.tag_summary.length - 4 }}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent class="max-w-[320px] border bg-popover text-popover-foreground shadow-md [&_[data-slot=tooltip-arrow]]:bg-popover [&_[data-slot=tooltip-arrow]]:fill-popover">
                            <div class="flex flex-wrap gap-1">
                              <Badge v-for="tag in customer.tag_summary" :key="tag" variant="secondary">
                                {{ tag }}
                              </Badge>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        <span v-if="customer.tag_summary.length === 0" class="text-muted-foreground">-</span>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div>{{ formatDate(customer.updated_at) }}</div>
                    <div class="text-xs text-muted-foreground">
                      Follow {{ formatDate(customer.latest_follow_updated_at) }}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" @click="openDetail(customer)">
                      <Eye class="size-4" />
                      <span class="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="text-sm text-muted-foreground">
              Page {{ pagination.page }} of {{ totalPages }}
            </div>
            <div class="flex items-center gap-2">
              <Select v-model="pagination.pageSize">
                <SelectTrigger class="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="10">
                    10 / page
                  </SelectItem>
                  <SelectItem :value="20">
                    20 / page
                  </SelectItem>
                  <SelectItem :value="50">
                    50 / page
                  </SelectItem>
                  <SelectItem :value="100">
                    100 / page
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                :disabled="pagination.page <= 1"
                @click="pagination.page -= 1"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                :disabled="pagination.page >= totalPages"
                @click="pagination.page += 1"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Sheet v-model:open="detailOpen">
      <SheetContent class="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{{ detailData?.name || selectedExternalUserid || 'Customer detail' }}</SheetTitle>
          <SheetDescription>{{ detailData?.external_userid }}</SheetDescription>
        </SheetHeader>

        <div v-if="detailLoading" class="px-4 pb-6 text-sm text-muted-foreground">
          Loading detail...
        </div>
        <div v-else-if="detailData" class="space-y-6 px-4 pb-6">
          <section class="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <div class="text-muted-foreground">
                Company
              </div>
              <div class="font-medium">
                {{ detailData.corp_name || '-' }}
              </div>
            </div>
            <div>
              <div class="text-muted-foreground">
                Position
              </div>
              <div class="font-medium">
                {{ detailData.position || '-' }}
              </div>
            </div>
            <div>
              <div class="text-muted-foreground">
                Gender / Type
              </div>
              <div class="font-medium">
                {{ genderLabel(detailData.gender) }} / {{ typeLabel(detailData.type) }}
              </div>
            </div>
            <div>
              <div class="text-muted-foreground">
                Created
              </div>
              <div class="font-medium">
                {{ formatDate(detailData.created_at) }}
              </div>
            </div>
          </section>

          <section class="space-y-3">
            <div class="font-medium">
              Follow Relations
            </div>
            <div
              v-for="relation in detailData.follow_relations"
              :key="relation.userid"
              class="rounded-md border p-3 text-sm"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="font-medium">
                  {{ relation.userid }}
                </div>
                <Badge variant="outline">
                  {{ relation.add_way_description || relation.add_way || 'Unknown source' }}
                </Badge>
              </div>
              <div class="mt-2 grid gap-2 text-muted-foreground sm:grid-cols-2">
                <div>Remark: <span class="text-foreground">{{ relation.remark || '-' }}</span></div>
                <div>Operator: <span class="text-foreground">{{ relation.oper_userid || '-' }}</span></div>
                <div>State: <span class="text-foreground">{{ relation.state || '-' }}</span></div>
                <div>Updated: <span class="text-foreground">{{ formatDate(relation.updated_at) }}</span></div>
              </div>
              <div v-if="relation.description" class="mt-2 text-muted-foreground">
                {{ relation.description }}
              </div>
              <div v-if="relationTags(relation.tags).length" class="mt-3 flex flex-wrap gap-1">
                <Badge v-for="tag in relationTags(relation.tags)" :key="tag" variant="secondary">
                  {{ tag }}
                </Badge>
              </div>
            </div>
            <div v-if="detailData.follow_relations.length === 0" class="rounded-md border p-6 text-center text-sm text-muted-foreground">
              No follow relations found.
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  </BasicPage>
</template>

<route lang="yml">
meta:
  auth: true
</route>
