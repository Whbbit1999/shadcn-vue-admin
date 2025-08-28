import type { App } from 'vue'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

const persistedState = createPersistedState({
  storage: sessionStorage,
})
pinia.use(persistedState)

export function setupPinia(app: App) {
  app.use(pinia)
}

export default pinia
