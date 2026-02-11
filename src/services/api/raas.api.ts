import type { MaybeRefOrGetter } from '@vueuse/core'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'

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
  const queryClient = useQueryClient()

  // Queries
  const useGetProducts = (params: MaybeRefOrGetter<ProductListParams>) => {
    const query = useQuery({
      queryKey: () => ['products', toValue(params)],
      queryFn: async () => {
        const response = await axiosInstance.get('/products', { params: toValue(params) })
        return response.data
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return query
  }

  const useGetProgressTracking = (asinList: string[], adWindow: string = '30') => {
    return useQuery({
      queryKey: ['progress', asinList, adWindow],
      queryFn: async () => {
        const response = await axiosInstance.post('/progress', { asin_list: asinList, ad_window: adWindow })
        return response.data
      },
      enabled: asinList.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutes
    })
  }

  const useGetProgressByFilter = (filters: ProductFilter) => {
    return useQuery({
      queryKey: ['progressByFilter', filters],
      queryFn: async () => {
        const response = await axiosInstance.get('/progress/by-filter', { params: filters })
        return response.data
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    })
  }

  // Mutations
  const useCreateProduct = () => {
    return useMutation({
      mutationFn: async (data: ProductCreate) => {
        const response = await axiosInstance.post('/products', data)
        return response.data
      },
      onSuccess: () => {
        // Invalidate products query to refetch data
        queryClient.invalidateQueries({ queryKey: ['products'] })
      },
    })
  }

  const useUpdateProduct = () => {
    return useMutation({
      mutationFn: async (data: ProductUpdate) => {
        const response = await axiosInstance.put('/products', data)
        return response.data
      },
      onSuccess: () => {
        // Invalidate products query to refetch data
        queryClient.invalidateQueries({ queryKey: ['products'] })
      },
    })
  }

  const useCancelProduct = () => {
    return useMutation({
      mutationFn: async (key: ProductCompositeKey) => {
        await axiosInstance.post('/products/cancel', key)
      },
      onSuccess: () => {
        // Invalidate products query to refetch data
        queryClient.invalidateQueries({ queryKey: ['products'] })
      },
    })
  }

  const useFetchBsr = () => {
    return useMutation({
      mutationFn: async (data: BsrFetchRequest) => {
        const response = await axiosInstance.post('/products/fetch-bsr', data)
        return response.data
      },
    })
  }

  const useUpdateProgressTracking = () => {
    return useMutation({
      mutationFn: async (data: { asin_list: string[], ad_window: string }) => {
        const response = await axiosInstance.post('/progress', data)
        return response.data
      },
    })
  }

  // Legacy methods for compatibility
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
    // New Vue Query hooks
    useGetProducts,
    useGetProgressTracking,
    useGetProgressByFilter,
    useCreateProduct,
    useUpdateProduct,
    useCancelProduct,
    useFetchBsr,
    useUpdateProgressTracking,

    // Legacy methods for compatibility
    cancelProduct,
    createProduct,
    fetchBsr,
    getProducts,
    getProgressByFilter,
    getProgressTracking,
    updateProduct,
  }
}
