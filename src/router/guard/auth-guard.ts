import type { Router } from 'vue-router'

import { storeToRefs } from 'pinia'

import pinia from '@/plugins/pinia'
import { useAuthStore } from '@/stores/auth'

export function authGuard(router: Router) {
  router.beforeEach((to, _from) => {
    const authStore = useAuthStore(pinia)
    const { isLogin } = storeToRefs(authStore)

    if (to.meta.auth && !unref(isLogin) && to.name !== '/auth/sign-in') {
      return { name: '/auth/sign-in' }
    }
  })
}
