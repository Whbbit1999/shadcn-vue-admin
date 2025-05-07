import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/errors/404.vue'),
  },
] as RouteRecordRaw[]
