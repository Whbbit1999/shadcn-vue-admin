import type { Router } from 'vue-router'

import nprogress from 'nprogress'

/**
 * global router guard
 * now only used for progress bar
 */
export function setupCommonGuard(router: Router) {
  router.beforeEach(() => {
    nprogress.start()
  })

  router.afterEach(() => {
    nprogress.done()
  })
}
