import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const router = useRouter()

  const authStore = useAuthStore()
  const { isLogin } = storeToRefs(authStore)
  const loading = ref(false)

  function logout() {
    isLogin.value = false

    router.push({ path: '/auth/sign-in' })
  }

  function toHome() {
    router.push({ path: '/workspace' })
  }

  async function login() {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    // mock login
    isLogin.value = true
    loading.value = false

    const redirect = router.currentRoute.value.query.redirect as string
    if (!redirect || redirect.startsWith('//')) {
      toHome()
    }
    else {
      router.push(redirect)
    }
  }

  return {
    loading,
    logout,
    login,
  }
}
