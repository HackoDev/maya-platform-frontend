/**
 * Example usage of the updated User Store with authApiClient integration
 */

import { useUserStore } from './user'

// Example 1: App initialization with stored authentication
export function initializeApp() {
  const userStore = useUserStore()
  
  // Initialize with stored token and user data
  const hasStoredAuth = userStore.initializeAuth()
  
  if (hasStoredAuth) {
    console.log('User is already authenticated:', userStore.currentUser)
    console.log('User display name:', userStore.userDisplayName)
    console.log('User type:', userStore.userTypeLabel)
  } else {
    console.log('No stored authentication found, user needs to login')
  }
  
  return hasStoredAuth
}

// Example 2: Login with real API
export async function loginUser(email: string, password: string) {
  const userStore = useUserStore()
  
  try {
    const response = await userStore.login(email, password)
    console.log('Login successful:', response)
    console.log('User data:', userStore.currentUser)
    console.log('Access token:', response.access_token)
    console.log('Token expires in:', response.expires_in, 'seconds')
    
    return { success: true, user: userStore.currentUser }
  } catch (error: any) {
    console.error('Login failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Example 3: Logout
export async function logoutUser() {
  const userStore = useUserStore()
  
  try {
    await userStore.logout()
    console.log('Logout successful')
    return { success: true }
  } catch (error: any) {
    console.error('Logout failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Example 4: Update user profile
export async function updateUserProfile() {
  const userStore = useUserStore()
  
  if (!userStore.currentUser) {
    console.log('No user logged in')
    return
  }
  
  try {
    // Update personal information
    const personalInfo = {
      firstName: 'Updated First Name',
      lastName: 'Updated Last Name',
      avatar: undefined // File object would go here
    }
    
    const personalResponse = await userStore.updatePersonalInfo(personalInfo)
    console.log('Personal info updated:', personalResponse)
    
    // Update contact information
    const contactInfo = {
      phone: '+7 (999) 123-45-67',
      whatsapp: '+7 (999) 123-45-67',
      telegram: '@updated_username'
    }
    
    const contactResponse = await userStore.updateContactInfo(contactInfo)
    console.log('Contact info updated:', contactResponse)
    
    // Update "Open to Offers" status (for specialists)
    if (userStore.currentUser.userType === 'specialist') {
      await userStore.updateOpenToOffers(true)
      console.log('Open to offers status updated')
    }
    
    // Sync user data
    userStore.syncUserData()
    console.log('User data synced')
    
  } catch (error: any) {
    console.error('Profile update failed:', error.message)
  }
}

// Example 5: Vue component usage
export function useUserInComponent() {
  const userStore = useUserStore()
  
  return {
    // Reactive user data
    currentUser: userStore.currentUser,
    isAuthenticated: userStore.isAuthenticated,
    loading: userStore.loading,
    error: userStore.error,
    
    // Computed properties
    userDisplayName: userStore.userDisplayName,
    userInitials: userStore.userInitials,
    userTypeLabel: userStore.userTypeLabel,
    
    // Actions
    login: userStore.login,
    logout: userStore.logout,
    updatePersonalInfo: userStore.updatePersonalInfo,
    updateContactInfo: userStore.updateContactInfo,
    updateOpenToOffers: userStore.updateOpenToOffers,
    updateUserData: userStore.updateUserData,
    syncUserData: userStore.syncUserData,
  }
}

// Example 6: Router guard integration
export function createAuthGuard() {
  return (to: any, _from: any, next: any) => {
    const userStore = useUserStore()
    
    // Initialize auth if not already done
    if (!userStore.isAuthenticated) {
      const hasStoredAuth = userStore.initializeAuth()
      if (!hasStoredAuth) {
        // Redirect to login if no stored auth
        next('/login')
        return
      }
    }
    
    // Check if route requires specific user type
    if (to.meta.requiresUserType && userStore.currentUser) {
      const requiredUserType = to.meta.requiresUserType
      if (userStore.currentUser.userType !== requiredUserType) {
        // Redirect to unauthorized page or home
        next('/unauthorized')
        return
      }
    }
    
    next()
  }
}

// Example 7: Error handling
export function handleAuthError(error: any) {
  const userStore = useUserStore()
  
  if (error.status === 401) {
    // Token expired or invalid
    console.log('Authentication expired, logging out')
    userStore.logout()
    // Redirect to login page
    return { shouldRedirect: true, route: '/login' }
  } else if (error.status === 403) {
    // Insufficient permissions
    console.log('Insufficient permissions')
    return { shouldRedirect: true, route: '/unauthorized' }
  } else {
    // Other errors
    console.error('Authentication error:', error.message)
    return { shouldRedirect: false, error: error.message }
  }
}

// Example 8: Real-time user data updates
export function setupUserDataSync() {
  const userStore = useUserStore()
  
  // Sync user data periodically or on specific events
  const syncInterval = setInterval(() => {
    if (userStore.isAuthenticated) {
      userStore.syncUserData()
    }
  }, 30000) // Sync every 30 seconds
  
  // Cleanup on unmount
  return () => {
    clearInterval(syncInterval)
  }
}
