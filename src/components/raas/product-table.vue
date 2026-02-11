<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import type {
  Product,
  ProductCompositeKey,
  ProductCreate,
  ProductFilter,
  ProductListParams,
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

const { t } = useI18n()

const {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useCancelProduct,
  useFetchBsr,
  useUpdateProgressTracking,
} = useRaasApi()

// Pagination
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
})

// Reactive query params based on filters and pagination
// Exclude ad_window from triggering table reloads as it only affects ad metrics calculation
const queryParams = computed<ProductListParams>(() => {
  // Ensure we're properly handling all filter values
  const params: ProductListParams = {
    page: pagination.value.current,
    page_size: pagination.value.pageSize,
  }

  // Only add filter properties that have actual values
  Object.keys(props.filters).forEach((key) => {
    const typedKey = key as keyof ProductFilter
    const value = props.filters[typedKey]

    // Skip ad_window as it should not trigger table reloads
    if (typedKey !== 'ad_window' && value !== undefined && value !== null && value !== '') {
      (params as any)[typedKey] = value
    }
  })

  return params
})

// Queries - API will automatically react to queryParams changes
const { data: productsData, isLoading: loading } = useGetProducts(queryParams)

// Update total when data changes
watch(
  () => productsData.value?.total,
  (newTotal) => {
    if (newTotal !== undefined) {
      pagination.value.total = newTotal
    }
  },
)

// Mutations
const { mutate: createProduct } = useCreateProduct()
const { mutate: updateProduct } = useUpdateProduct()
const { mutate: cancelProduct } = useCancelProduct()
const { mutate: fetchBsr } = useFetchBsr()
const { mutate: updateProgressTracking } = useUpdateProgressTracking()

const tableData = computed(() => productsData.value?.items || [])

const progressMap = ref<Record<string, ProgressItem>>({})
const selectedRowKeys = ref<Set<string>>(new Set())

const modalOpen = ref(false)
const modalTitle = ref('')
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
  marketplace: 'US',
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
  tableData.value.forEach((product: Product) => {
    const asins = (product.asin_list && product.asin_list.length > 0) ? product.asin_list : ['']
    const pKey = compositeKey(product)
    asins.forEach((asin: string, index: number) => {
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
    toast.warning(t('raas.messages.editSingleOnly'))
    return
  }
  handleEdit(selectedProducts.value[0])
}

function handleCancelSelected() {
  const products = selectedProducts.value.filter(p => p.status !== 'CANCELLED')
  if (products.length === 0) {
    toast.warning(t('raas.messages.allCancelled'))
    return
  }

  for (const p of products) {
    cancelProduct(toCompositeKeyObj(p), {
      onSuccess: () => {
        toast.success(t('raas.messages.cancelledCount', { count: products.length }))
        // 缓存会自动失效，不需要手动刷新
      },
      onError: () => {
        toast.error(t('raas.messages.cancelFailed'))
      },
    })
  }
}

// ---- Tracking ----
async function handleConfirmTracking() {
  const selectedRows = flattenedRows.value.filter(r => selectedRowKeys.value.has(r._key))
  const asinsToTrack = [...new Set(selectedRows.map(r => r.asin).filter(Boolean))]

  if (asinsToTrack.length === 0) {
    toast.warning(t('raas.messages.selectValidAsin'))
    return
  }

  trackingLoading.value = true

  updateProgressTracking(
    {
      asin_list: asinsToTrack,
      ad_window: props.filters.ad_window || '30',
    },
    {
      onSuccess: (response) => {
        if (response) {
          const newMap = { ...progressMap.value }
          response.items.forEach((item: ProgressItem) => {
            if (item.asin) {
              newMap[item.asin] = item
            }
          })
          progressMap.value = newMap
          toast.success(t('raas.messages.progressUpdated', { count: response.items.length }))
        }
      },
      onError: () => {
        toast.error(t('raas.messages.progressFailed'))
      },
      onSettled: () => {
        trackingLoading.value = false
      },
    },
  )
}

// ---- Pagination ----
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
  modalTitle.value = t('raas.modal.addProduct')
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
    marketplace: 'US',
  }
  bsrPending.value = false
  modalOpen.value = true
}

function handleEdit(row: Product) {
  modalTitle.value = t('raas.modal.editProduct')
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
    marketplace: row.marketplace || 'US',
  }
  bsrPending.value = false
  modalOpen.value = true
}

// ---- BSR: form dialog ----
async function handleFetchBsr() {
  const asins = parseAsinText(formData.value._asin_text)
  if (asins.length === 0 || !formData.value.category_name) {
    toast.error(t('raas.messages.enterAsinCategory'))
    return
  }

  bsrLoading.value = true

  fetchBsr({
    asin_list: asins,
    category_name: formData.value.category_name,
  }, {
    onSuccess: (res) => {
      if (res.status === 'found' && res.baseline_sales_rank != null) {
        formData.value.baseline_sales_rank = res.baseline_sales_rank
        toast.success(t('raas.messages.fetchSuccess'))
      }
      else if (res.status === 'fetching_triggered') {
        bsrPending.value = true
        formData.value.baseline_sales_rank = null
        toast.info(res.message || t('raas.messages.fetchingRefreshLater'))
      }
      else {
        toast.error(res.message || t('raas.messages.fetchFailed'))
      }
    },
    onError: () => {
      toast.error(t('raas.messages.requestFailed'))
    },
    onSettled: () => {
      bsrLoading.value = false
    },
  })
}

