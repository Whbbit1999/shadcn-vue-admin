import type { App } from 'vue'

import { setupAutoAnimate } from './auto-animate'
import { setupDayjs } from './dayjs'
import { setupI18n } from './i18n'
import { setupNProgress } from './nprogress'
import { setupPinia } from './pinia'
import { setupTanstackVueQuery } from './tanstack-vue-query'

export function setupPlugins(app: App) {
  setupDayjs()
  setupNProgress()
  setupAutoAnimate(app)
  setupTanstackVueQuery(app)
  setupI18n(app)
  setupPinia(app)
}
