<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import type {
  Product,
  ProductCompositeKey,
  ProductCreate,
  ProductFilter,
  ProgressItem,
} from '@/services/types/raas.type'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRaasApi } from '@/services/api/raas.api'

const props = defineProps<{
  filters: ProductFilter
}>()

const { createProduct, cancelProduct, getProducts, updateProduct, fetchBsr, getProgressTracking } = useRaasApi()

const loading = ref(false)
const tableData = ref<Product[]>([])
const progressMap = ref<Record<string, ProgressItem>>({})
const selectedRowKeys = ref<Set<string>>(new Set())
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
})

const modalOpen = ref(false)
const modalTitle = ref('新增产品')
const isEditing = ref(false)

const formData = ref<ProductCreate & { _asin_text: string }>({
  amazon_profile_name: '',
  hanna_org_name: '',
  asin_list: [],
  _asin_text: '',
  category_name: '',
  raas_plan: '',
  start_date: '',
  end_date: '',
  baseline_sales_rank: null,
  status: undefined,
})

const bsrLoading = ref(false)
const bsrPending = ref(false)
const trackingLoading = ref(false)

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

const statusVariantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  CANCELLED: 'destructive',
  ONGOING: 'secondary',
  SUCCESS: 'default',
  UNDEFINED: 'outline',
}

// ---- Composite key helpers ----
function compositeKey(row: Product | ProductCompositeKey): string {
  const asins = Array.isArray(row.asin_list)
    ? [...row.asin_list].sort().join(',')
    : ''
  return `${row.amazon_profile_name}||${row.hanna_org_name}||${asins}||${row.category_name}||${row.raas_plan}||${row.start_date}`
}

function toCompositeKeyObj(row: Product): ProductCompositeKey {
  return {
    amazon_profile_name: row.amazon_profile_name,
    hanna_org_name: row.hanna_org_name,
    asin_list: row.asin_list,
    category_name: row.category_name,
    raas_plan: row.raas_plan,
    start_date: row.start_date,
  }
}

// ---- Flattened Rows ----
interface FlattenedRow {
  _key: string
  product: Product
  asin: string
  progress?: ProgressItem
}

const flattenedRows = computed<FlattenedRow[]>(() => {
  const rows: FlattenedRow[] = []
  tableData.value.forEach((product) => {
    const asins = (product.asin_list && product.asin_list.length > 0) ? product.asin_list : ['']
    const pKey = compositeKey(product)
    asins.forEach((asin, index) => {
      rows.push({
        _key: `${pKey}_${asin}_${index}`,
        product,
        asin,
        progress: progressMap.value[asin],
      })
    })
  })
  return rows
})

// ---- Selection ----
const hasSelection = computed(() => selectedRowKeys.value.size > 0)

function toggleSelectAll(checked: boolean | 'indeterminate') {
  if (checked === true) {
    selectedRowKeys.value = new Set(flattenedRows.value.map(r => r._key))
  }
  else {
    selectedRowKeys.value = new Set()
  }
}

function toggleSelectRow(rowKey: string, checked: boolean | 'indeterminate') {
  const next = new Set(selectedRowKeys.value)
  if (checked === true) {
    next.add(rowKey)
  }
  else {
    next.delete(rowKey)
  }
  selectedRowKeys.value = next
}

const allSelected = computed(() => {
  return flattenedRows.value.length > 0 && selectedRowKeys.value.size === flattenedRows.value.length
})

const partiallySelected = computed(() => {
  return selectedRowKeys.value.size > 0 && !allSelected.value
})

// ---- Selected products (deduplicated) ----
const selectedProducts = computed<Product[]>(() => {
  const seen = new Set<string>()
  const products: Product[] = []
  flattenedRows.value.forEach((row) => {
    if (selectedRowKeys.value.has(row._key)) {
      const pk = compositeKey(row.product)
      if (!seen.has(pk)) {
        seen.add(pk)
        products.push(row.product)
      }
    }
  })
  return products
})

const selectedProductCount = computed(() => selectedProducts.value.length)

// ---- Action bar handlers ----
function handleEditSelected() {
  if (selectedProducts.value.length === 0)
    return
  if (selectedProducts.value.length > 1) {
    toast.warning('编辑操作仅支持选择单个产品')
    return
  }
  handleEdit(selectedProducts.value[0])
}

async function handleCancelSelected() {
  const products = selectedProducts.value.filter(p => p.status !== 'CANCELLED')
  if (products.length === 0) {
    toast.warning('所选产品均已取消')
    return
  }
  try {
    for (const p of products) {
      await cancelProduct(toCompositeKeyObj(p))
    }
    toast.success(`已取消 ${products.length} 个合约`)
    fetchData()
  }
  catch {
    toast.error('取消合约失败')
  }
}

