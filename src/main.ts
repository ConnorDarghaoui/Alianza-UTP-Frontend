import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import { useAuthStore } from '@/store/auth.store'
import App   from '@/App.vue'
import '@/style.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  
  app.use(pinia).use(router)
  
  // Attempt to auto-login and fetch user profile if a token exists
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    await authStore.fetchUserProfile()
  }
  
  app.mount('#app')
}

bootstrap().catch(console.error)
