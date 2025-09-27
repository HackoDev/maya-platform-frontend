/**
 * Session Management Composable
 * Handles session persistence, token validation, and automatic session restoration
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { authApi } from '@/services/authApiClient'

export interface SessionState {
  currentUser: any | null
  isInitialized: boolean
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export function useSession() {
  const userStore = useUserStore()
  const themeStore = useThemeStore()
  
  // Session state
  const sessionState = ref<SessionState>({
    currentUser: null,
    isInitialized: false,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Computed properties
  const currentUser = computed(() => userStore.currentUser)
  const isAuthenticated = computed(() => sessionState.value.isAuthenticated)
  const isInitialized = computed(() => sessionState.value.isInitialized)
  const isLoading = computed(() => sessionState.value.isLoading)
  const error = computed(() => sessionState.value.error)

  // Token validation interval
  let tokenValidationInterval: number | null = null

  /**
   * Initialize session from stored data
   */
  const initializeSession = async (): Promise<boolean> => {
    try {
      sessionState.value.isLoading = true
      sessionState.value.error = null

      console.log('🔄 Initializing session...')

      // Try to restore session from localStorage
      const hasStoredAuth = userStore.initializeAuth()
      
      if (hasStoredAuth) {
        // Validate the stored token by making a test request
        const isValid = await validateStoredToken()
        
        if (isValid) {
          // Get the current user from authApi
          const storedUser = authApi.getCurrentUser()
          if (storedUser) {
            sessionState.value.currentUser = storedUser
          }
          
          sessionState.value.isAuthenticated = true
          sessionState.value.isInitialized = true
          
          // Force sync with user store to ensure consistency
          syncWithUserStore()
          
          // Activate user's preferred theme
          activateUserTheme(storedUser)
          
          console.log('✅ Session restored successfully')
          
          // Start token validation
          startTokenValidation()
          
          return true
        } else {
          // Token is invalid, clear it
          console.log('⚠️ Stored token is invalid, clearing session')
          await clearSession()
        }
      }

      sessionState.value.isAuthenticated = false
      sessionState.value.isInitialized = true
      console.log('ℹ️ No valid session found')
      
      return false
    } catch (error) {
      console.error('❌ Error initializing session:', error)
      sessionState.value.error = error instanceof Error ? error.message : 'Session initialization failed'
      sessionState.value.isInitialized = true
      sessionState.value.isAuthenticated = false
      return false
    } finally {
      sessionState.value.isLoading = false
    }
  }

  /**
   * Validate stored token by making a test request
   */
  const validateStoredToken = async (): Promise<boolean> => {
    try {
      // Make a simple authenticated request to validate the token
      await authApi.get('/api/web/users/me')
      return true
    } catch (error: any) {
      console.log('Token validation failed:', error.status, error.message)
      return false
    }
  }

  /**
   * Activate user's preferred theme
   */
  const activateUserTheme = (user: any): void => {
    try {
      // Use the new method that handles fallback to dark theme
      themeStore.initializeFromUserPreference(user?.uiTheme)
      console.log(`🎨 Activated user theme: ${user?.uiTheme || 'dark (default)'}`)
    } catch (error) {
      console.error('❌ Error activating user theme:', error)
      // Fallback to dark theme
      themeStore.setTheme('dark')
    }
  }

  /**
   * Login and establish session
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      sessionState.value.isLoading = true
      sessionState.value.error = null

      const response = await userStore.login(email, password)
      
      if (response) {
        sessionState.value.currentUser = response.user
        sessionState.value.isAuthenticated = true
        sessionState.value.isInitialized = true
        
        // Force sync with user store to ensure consistency
        syncWithUserStore()
        
        // Activate user's preferred theme
        activateUserTheme(response.user)
        
        // Start token validation
        startTokenValidation()
        
        console.log('✅ Login successful')
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      sessionState.value.error = error.message || 'Login failed'
      return false
    } finally {
      sessionState.value.isLoading = false
    }
  }

  /**
   * Logout and clear session
   */
  const logout = async (): Promise<void> => {
    try {
      sessionState.value.isLoading = true
      
      // Stop token validation
      stopTokenValidation()
      
      // Clear session
      await clearSession()
      
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error)
    } finally {
      sessionState.value.isLoading = false
    }
  }

  /**
   * Clear session data
   */
  const clearSession = async (): Promise<void> => {
    try {
      await userStore.logout()
      sessionState.value.currentUser = null
      sessionState.value.isAuthenticated = false
      sessionState.value.error = null
    } catch (error) {
      console.warn('Error during session clear:', error)
    }
  }

  /**
   * Force synchronization between user store and session state
   */
  const syncWithUserStore = (): void => {
    try {
      // Sync current user
      if (userStore.currentUser) {
        sessionState.value.currentUser = userStore.currentUser
      }
      
      // Sync authentication state
      sessionState.value.isAuthenticated = !!userStore.currentUser
      
      console.log('🔄 Session synchronized with user store')
    } catch (error) {
      console.error('❌ Error syncing with user store:', error)
    }
  }

  /**
   * Start periodic token validation
   */
  const startTokenValidation = (): void => {
    // Validate token every 5 minutes
    tokenValidationInterval = setInterval(async () => {
      if (sessionState.value.isAuthenticated) {
        const isValid = await validateStoredToken()
        if (!isValid) {
          console.log('🔄 Token expired, clearing session')
          await clearSession()
        }
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  /**
   * Stop token validation
   */
  const stopTokenValidation = (): void => {
    if (tokenValidationInterval) {
      clearInterval(tokenValidationInterval)
      tokenValidationInterval = null
    }
  }

  /**
   * Refresh session data
   */
  const refreshSession = async (): Promise<boolean> => {
    try {
      if (!sessionState.value.isAuthenticated) {
        return false
      }

      // Sync user data
      userStore.syncUserData()
      
      // Validate token
      const isValid = await validateStoredToken()
      if (!isValid) {
        await clearSession()
        return false
      }

      return true
    } catch (error) {
      console.error('❌ Error refreshing session:', error)
      return false
    }
  }

  /**
   * Handle token refresh
   */
  const handleTokenRefresh = async (): Promise<boolean> => {
    try {
      await authApi.refreshToken()
      console.log('✅ Token refreshed successfully')
      return true
    } catch (error) {
      console.log('❌ Token refresh failed:', error)
      await clearSession()
      return false
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    // Initialize session when composable is mounted
    if (!sessionState.value.isInitialized) {
      initializeSession()
    }
  })

  onUnmounted(() => {
    // Clean up token validation interval
    stopTokenValidation()
  })

  return {
    // State
    sessionState: computed(() => sessionState.value),
    currentUser,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,

    // Actions
    initializeSession,
    login,
    logout,
    refreshSession,
    handleTokenRefresh,
    clearSession,
    syncWithUserStore,
  }
}

/**
 * Global session instance for app-wide use
 */
let globalSession: ReturnType<typeof useSession> | null = null

export function useGlobalSession() {
  if (!globalSession) {
    globalSession = useSession()
  }
  return globalSession
}
