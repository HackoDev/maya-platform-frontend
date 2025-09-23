import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { useGlobalSession } from './composables/useSession'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize stores
const themeStore = useThemeStore()
const session = useGlobalSession()

// Initialize theme system
themeStore.initializeTheme()

// Initialize authentication (restore session from localStorage)
const initializeApp = async () => {
  try {
    console.log('🚀 Initializing app...')
    
    // Initialize session (includes authentication restoration)
    const hasAuth = await session.initializeSession()
    
    if (hasAuth) {
      console.log('✅ User session restored from localStorage')
      console.log('👤 Current user:', session.currentUser.value?.name)
    } else {
      console.log('ℹ️ No stored session found, user needs to login')
    }
    
    // Mount the app
    app.mount('#app')
    
  } catch (error) {
    console.error('❌ Error initializing app:', error)
    // Mount app anyway to show error state
    app.mount('#app')
  }
}

// Initialize the app
initializeApp()
