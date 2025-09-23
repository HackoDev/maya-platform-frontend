/**
 * Logout with Redirect Utility
 * Provides a consistent way to logout and redirect to login page
 */

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useGlobalSession } from '@/composables/useSession'

/**
 * Logout and redirect to login page
 * This function ensures logout is completed before redirecting
 */
export async function logoutWithRedirect(redirectPath: string = '/login'): Promise<void> {
  const router = useRouter()
  const userStore = useUserStore()
  const session = useGlobalSession()

  try {
    console.log('🔄 Logging out and redirecting...')
    
    // Perform logout (this is async and will revoke tokens)
    await userStore.logout()
    
    // Also clear session state
    await session.logout()
    
    console.log('✅ Logout completed, redirecting to:', redirectPath)
    
    // Redirect to login page
    await router.push(redirectPath)
    
  } catch (error) {
    console.error('❌ Error during logout and redirect:', error)
    
    // Even if logout fails, try to redirect anyway
    try {
      await router.push(redirectPath)
    } catch (redirectError) {
      console.error('❌ Error during redirect:', redirectError)
      // Fallback: reload the page to go to login
      window.location.href = redirectPath
    }
  }
}

/**
 * Logout and redirect to login page (using session composable)
 * Alternative implementation using the session composable
 */
export async function logoutWithRedirectSession(redirectPath: string = '/login'): Promise<void> {
  const router = useRouter()
  const session = useGlobalSession()

  try {
    console.log('🔄 Logging out via session and redirecting...')
    
    // Perform logout through session (this handles everything)
    await session.logout()
    
    console.log('✅ Session logout completed, redirecting to:', redirectPath)
    
    // Redirect to login page
    await router.push(redirectPath)
    
  } catch (error) {
    console.error('❌ Error during session logout and redirect:', error)
    
    // Even if logout fails, try to redirect anyway
    try {
      await router.push(redirectPath)
    } catch (redirectError) {
      console.error('❌ Error during redirect:', redirectError)
      // Fallback: reload the page to go to login
      window.location.href = redirectPath
    }
  }
}

/**
 * Logout and redirect with custom redirect path
 * Allows specifying where to redirect after logout
 */
export async function logoutWithCustomRedirect(redirectPath: string): Promise<void> {
  return logoutWithRedirect(redirectPath)
}

/**
 * Logout and redirect to home page
 * Useful for cases where you want to redirect to home instead of login
 */
export async function logoutWithHomeRedirect(): Promise<void> {
  return logoutWithRedirect('/')
}

/**
 * Logout and redirect to current page (refresh)
 * Useful for cases where you want to refresh the current page after logout
 */
export async function logoutWithRefresh(): Promise<void> {
  const router = useRouter()
  const userStore = useUserStore()
  const session = useGlobalSession()

  try {
    console.log('🔄 Logging out and refreshing page...')
    
    // Perform logout
    await userStore.logout()
    await session.logout()
    
    console.log('✅ Logout completed, refreshing page')
    
    // Refresh the current page
    window.location.reload()
    
  } catch (error) {
    console.error('❌ Error during logout and refresh:', error)
    
    // Fallback: reload the page anyway
    window.location.reload()
  }
}

/**
 * Vue composable for logout with redirect
 * Can be used in Vue components
 */
export function useLogoutWithRedirect() {
  const router = useRouter()
  const userStore = useUserStore()
  const session = useGlobalSession()

  const logoutAndRedirect = async (redirectPath: string = '/login'): Promise<void> => {
    return logoutWithRedirect(redirectPath)
  }

  const logoutAndRedirectToHome = async (): Promise<void> => {
    return logoutWithHomeRedirect()
  }

  const logoutAndRefresh = async (): Promise<void> => {
    return logoutWithRefresh()
  }

  return {
    logoutAndRedirect,
    logoutAndRedirectToHome,
    logoutAndRefresh,
  }
}

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  (window as any).logoutWithRedirect = {
    logoutWithRedirect,
    logoutWithRedirectSession,
    logoutWithCustomRedirect,
    logoutWithHomeRedirect,
    logoutWithRefresh,
  }
}


