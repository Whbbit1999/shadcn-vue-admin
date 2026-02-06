import { useAxios } from '@/composables/use-axios'

import type {
  BsrFetchRequest,
  BsrFetchResponse,
  Product,
  ProductCompositeKey,
  ProductCreate,
  ProductFilter,
  ProductListParams,
  ProductListResponse,
  ProductUpdate,
  ProgressResponse,
} from '../types/raas.type'

export function useRaasApi() {
  const { axiosInstance } = useAxios()

  const getProducts = async (
    params: ProductListParams = {},
  ): Promise<ProductListResponse> => {
    const response = await axiosInstance.get('/products', { params })
    return response.data
  }

  const createProduct = async (data: ProductCreate): Promise<Product> => {
    const response = await axiosInstance.post('/products', data)
    return response.data
  }

  const updateProduct = async (data: ProductUpdate): Promise<Product> => {
    const response = await axiosInstance.put('/products', data)
    return response.data
  }

  const cancelProduct = async (key: ProductCompositeKey): Promise<void> => {
    await axiosInstance.post('/products/cancel', key)
  }

  const fetchBsr = async (data: BsrFetchRequest): Promise<BsrFetchResponse> => {
    const response = await axiosInstance.post('/products/fetch-bsr', data)
    return response.data
  }

  const getProgressTracking = async (
    asinList: string[],
    adWindow: string = '30',
  ): Promise<ProgressResponse> => {
    const response = await axiosInstance.post('/progress', { asin_list: asinList, ad_window: adWindow })
    return response.data
  }

  const getProgressByFilter = async (
    filters: ProductFilter,
  ): Promise<ProgressResponse> => {
    const response = await axiosInstance.get('/progress/by-filter', { params: filters })
    return response.data
  }

  return {
    cancelProduct,
    createProduct,
    fetchBsr,
    getProducts,
    getProgressByFilter,
    getProgressTracking,
    updateProduct,
  }
}
