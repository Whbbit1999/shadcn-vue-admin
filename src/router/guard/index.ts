import type { Router } from 'vue-router'

import nprogress from 'nprogress'

import { authGuard } from './auth-guard'

/**
 * global router guard
 * now only used for progress bar
 */
function setupCommonGuard(router: Router) {
  router.beforeEach(() => {
    nprogress.start()
    return true
  })
  router.afterEach(() => {
    nprogress.done()
    return true
  })
}

export function createRouterGuard(router: Router) {
  setupCommonGuard(router)
  authGuard(router)
}
