import type { Router } from 'vue-router'

import { startProgress, stopProgress } from '@/utils/nprogress'

/**
 * global router guard
 * now only used for progress bar
 */
function setupCommonGuard(router: Router) {
  router.beforeEach(() => {
    startProgress()
    return true
  })
  router.afterEach(() => {
    stopProgress()
    return true
  })
}

export function createRouterGuard(router: Router) {
  setupCommonGuard(router)
}
