import type { App } from 'vue'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

export function setupPinia(app: App) {
  const persistedState = createPersistedState({
    storage: sessionStorage,
  })

  pinia.use(persistedState)
  app.use(pinia)
}

export default pinia
