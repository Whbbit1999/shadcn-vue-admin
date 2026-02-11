import type { AxiosError } from 'axios'

import axios from 'axios'

import { useAuthStore } from '@/stores/auth'
import env from '@/utils/env'

// 全局存储路由器实例的变量
let globalRouter: any = null

// 全局设置路由器实例的函数
export function setGlobalRouter(router: any) {
  globalRouter = router
}

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

      // 如果有全局路由器实例，则使用它进行导航，否则回退到传统的页面重定向
      if (globalRouter) {
        globalRouter.push('/auth/sign-in')
      }
      else {
        window.location.href = '/auth/sign-in'
      }
    }
    return Promise.reject(error)
  })

  return {
    axiosInstance,
  }
}
