import type { AxiosError } from 'axios'

import axios from 'axios'

import { useAuthStore } from '@/stores/auth'
import env from '@/utils/env'

export function useAxios() {
  const axiosInstance = axios.create({
    baseURL: env.VITE_SERVER_API_URL + env.VITE_SERVER_API_PREFIX,
    timeout: env.VITE_SERVER_API_TIMEOUT,
  })

  axiosInstance.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    return response
  }, (error: AxiosError) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.clearAuth()
      window.location.href = '/auth/sign-in'
    }
    return Promise.reject(error)
  })

  return {
    axiosInstance,
  }
}
