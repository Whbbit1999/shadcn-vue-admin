import { setupLayouts } from 'virtual:generated-layouts'
import { createWebHistory } from 'vue-router'
import { createRouter } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import { createRouterGuard } from './guard'
import publicRoutes from './public-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [...setupLayouts(routes), ...publicRoutes],

  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

createRouterGuard(router)

export default router

if (import.meta.hot) {
  handleHotUpdate(router)
}