// ---- BSR: inline refresh on table row ----
async function handleRefreshBsr(row: Product) {
  if (!row.asin_list || row.asin_list.length === 0 || !row.category_name)
    return

  const toastId = toast.loading(t('raas.messages.refreshing'))

  fetchBsr({
    asin_list: row.asin_list,
    category_name: row.category_name,
  }, {
    onSuccess: (res) => {
      if (res.status === 'found' && res.baseline_sales_rank != null) {
        row.baseline_sales_rank = res.baseline_sales_rank
        updateProduct({
          amazon_profile_name: row.amazon_profile_name,
          hanna_org_name: row.hanna_org_name,
          asin_list: row.asin_list,
          category_name: row.category_name,
          raas_plan: row.raas_plan,
          start_date: row.start_date,
          end_date: row.end_date,
          baseline_sales_rank: res.baseline_sales_rank,
          status: row.status,
        }, {
          onSuccess: () => {
            toast.success(t('raas.messages.refreshSuccess'), { id: toastId })
          },
          onError: () => {
            toast.error(t('raas.messages.refreshFailed'), { id: toastId })
          },
        })
      }
      else if (res.status === 'fetching_triggered') {
        toast.info(t('raas.messages.fetchingTryLater'), { id: toastId })
      }
      else {
        toast.error(t('raas.messages.dataNotFound'), { id: toastId })
      }
    },
    onError: () => {
      toast.error(t('raas.messages.refreshFailed'), { id: toastId })
    },
  })
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
    marketplace: formData.value.marketplace,
    ...(isEditing.value ? { status: formData.value.status } : {}),
  }

  const mutateFn = isEditing.value ? updateProduct : createProduct

  mutateFn(payload, {
    onSuccess: () => {
      toast.success(isEditing.value ? t('raas.messages.updateSuccess') : t('raas.messages.createSuccess'))
      modalOpen.value = false
      // 缓存会自动失效，不需要手动刷新
    },
    onError: () => {
      toast.error(isEditing.value ? t('raas.messages.updateFailed') : t('raas.messages.createFailed'))
    },
  })
}

// ---- Pagination ----
function handlePageChange(nextPage: number) {
  pagination.value.current = nextPage
  // Query will automatically refetch due to reactive queryParams
}

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(pagination.value.total / pagination.value.pageSize))
})
</script>

