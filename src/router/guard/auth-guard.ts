import type { Router } from 'vue-router'

import { storeToRefs } from 'pinia'

import pinia from '@/plugins/pinia/setup'
import { useAuthStore } from '@/stores/auth'

export function setupAuthGuard(router: Router) {
  router.beforeEach((to, from) => {
    const authStore = useAuthStore(pinia)
    const { isLogin } = storeToRefs(authStore)

    const isAuthPage = ['/auth/sign-in', '/auth/sign-up'].includes(to.path)

    // If logged in, redirect from auth pages to the previous page (if valid), otherwise redirect to home
    if (isLogin.value && isAuthPage) {
      // Check if from route is valid (has path and is different from target)
      if (from.path && from.path !== to.path) {
        return from
      }
      // Fallback: redirect to home on first visit or invalid source
      return { path: '/' }
    }

    // If page requires auth but user is not logged in, redirect to sign-in page
    if (to.meta.auth && !isLogin.value && !isAuthPage) {
      return {
        name: '/auth/sign-in',
        query: { redirect: to.fullPath },
      }
    }
  })
}
