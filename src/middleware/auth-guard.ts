import { storeToRefs } from 'pinia'

import router from '@/router'
import { useAuthStore } from '@/stores/auth'

export default function authGuardMiddleware() {
  const authStore = useAuthStore()
  const { isLogin } = storeToRefs(authStore)

  router.beforeEach((to, _from) => {
    if (to.meta.auth && !unref(isLogin) && to.name !== 'auth/sign-in') {
      return { name: 'auth-sign-in' }
    }
  })
}