// ---- Tracking ----
async function handleConfirmTracking() {
  const selectedRows = flattenedRows.value.filter(r => selectedRowKeys.value.has(r._key))
  const asinsToTrack = [...new Set(selectedRows.map(r => r.asin).filter(Boolean))]

  if (asinsToTrack.length === 0) {
    toast.warning('请选择包含有效 ASIN 的行')
    return
  }

  trackingLoading.value = true
  try {
    const res = await getProgressTracking(asinsToTrack, props.filters.ad_window || '30')
    const newMap = { ...progressMap.value }
    res.items.forEach((item) => {
      if (item.asin) {
        newMap[item.asin] = item
      }
    })
    progressMap.value = newMap
    toast.success(`成功更新 ${res.items.length} 个 ASIN 的进度`)
  }
  catch {
    toast.error('获取进度失败')
  }
  finally {
    trackingLoading.value = false
  }
}

// ---- Fetch data ----
async function fetchData() {
  loading.value = true
  try {
    const response = await getProducts({
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
      ...props.filters,
    })
    tableData.value = response.items
    pagination.value.total = response.total
    selectedRowKeys.value = new Set()
  }
  catch {
    toast.error('获取数据失败')
  }
  finally {
    loading.value = false
  }
}

watch(
  () => props.filters,
  () => {
    pagination.value.current = 1
    fetchData()
  },
  { deep: true },
)

// ---- ASIN helpers ----
function parseAsinText(text: string): string[] {
  return text.split(',').map(s => s.trim()).filter(Boolean)
}

function formatAsinList(arr: string[] | undefined): string {
  if (!arr || arr.length === 0)
    return ''
  return arr.join(', ')
}

// ---- Modal: Add / Edit ----
function handleAdd() {
  modalTitle.value = '新增产品'
  isEditing.value = false
  formData.value = {
    amazon_profile_name: '',
    hanna_org_name: '',
    asin_list: [],
    _asin_text: '',
    category_name: '',
    raas_plan: '',
    start_date: '',
    end_date: '',
    baseline_sales_rank: null,
    status: undefined,
  }
  bsrPending.value = false
  modalOpen.value = true
}

function handleEdit(row: Product) {
  modalTitle.value = '编辑产品'
  isEditing.value = true
  formData.value = {
    amazon_profile_name: row.amazon_profile_name || '',
    hanna_org_name: row.hanna_org_name || '',
    asin_list: row.asin_list || [],
    _asin_text: formatAsinList(row.asin_list),
    category_name: row.category_name || '',
    raas_plan: row.raas_plan || '',
    start_date: row.start_date || '',
    end_date: row.end_date || '',
    baseline_sales_rank: row.baseline_sales_rank ?? null,
    status: row.status || 'ONGOING',
  }
  bsrPending.value = false
  modalOpen.value = true
}

// ---- BSR: form dialog ----
async function handleFetchBsr() {
  const asins = parseAsinText(formData.value._asin_text)
  if (asins.length === 0 || !formData.value.category_name) {
    toast.error('请先输入 ASIN List 和 Category')
    return
  }

  bsrLoading.value = true
  try {
    const res = await fetchBsr({
      asin_list: asins,
      category_name: formData.value.category_name,
    })

    if (res.status === 'found' && res.baseline_sales_rank != null) {
      formData.value.baseline_sales_rank = res.baseline_sales_rank
      toast.success('获取成功')
    }
    else if (res.status === 'fetching_triggered') {
      bsrPending.value = true
      formData.value.baseline_sales_rank = null
      toast.info(res.message || '正在获取数据，请稍后刷新')
    }
    else {
      toast.error(res.message || '获取失败')
    }
  }
  catch {
    toast.error('请求失败')
  }
  finally {
    bsrLoading.value = false
  }
}

// ---- BSR: inline refresh on table row ----
async function handleRefreshBsr(row: Product) {
  if (!row.asin_list || row.asin_list.length === 0 || !row.category_name)
    return

  const toastId = toast.loading('正在刷新排名...')

  try {
    const res = await fetchBsr({
      asin_list: row.asin_list,
      category_name: row.category_name,
    })

    if (res.status === 'found' && res.baseline_sales_rank != null) {
      row.baseline_sales_rank = res.baseline_sales_rank
      await updateProduct({
        amazon_profile_name: row.amazon_profile_name,
        hanna_org_name: row.hanna_org_name,
        asin_list: row.asin_list,
        category_name: row.category_name,
        raas_plan: row.raas_plan,
        start_date: row.start_date,
        end_date: row.end_date,
        baseline_sales_rank: res.baseline_sales_rank,
        status: row.status,
      })
      toast.success('刷新成功', { id: toastId })
    }
    else if (res.status === 'fetching_triggered') {
      toast.info('数据获取中，请稍后再试', { id: toastId })
    }
    else {
      toast.error('未找到数据', { id: toastId })
    }
  }
  catch {
    toast.error('刷新失败', { id: toastId })
  }
}

