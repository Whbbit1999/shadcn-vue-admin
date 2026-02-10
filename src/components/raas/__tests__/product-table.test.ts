import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRaasApi } from '@/services/api/raas.api'

import ProductTable from '../product-table.vue'

// Mock dependencies
vi.mock('@/services/api/raas.api')
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
}))

// Mock the toast function
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(() => 'mock-toast-id'),
  },
}))

describe('productTable', () => {
  let wrapper: any
  let mockUseRaasApi: any
  let mockGetProducts: any
  let mockCreateProduct: any
  let mockUpdateProduct: any
  let mockCancelProduct: any
  let mockFetchBsr: any
  let mockGetProgressTracking: any

  beforeEach(() => {
    // Create mock implementations
    mockGetProducts = vi.fn()
    mockCreateProduct = vi.fn()
    mockUpdateProduct = vi.fn()
    mockCancelProduct = vi.fn()
    mockFetchBsr = vi.fn()
    mockGetProgressTracking = vi.fn()

    mockUseRaasApi = vi.mocked(useRaasApi)
    mockUseRaasApi.mockReturnValue({
      getProducts: mockGetProducts,
      createProduct: mockCreateProduct,
      updateProduct: mockUpdateProduct,
      cancelProduct: mockCancelProduct,
      fetchBsr: mockFetchBsr,
      getProgressTracking: mockGetProgressTracking,
    })

    // Create wrapper
    wrapper = mount(ProductTable, {
      global: {
        plugins: [createPinia()],
        stubs: {
          // Stub UI components to avoid complexity
          Badge: true,
          Button: true,
          Checkbox: true,
          Dialog: true,
          DialogContent: true,
          DialogFooter: true,
          DialogHeader: true,
          DialogTitle: true,
          Input: true,
          Select: true,
          SelectContent: true,
          SelectItem: true,
          SelectTrigger: true,
          SelectValue: true,
          Textarea: true,
        },
      },
      props: {
        filters: {},
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('calls getProducts on mount', async () => {
    // Wait for mount
    await wrapper.vm.$nextTick()

    // Check if getProducts was called
    expect(mockGetProducts).toHaveBeenCalled()
  })

  it('handles filter changes', async () => {
    // Mock getProducts to return empty data
    mockGetProducts.mockResolvedValue({ items: [], total: 0 })

    // Update filters prop
    await wrapper.setProps({ filters: { amazon_profile_name: 'Test' } })

    // Wait for next tick
    await wrapper.vm.$nextTick()

    // Check if getProducts was called with new filters
    expect(mockGetProducts).toHaveBeenCalledWith({
      page: 1,
      page_size: 20,
      amazon_profile_name: 'Test',
    })
  })

  it('handles add product', async () => {
    // Mock createProduct
    mockCreateProduct.mockResolvedValue({})

    // Open add modal
    await wrapper.vm.handleAdd()

    // Check if modal is open
    expect(wrapper.vm.modalOpen).toBe(true)
    expect(wrapper.vm.modalTitle).toBe('新增产品')
    expect(wrapper.vm.isEditing).toBe(false)
  })

  it('handles edit product', async () => {
    // Mock product data
    const product = {
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: ['B001', 'B002'],
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      baseline_sales_rank: 1000,
      status: 'ONGOING',
    }

    // Open edit modal
    await wrapper.vm.handleEdit(product)

    // Check if modal is open with correct data
    expect(wrapper.vm.modalOpen).toBe(true)
    expect(wrapper.vm.modalTitle).toBe('编辑产品')
    expect(wrapper.vm.isEditing).toBe(true)
    expect(wrapper.vm.formData.amazon_profile_name).toBe('Test Profile')
  })

  it('handles modal submit for new product', async () => {
    // Mock createProduct
    mockCreateProduct.mockResolvedValue({})
    mockGetProducts.mockResolvedValue({ items: [], total: 0 })

    // Open add modal
    await wrapper.vm.handleAdd()

    // Fill form data
    wrapper.vm.formData = {
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: [],
      _asin_text: 'B001,B002',
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      baseline_sales_rank: 1000,
      status: undefined,
    }

    // Submit form
    await wrapper.vm.handleModalOk()

    // Check if createProduct was called
    expect(mockCreateProduct).toHaveBeenCalledWith({
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: ['B001', 'B002'],
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      baseline_sales_rank: 1000,
    })
  })

  it('handles modal submit for existing product', async () => {
    // Mock updateProduct
    mockUpdateProduct.mockResolvedValue({})
    mockGetProducts.mockResolvedValue({ items: [], total: 0 })

    // Mock product data
    const product = {
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: ['B001', 'B002'],
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      baseline_sales_rank: 1000,
      status: 'ONGOING',
    }

    // Open edit modal
    await wrapper.vm.handleEdit(product)

    // Submit form
    await wrapper.vm.handleModalOk()

    // Check if updateProduct was called
    expect(mockUpdateProduct).toHaveBeenCalledWith({
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: ['B001', 'B002'],
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      baseline_sales_rank: 1000,
      status: 'ONGOING',
    })
  })

  it('handles cancel product', async () => {
    // Mock cancelProduct
    mockCancelProduct.mockResolvedValue({})
    mockGetProducts.mockResolvedValue({ items: [], total: 0 })

    // Mock product data
    const product = {
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: ['B001', 'B002'],
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
      status: 'ONGOING',
    }

    // Add product to table data
    wrapper.vm.tableData = [product]

    // Add product to selected rows using the correct flattened row key format
    const pKey = wrapper.vm.compositeKey(product)
    const rowKey = `${pKey}_B001_0` // Use the format from flattenedRows
    wrapper.vm.selectedRowKeys.add(rowKey)

    // Cancel product
    await wrapper.vm.handleCancelSelected()

    // Check if cancelProduct was called
    expect(mockCancelProduct).toHaveBeenCalledWith({
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: ['B001', 'B002'],
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
    })
  })

  it('handles progress tracking', async () => {
    // Mock getProgressTracking
    mockGetProgressTracking.mockResolvedValue({
      items: [
        {
          asin: 'B001',
          days_remaining: 10,
          current_sales_rank: 500,
          climb_days_met: 5,
          days_taken: 15,
          ad_spend: 100,
          ad_sales: 500,
          ad_orders: 10,
          acos: 20,
          cyber_minigun_actions: 5,
          cyber_minigun_launch_groups: 2,
          campaigns_created_by_cyber_minigun: 3,
          adgroups_created_by_cyber_minigun: 6,
          smart_campaigns: 2,
          campaigns_created_by_smart_campaigns: 2,
          adgroups_created_by_smart_campaigns: 4,
          img_url: 'https://example.com/image.jpg',
        },
      ],
    })

    // Mock product data
    const product = {
      amazon_profile_name: 'Test Profile',
      hanna_org_name: 'Test Org',
      asin_list: ['B001', 'B002'],
      category_name: 'Test Category',
      raas_plan: 'Climb Plan',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      baseline_sales_rank: 1000,
      status: 'ONGOING',
    }

    // Add product to table data
    wrapper.vm.tableData = [product]

    // Add rows to selected rows
    const rowKey1 = `${wrapper.vm.compositeKey(product)}_B001_0`
    const rowKey2 = `${wrapper.vm.compositeKey(product)}_B002_1`
    wrapper.vm.selectedRowKeys.add(rowKey1)
    wrapper.vm.selectedRowKeys.add(rowKey2)

    // Update tracking
    await wrapper.vm.handleConfirmTracking()

    // Check if getProgressTracking was called
    expect(mockGetProgressTracking).toHaveBeenCalledWith(['B001', 'B002'], '30')

    // Check if progressMap was updated
    expect(wrapper.vm.progressMap.B001).toBeDefined()
    expect(wrapper.vm.progressMap.B001.current_sales_rank).toBe(500)
  })
})
