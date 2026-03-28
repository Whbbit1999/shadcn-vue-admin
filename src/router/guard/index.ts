import type { Router } from 'vue-router'

import { setupAuthGuard } from './auth-guard'
import { setupCommonGuard } from './common-guard'

export function useRouterGuard(router: Router) {
  setupCommonGuard(router)
  setupAuthGuard(router)
}
