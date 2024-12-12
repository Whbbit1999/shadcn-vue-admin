import { createApp } from 'vue'
import App from './App.vue'
import { setupPlugins } from './plugins'
import router from './router'
import './assets/index.css'

function bootstrap() {
  const app = createApp(App)

  setupPlugins(app)

  app.use(router)
  app.mount('#app')
}

bootstrap()