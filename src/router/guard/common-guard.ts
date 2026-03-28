import type { Router } from 'vue-router'

import nprogress from 'nprogress'

/**
 * global router guard
 * now only used for progress bar
 */
export function setupCommonGuard(router: Router) {
  router.beforeEach(() => {
    nprogress.start()
    return true
  })

  router.afterEach(() => {
    nprogress.done()
    return true
  })
}
