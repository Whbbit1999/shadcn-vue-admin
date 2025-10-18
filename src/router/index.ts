import type { RouteRecordRaw } from 'vue-router'

import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import { createRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes as RouteRecordRaw[]),

  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

createRouterGuard(router)

export default router

if (import.meta.hot) {
  handleHotUpdate(router)
}
