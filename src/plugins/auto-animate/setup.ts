import type { App } from 'vue'

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

export function setupAutoAnimate(app: App) {
  app.use(autoAnimatePlugin)
}
