// import generatedRoutes from '~pages'
import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-duplicates
import { createWebHistory } from 'vue-router'
// eslint-disable-next-line import/no-duplicates
import { createRouter } from 'vue-router/auto'
// eslint-disable-next-line import/no-duplicates
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
