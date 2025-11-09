import type { App } from 'vue'

import router from '@/router'

export function setupRouter(app: App) {
  app.use(router)
}
