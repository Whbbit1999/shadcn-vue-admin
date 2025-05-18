import type { App } from 'vue'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export function setupPinia(app: App) {
  const pinia = createPinia()

  const persistedState = createPersistedState({
    storage: sessionStorage,
  })

  pinia.use(persistedState)
  app.use(pinia)
}
