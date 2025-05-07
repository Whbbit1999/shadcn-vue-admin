import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from '~pages'
import { createRouterGuard } from './guard'
import publicRoutes from './public-routes'

const routes = setupLayouts(generatedRoutes)
const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...publicRoutes],
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

createRouterGuard(router)

export default router
