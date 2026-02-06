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
      if (!redirect || redirect.startsWith('//')) {
        toHome()
      }
      else {
        router.push(redirect)
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
