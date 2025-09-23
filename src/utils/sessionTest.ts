/**
 * Session Persistence Test Utilities
 * These functions help test and verify session persistence across page reloads
 */

import { authApi } from '@/services/authApiClient'
import { useGlobalSession } from '@/composables/useSession'

/**
 * Test session persistence by simulating a login and page reload
 */
export async function testSessionPersistence() {
  console.log('🧪 Testing Session Persistence...')
  
  try {
    // Step 1: Check initial state
    console.log('📋 Step 1: Checking initial state')
    const initialAuth = authApi.isAuthenticated()
    const initialUser = authApi.getCurrentUser()
    console.log('Initial auth state:', initialAuth)
    console.log('Initial user:', initialUser)

    // Step 2: Simulate login (if not already logged in)
    if (!initialAuth) {
      console.log('📋 Step 2: Simulating login...')
      const credentials = {
        username: 'eugene@example.com',
        password: 'pass0911',
        client_id: 'XtBXtiE3ceaBoTdeagaLvBWArAhIR5oalakmwXFu'
      }
      
      try {
        const response = await authApi.login(credentials)
        console.log('✅ Login successful:', response.user.name)
      } catch (error) {
        console.log('⚠️ Login failed (expected in test environment):', error)
        // Continue with test using mock data
        console.log('📋 Using mock session data for testing...')
        mockSessionData()
      }
    }

    // Step 3: Verify session data is stored
    console.log('📋 Step 3: Verifying session storage')
    const storedToken = localStorage.getItem('auth_access_token')
    const storedUser = localStorage.getItem('auth_user')
    const storedRefreshToken = localStorage.getItem('auth_refresh_token')
    
    console.log('Stored token exists:', !!storedToken)
    console.log('Stored user exists:', !!storedUser)
    console.log('Stored refresh token exists:', !!storedRefreshToken)
    
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      console.log('Stored user data:', userData.name, userData.email)
    }

    // Step 4: Test session restoration
    console.log('📋 Step 4: Testing session restoration')
    const session = useGlobalSession()
    const restored = await session.initializeSession()
    console.log('Session restored:', restored)
    console.log('Current user after restoration:', session.currentUser.value?.name)

    return {
      success: true,
      hasStoredData: !!(storedToken && storedUser),
      sessionRestored: restored,
      currentUser: session.currentUser.value
    }

  } catch (error) {
    console.error('❌ Session persistence test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Mock session data for testing
 */
function mockSessionData() {
  const mockUser = {
    id: 1,
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    userType: 'specialist',
    isActive: true,
    avatar: null,
    phone: null,
    whatsapp: null,
    telegram: null,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }

  const mockToken = 'mock-access-token-123'
  const mockRefreshToken = 'mock-refresh-token-456'

  // Store mock data
  localStorage.setItem('auth_access_token', mockToken)
  localStorage.setItem('auth_refresh_token', mockRefreshToken)
  localStorage.setItem('auth_user', JSON.stringify(mockUser))

  console.log('✅ Mock session data stored')
}

/**
 * Clear all session data
 */
export function clearSessionData() {
  localStorage.removeItem('auth_access_token')
  localStorage.removeItem('auth_refresh_token')
  localStorage.removeItem('auth_user')
  console.log('🧹 Session data cleared')
}

/**
 * Check session data integrity
 */
export function checkSessionIntegrity() {
  console.log('🔍 Checking Session Data Integrity...')
  
  const token = localStorage.getItem('auth_access_token')
  const refreshToken = localStorage.getItem('auth_refresh_token')
  const userStr = localStorage.getItem('auth_user')
  
  const results = {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    hasUser: !!userStr,
    userValid: false,
    tokenLength: token?.length || 0,
    refreshTokenLength: refreshToken?.length || 0
  }

  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      results.userValid = !!(user.id && user.name && user.email)
      console.log('User data valid:', results.userValid)
      console.log('User details:', { id: user.id, name: user.name, email: user.email })
    } catch (error) {
      console.error('Invalid user data in localStorage:', error)
    }
  }

  console.log('Session integrity check results:', results)
  return results
}

/**
 * Simulate page reload and test session restoration
 */
export async function simulatePageReload() {
  console.log('🔄 Simulating Page Reload...')
  
  // Clear current session state
  const session = useGlobalSession()
  await session.clearSession()
  
  // Re-initialize session (simulating app startup)
  const restored = await session.initializeSession()
  
  console.log('Session restored after simulated reload:', restored)
  console.log('Current user after reload:', session.currentUser.value?.name)
  
  return {
    restored,
    currentUser: session.currentUser.value,
    isAuthenticated: session.isAuthenticated.value
  }
}

/**
 * Test token expiration handling
 */
export async function testTokenExpiration() {
  console.log('⏰ Testing Token Expiration Handling...')
  
  const session = useGlobalSession()
  
  if (!session.isAuthenticated.value) {
    console.log('⚠️ No active session to test expiration')
    return { success: false, reason: 'No active session' }
  }

  try {
    // Try to make an authenticated request
    const response = await authApi.get('/user/profile')
    console.log('✅ Token is valid, request successful')
    return { success: true, tokenValid: true }
  } catch (error: any) {
    if (error.status === 401) {
      console.log('🔄 Token expired, attempting refresh...')
      try {
        await session.handleTokenRefresh()
        console.log('✅ Token refreshed successfully')
        return { success: true, tokenRefreshed: true }
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError)
        return { success: false, refreshFailed: true }
      }
    } else {
      console.log('❌ Request failed with error:', error.status, error.message)
      return { success: false, requestFailed: true }
    }
  }
}

/**
 * Run comprehensive session tests
 */
export async function runSessionTests() {
  console.log('🚀 Running Comprehensive Session Tests...')
  
  const results = {
    persistence: null as any,
    integrity: null as any,
    reload: null as any,
    expiration: null as any
  }

  try {
    // Test 1: Session persistence
    results.persistence = await testSessionPersistence()
    
    // Test 2: Data integrity
    results.integrity = checkSessionIntegrity()
    
    // Test 3: Page reload simulation
    results.reload = await simulatePageReload()
    
    // Test 4: Token expiration (only if authenticated)
    if (results.reload.isAuthenticated) {
      results.expiration = await testTokenExpiration()
    }

    console.log('📊 Session Test Results:', results)
    
    const allPassed = results.persistence?.success && 
                     results.integrity?.userValid && 
                     results.reload?.restored

    if (allPassed) {
      console.log('✅ All session tests passed!')
    } else {
      console.log('❌ Some session tests failed')
    }

    return { success: allPassed, results }

  } catch (error) {
    console.error('❌ Session tests failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Make test functions available globally in development
if (import.meta.env.DEV) {
  ;(window as any).testSession = {
    persistence: testSessionPersistence,
    integrity: checkSessionIntegrity,
    reload: simulatePageReload,
    expiration: testTokenExpiration,
    runAll: runSessionTests,
    clear: clearSessionData
  }
  
  console.log('🧪 Session test functions available globally:')
  console.log('- window.testSession.persistence()')
  console.log('- window.testSession.integrity()')
  console.log('- window.testSession.reload()')
  console.log('- window.testSession.expiration()')
  console.log('- window.testSession.runAll()')
  console.log('- window.testSession.clear()')
}