// ---- Submit form ----
async function handleModalOk() {
  const asinArr = parseAsinText(formData.value._asin_text)
  const payload: ProductCreate = {
    amazon_profile_name: formData.value.amazon_profile_name,
    hanna_org_name: formData.value.hanna_org_name,
    asin_list: asinArr,
    category_name: formData.value.category_name,
    raas_plan: formData.value.raas_plan,
    start_date: formData.value.start_date,
    end_date: formData.value.end_date,
    baseline_sales_rank: formData.value.baseline_sales_rank,
    ...(isEditing.value ? { status: formData.value.status } : {}),
  }

  try {
    if (isEditing.value) {
      await updateProduct(payload)
      toast.success('更新成功')
    }
    else {
      await createProduct(payload)
      toast.success('创建成功')
    }
    modalOpen.value = false
    fetchData()
  }
  catch {
    toast.error(isEditing.value ? '更新失败' : '创建失败')
  }
}

// ---- Pagination ----
function handlePageChange(nextPage: number) {
  pagination.value.current = nextPage
  fetchData()
}

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(pagination.value.total / pagination.value.pageSize))
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Top toolbar -->
    <div class="flex items-center gap-2">
      <Button @click="handleAdd">
        新增产品
      </Button>
    </div>

    <!-- Two-panel table -->
    <div class="rounded-md border">
      <div class="flex">
        <!-- Fixed left panel: Checkbox + Image + ASIN -->
        <div class="shrink-0 border-r bg-background">
          <table class="text-sm">
            <thead>
              <tr class="border-b">
                <th class="row-cell w-[40px] px-2">
                  <Checkbox
                    :model-value="allSelected"
                    :indeterminate="partiallySelected"
                    @update:model-value="toggleSelectAll"
                  />
                </th>
                <th class="row-cell w-[48px] px-2 text-left font-medium text-foreground">
                  图片
                </th>
                <th class="row-cell min-w-[120px] px-2 text-left font-medium text-foreground">
                  ASIN
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="3" class="row-cell px-2 text-center text-muted-foreground">
                  加载中...
                </td>
              </tr>
              <tr v-else-if="flattenedRows.length === 0">
                <td colspan="3" class="row-cell px-2 text-center text-muted-foreground">
                  暂无数据
                </td>
              </tr>
              <tr v-for="row in flattenedRows" :key="row._key" class="border-b">
                <td class="row-cell w-[40px] px-2">
                  <Checkbox
                    :model-value="selectedRowKeys.has(row._key)"
                    @update:model-value="(checked: boolean | 'indeterminate') => toggleSelectRow(row._key, checked)"
                  />
                </td>
                <td class="row-cell w-[48px] px-2">
                  <img
                    v-if="row.progress?.img_url"
                    :src="row.progress.img_url"
                    alt="Product"
                    class="h-9 w-9 rounded object-cover"
                  >
                  <div v-else class="h-9 w-9 rounded bg-muted" />
                </td>
                <td class="row-cell min-w-[120px] px-2 font-medium">
                  {{ row.asin || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Scrollable right panel: All other columns -->
        <div class="flex-1 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="row-cell min-w-[140px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  Amazon Profile
                </th>
                <th class="row-cell min-w-[120px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  Hanna Org
                </th>
                <th class="row-cell min-w-[120px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  Category
                </th>
                <th class="row-cell min-w-[120px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  Raas Plan
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  基线排名
                </th>
                <th class="row-cell min-w-[90px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  状态
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  开始日期
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  结束日期
                </th>
                <!-- Progress columns -->
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  剩余天数
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  当前排名
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  Climb达标天数
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  达成耗时
                </th>
                <!-- Ad columns (window controlled by filter) -->
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  广告花费
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  广告销售
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  广告订单
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  ACOS
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  CM Actions
                </th>
                <th class="row-cell min-w-[110px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  CM Launch Groups
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  CM Campaigns
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  CM AdGroups
                </th>
                <th class="row-cell min-w-[110px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  Smart Campaigns
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  SC Campaigns
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  SC AdGroups
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="31" class="row-cell px-3 text-center text-muted-foreground">
                  加载中...
                </td>
              </tr>
              <tr v-else-if="flattenedRows.length === 0">
                <td colspan="31" class="row-cell px-3 text-center text-muted-foreground">
                  暂无数据
                </td>
              </tr>
              <tr v-for="row in flattenedRows" :key="row._key" class="border-b">
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.product.amazon_profile_name || '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.product.hanna_org_name || '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.product.category_name || '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  <Badge v-if="row.product.raas_plan">
                    {{ row.product.raas_plan }}
                  </Badge>
                  <span v-else>-</span>
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  <span v-if="row.product.baseline_sales_rank != null">
                    {{ row.product.baseline_sales_rank }}
                  </span>
                  <Button
                    v-else
                    size="sm"
                    variant="outline"
                    class="h-7 text-xs"
                    @click="handleRefreshBsr(row.product)"
                  >
                    刷新
                  </Button>
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  <Badge :variant="statusVariantMap[row.product.status || 'ONGOING'] || 'outline'">
                    {{ row.product.status || 'ONGOING' }}
                  </Badge>
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.product.start_date || '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.product.end_date || '-' }}
                </td>
                <!-- Progress data -->
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.days_remaining ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.current_sales_rank ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.climb_days_met ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.days_taken ?? '-' }}
                </td>
                <!-- Ad data (window controlled by filter) -->
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.ad_spend ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.ad_sales ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.ad_orders ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.acos ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.cyber_minigun_actions ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.cyber_minigun_launch_groups ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.campaigns_created_by_cyber_minigun ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.adgroups_created_by_cyber_minigun ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.smart_campaigns ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.campaigns_created_by_smart_campaigns ?? '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.progress?.adgroups_created_by_smart_campaigns ?? '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Selection action bar -->
    <div v-if="hasSelection" class="flex items-center gap-3 rounded-md border bg-muted/50 p-3">
      <span class="text-sm font-medium">
        已选择 {{ selectedProductCount }} 个产品 ({{ selectedRowKeys.size }} 行)
      </span>
      <Button size="sm" @click="handleEditSelected">
        编辑
      </Button>
      <Button size="sm" variant="destructive" @click="handleCancelSelected">
        取消合约
      </Button>
      <Button size="sm" :disabled="trackingLoading" @click="handleConfirmTracking">
        {{ trackingLoading ? '更新中...' : '更新/确认追踪' }}
      </Button>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <div>
        共 {{ pagination.total }} 条产品 ({{ flattenedRows.length }} 行)
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.current <= 1"
          @click="handlePageChange(pagination.current - 1)"
        >
          上一页
        </Button>
        <span>
          {{ pagination.current }} / {{ totalPages }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.current >= totalPages"
          @click="handlePageChange(pagination.current + 1)"
        >
          下一页
        </Button>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog :open="modalOpen" @update:open="modalOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-2">
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              Amazon Profile
            </div>
            <Input v-model="formData.amazon_profile_name" :disabled="isEditing" placeholder="请输入 Amazon Profile" />
          </div>
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              Hanna Org
            </div>
            <Input v-model="formData.hanna_org_name" :disabled="isEditing" placeholder="请输入 Hanna Org" />
          </div>
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              ASIN List
            </div>
            <Textarea v-model="formData._asin_text" :disabled="isEditing" placeholder="请输入 ASIN，多个用逗号分隔" />
          </div>
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              Category
            </div>
            <Input v-model="formData.category_name" :disabled="isEditing" placeholder="请输入 Category" />
          </div>
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              Baseline Sales Rank
            </div>
            <div class="flex items-center gap-2">
              <Input
                :model-value="formData.baseline_sales_rank ?? undefined"
                type="number"
                :disabled="bsrPending"
                placeholder="请输入或获取"
                @update:model-value="(v: any) => formData.baseline_sales_rank = v === '' || v == null ? null : Number(v)"
              />
              <Button
                variant="outline"
                type="button"
                :disabled="bsrLoading || bsrPending || !formData._asin_text || !formData.category_name"
                @click="handleFetchBsr"
              >
                {{ bsrLoading ? '获取中...' : (bsrPending ? '获取中(后台)' : '获取当前排位') }}
              </Button>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              Raas Plan
            </div>
            <Select v-model="formData.raas_plan" :disabled="isEditing">
              <SelectTrigger>
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
          <div v-if="isEditing" class="space-y-2">
            <div class="text-sm text-muted-foreground">
              状态
            </div>
            <Select v-model="formData.status">
              <SelectTrigger>
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
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              开始日期
            </div>
            <Input v-model="formData.start_date" :disabled="isEditing" placeholder="YYYY-MM-DD" />
          </div>
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              结束日期
            </div>
            <Input v-model="formData.end_date" placeholder="YYYY-MM-DD" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" @click="modalOpen = false">
            取消
          </Button>
          <Button @click="handleModalOk">
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.row-cell {
  height: 52px;
  vertical-align: middle;
}
</style>