<template>
  <div class="space-y-4">
    <!-- Top toolbar -->
    <div class="flex items-center gap-2">
      <Button @click="handleAdd">
        {{ t('raas.actions.addProduct') }}
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
                  {{ t('raas.table.image') }}
                </th>
                <th class="row-cell min-w-[120px] px-2 text-left font-medium text-foreground">
                  {{ t('raas.table.asin') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="3" class="row-cell px-2 text-center text-muted-foreground">
                  {{ t('raas.table.loading') }}
                </td>
              </tr>
              <tr v-else-if="flattenedRows.length === 0">
                <td colspan="3" class="row-cell px-2 text-center text-muted-foreground">
                  {{ t('raas.table.noData') }}
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
                  {{ t('raas.table.amazonProfile') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.marketplace') }}
                </th>
                <th class="row-cell min-w-[120px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.hannaOrg') }}
                </th>
                <th class="row-cell min-w-[120px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.category') }}
                </th>
                <th class="row-cell min-w-[120px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.raasPlan') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.baselineRank') }}
                </th>
                <th class="row-cell min-w-[90px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.status') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.startDate') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.endDate') }}
                </th>
                <!-- Progress columns -->
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.daysRemaining') }}
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.currentRank') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.climbDaysMet') }}
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.daysTaken') }}
                </th>
                <!-- Ad columns (window controlled by filter) -->
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.adSpend') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.adSales') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.adOrders') }}
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.acos') }}
                </th>
                <th class="row-cell min-w-[80px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.cmActions') }}
                </th>
                <th class="row-cell min-w-[110px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.cmLaunchGroups') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.cmCampaigns') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.cmAdGroups') }}
                </th>
                <th class="row-cell min-w-[110px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.smartCampaigns') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.scCampaigns') }}
                </th>
                <th class="row-cell min-w-[100px] whitespace-nowrap px-3 text-left font-medium text-foreground">
                  {{ t('raas.table.scAdGroups') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="31" class="row-cell px-3 text-center text-muted-foreground">
                  {{ t('raas.table.loading') }}
                </td>
              </tr>
              <tr v-else-if="flattenedRows.length === 0">
                <td colspan="31" class="row-cell px-3 text-center text-muted-foreground">
                  {{ t('raas.table.noData') }}
                </td>
              </tr>
              <tr v-for="row in flattenedRows" :key="row._key" class="border-b">
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.product.amazon_profile_name || '-' }}
                </td>
                <td class="row-cell whitespace-nowrap px-3">
                  {{ row.product.marketplace || '-' }}
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
                    {{ t('raas.actions.refresh') }}
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
        {{ t('raas.actions.selectedProducts', { products: selectedProductCount, rows: selectedRowKeys.size }) }}
      </span>
      <Button size="sm" @click="handleEditSelected">
        {{ t('raas.actions.edit') }}
      </Button>
      <Button size="sm" variant="destructive" @click="handleCancelSelected">
        {{ t('raas.actions.cancelContract') }}
      </Button>
      <Button size="sm" :disabled="trackingLoading" @click="handleConfirmTracking">
        {{ trackingLoading ? t('raas.actions.updating') : t('raas.actions.updateTracking') }}
      </Button>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <div>
        {{ t('raas.table.totalProductsRows', { products: pagination.total, rows: flattenedRows.length }) }}
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.current <= 1"
          @click="handlePageChange(pagination.current - 1)"
        >
          {{ t('raas.table.previousPage') }}
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
          {{ t('raas.table.nextPage') }}
        </Button>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog :open="modalOpen" @update:open="modalOpen = $event">
      <DialogContent class="max-w-3xl w-full mx-4 h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
        </DialogHeader>
        <div class="overflow-y-auto flex-1 py-4">
          <div class="grid gap-4 px-2">
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.amazonProfile') }}
              </div>
              <Input v-model="formData.amazon_profile_name" :disabled="isEditing" :placeholder="t('raas.modal.amazonProfilePlaceholder')" class="w-full max-w-[calc(100%-2rem)]" />
            </div>
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.marketplace') }}
              </div>
              <Select v-model="formData.marketplace" :disabled="isEditing">
                <SelectTrigger class="w-full max-w-[calc(100%-2rem)]">
                  <SelectValue :placeholder="t('raas.modal.marketplacePlaceholder')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">
                    US
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.hannaOrg') }}
              </div>
              <Input v-model="formData.hanna_org_name" :disabled="isEditing" :placeholder="t('raas.modal.hannaOrgPlaceholder')" class="w-full max-w-[calc(100%-2rem)]" />
            </div>
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.asinList') }}
              </div>
              <Textarea v-model="formData._asin_text" :disabled="isEditing" :placeholder="t('raas.modal.asinListPlaceholder')" class="w-full max-w-[calc(100%-2rem)]" />
            </div>
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.category') }}
              </div>
              <Input v-model="formData.category_name" :disabled="isEditing" :placeholder="t('raas.modal.categoryPlaceholder')" class="w-full max-w-[calc(100%-2rem)]" />
            </div>
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.baselineRank') }}
              </div>
              <div class="flex items-center gap-2">
                <Input
                  :model-value="formData.baseline_sales_rank ?? undefined"
                  type="number"
                  :disabled="bsrPending"
                  :placeholder="t('raas.modal.baselineRankPlaceholder')"
                  class="w-full max-w-[calc(100%-2rem)]"
                  @update:model-value="(v: any) => formData.baseline_sales_rank = v === '' || v == null ? null : Number(v)"
                />
                <Button
                  variant="outline"
                  type="button"
                  :disabled="bsrLoading || bsrPending || !formData._asin_text || !formData.category_name"
                  @click="handleFetchBsr"
                >
                  {{ bsrLoading ? t('raas.modal.fetching') : (bsrPending ? t('raas.modal.fetchingBackground') : t('raas.modal.fetchRank')) }}
                </Button>
              </div>
            </div>
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.raasPlan') }}
              </div>
              <Select v-model="formData.raas_plan" :disabled="isEditing">
                <SelectTrigger class="w-full max-w-[calc(100%-2rem)]">
                  <SelectValue :placeholder="t('raas.modal.raasPlanPlaceholder')" />
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
                {{ t('raas.modal.status') }}
              </div>
              <Select v-model="formData.status">
                <SelectTrigger class="w-full max-w-[calc(100%-2rem)]">
                  <SelectValue :placeholder="t('raas.modal.statusPlaceholder')" />
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
                {{ t('raas.modal.startDate') }}
              </div>
              <Input v-model="formData.start_date" :disabled="isEditing" placeholder="YYYY-MM-DD" class="w-full max-w-[calc(100%-2rem)]" />
            </div>
            <div class="space-y-2">
              <div class="text-sm text-muted-foreground">
                {{ t('raas.modal.endDate') }}
              </div>
              <Input v-model="formData.end_date" placeholder="YYYY-MM-DD" class="w-full max-w-[calc(100%-2rem)]" />
            </div>
          </div>
          <DialogFooter class="pt-4">
            <Button variant="secondary" @click="modalOpen = false">
              {{ t('raas.modal.cancel') }}
            </Button>
            <Button @click="handleModalOk">
              {{ t('raas.modal.confirm') }}
            </Button>
          </DialogFooter>
        </div>
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
