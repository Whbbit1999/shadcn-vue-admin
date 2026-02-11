import { storeToRefs } from 'pinia'

import { useAxios } from '@/composables/use-axios'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const router = useRouter()

  const authStore = useAuthStore()
  const { isLogin } = storeToRefs(authStore)
  const loading = ref(false)
  const error = ref('')

  function logout() {
    authStore.clearAuth()
    router.push({ path: '/auth/sign-in' })
  }

  function toHome() {
    router.push({ path: '/raas/dashboard' })
  }

  async function login(username: string, password: string) {
    loading.value = true
    error.value = ''

    try {
      const { axiosInstance } = useAxios()
      const response = await axiosInstance.post('/auth/login', { username, password })
      const { access_token, username: name } = response.data

      authStore.setAuth(access_token, name)

      const redirect = router.currentRoute.value.query.redirect as string
      // 更安全的重定向检查，防止开放重定向漏洞
      if (redirect && !redirect.startsWith('//') && redirect.startsWith('/')) {
        // 验证重定向路径是否为有效的内部路径
        try {
          // 尝试解析重定向路径，防止恶意URL
          const parsedRedirect = new URL(redirect, window.location.origin)
          if (parsedRedirect.origin === window.location.origin) {
            router.push(redirect)
          }
          else {
            toHome()
          }
        }
        catch {
          // 如果重定向路径无效，则导航到主页
          toHome()
        }
      }
      else {
        toHome()
      }
    }
    catch (e: any) {
      error.value = e?.response?.data?.detail || 'Login failed'
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    isLogin,
    logout,
    login,
  }
}
