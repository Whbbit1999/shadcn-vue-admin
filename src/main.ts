import { createApp } from 'vue'

import App from './App.vue'
import { setupPlugins } from './plugins'

import '@/assets/index.css'
import '@/assets/scrollbar.css'
import '@/assets/themes.css'
import '@/assets/chart-theme.css'
import 'vue-sonner/style.css' // vue sonner style

import '@/utils/env'

function bootstrap() {
  const app = createApp(App)

  setupPlugins(app)

  app.mount('#app')
}

bootstrap()
