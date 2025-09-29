import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { useGlobalSession } from './composables/useSession'
import { usePortfolioCatalogStore } from './stores/portfolio-catalog'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize stores
const themeStore = useThemeStore()
const session = useGlobalSession()
const portfolioCatalog = usePortfolioCatalogStore()

// Initialize theme system
themeStore.initializeTheme()

// Initialize authentication (restore session from localStorage)
const initializeApp = async () => {
  try {
    console.log('🚀 Initializing app...')
    
    // Initialize session (restores token, fetches fresh user via API)
    const hasAuth = await session.initializeSession()
    
    if (hasAuth) {
      console.log('✅ User session restored (fresh user fetched)')
      console.log('👤 Current user:', session.currentUser.value?.name)
    } else {
      console.log('ℹ️ No stored session found, user needs to login')
    }
    
    // Preload portfolio catalog (skills, specializations, services)
    await portfolioCatalog.initialize()

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
