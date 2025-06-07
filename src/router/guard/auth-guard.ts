import type { Router } from 'vue-router'

import { storeToRefs } from 'pinia'

import pinia from '@/plugins/pinia'
import { useAuthStore } from '@/stores/auth'

export function authGuard(router: Router) {
  const authStore = useAuthStore(pinia)
  const { isLogin } = storeToRefs(authStore)

  router.beforeEach((to, _from) => {
    if (to.meta.auth && !unref(isLogin) && to.name !== '/auth/sign-in') {
      return { name: '/auth/sign-in' }
    }
  })
}
