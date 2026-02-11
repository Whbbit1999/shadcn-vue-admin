import type { RouteRecordRaw } from 'vue-router'

import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import { setGlobalRouter } from '@/composables/use-axios'

import { createRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes as RouteRecordRaw[]),

  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

// 设置全局路由器实例，以便在axios拦截器中使用
setGlobalRouter(router)

createRouterGuard(router)

export default router

if (import.meta.hot) {
  handleHotUpdate(router)
}
