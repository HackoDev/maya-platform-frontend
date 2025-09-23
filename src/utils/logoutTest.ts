/**
 * Logout Test Utility
 * Provides functions to test the logout flow and verify token revocation
 */

import { authApi, type LoginCredentials } from '@/services/authApiClient'
import { useGlobalSession } from '@/composables/useSession'

/**
 * Test the complete logout flow
 */
export async function testLogoutFlow() {
  console.log('🧪 Testing logout flow...')
  
  try {
    // Check if user is currently authenticated
    const isAuthenticated = authApi.isAuthenticated()
    console.log('Current authentication status:', isAuthenticated)
    
    if (!isAuthenticated) {
      console.log('ℹ️ User is not authenticated, skipping logout test')
      return { success: true, message: 'User not authenticated, no logout needed' }
    }
    
    // Get current user info
    const currentUser = authApi.getCurrentUser()
    console.log('Current user:', currentUser?.name || 'Unknown')
    
    // Get current tokens (for verification)
    const accessToken = authApi.getToken()
    const hasRefreshToken = !!localStorage.getItem('auth_refresh_token')
    
    console.log('Access token exists:', !!accessToken)
    console.log('Refresh token exists:', hasRefreshToken)
    
    // Perform logout
    console.log('🔄 Performing logout...')
    await authApi.logout()
    
    // Verify tokens are cleared
    const tokenAfterLogout = authApi.getToken()
    const userAfterLogout = authApi.getCurrentUser()
    const isAuthenticatedAfterLogout = authApi.isAuthenticated()
    const refreshTokenAfterLogout = !!localStorage.getItem('auth_refresh_token')
    
    console.log('After logout:')
    console.log('- Access token exists:', !!tokenAfterLogout)
    console.log('- Refresh token exists:', refreshTokenAfterLogout)
    console.log('- User data exists:', !!userAfterLogout)
    console.log('- Is authenticated:', isAuthenticatedAfterLogout)
    
    // Verify all tokens and user data are cleared
    const allCleared = !tokenAfterLogout && !refreshTokenAfterLogout && !userAfterLogout && !isAuthenticatedAfterLogout
    
    if (allCleared) {
      console.log('✅ Logout test passed - all tokens and user data cleared')
      return { success: true, message: 'Logout successful, all data cleared' }
    } else {
      console.log('❌ Logout test failed - some data not cleared')
      return { 
        success: false, 
        message: 'Logout failed - some tokens or user data not cleared',
        details: {
          accessToken: !!tokenAfterLogout,
          refreshToken: refreshTokenAfterLogout,
          userData: !!userAfterLogout,
          isAuthenticated: isAuthenticatedAfterLogout
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Logout test error:', error)
    return { 
      success: false, 
      message: 'Logout test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test logout with session composable
 */
export async function testLogoutWithSession() {
  console.log('🧪 Testing logout with session composable...')
  
  try {
    const session = useGlobalSession()
    
    // Check current session state
    console.log('Current session state:')
    console.log('- Is authenticated:', session.isAuthenticated.value)
    console.log('- Current user:', session.currentUser.value?.name || 'None')
    console.log('- Is loading:', session.isLoading.value)
    
    if (!session.isAuthenticated.value) {
      console.log('ℹ️ Session not authenticated, skipping logout test')
      return { success: true, message: 'Session not authenticated, no logout needed' }
    }
    
    // Perform logout through session
    console.log('🔄 Performing logout through session...')
    await session.logout()
    
    // Verify session state after logout
    console.log('After logout:')
    console.log('- Is authenticated:', session.isAuthenticated.value)
    console.log('- Current user:', session.currentUser.value?.name || 'None')
    console.log('- Is loading:', session.isLoading.value)
    
    const sessionCleared = !session.isAuthenticated.value && !session.currentUser.value
    
    if (sessionCleared) {
      console.log('✅ Session logout test passed')
      return { success: true, message: 'Session logout successful' }
    } else {
      console.log('❌ Session logout test failed')
      return { 
        success: false, 
        message: 'Session logout failed',
        details: {
          isAuthenticated: session.isAuthenticated.value,
          hasUser: !!session.currentUser.value
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Session logout test error:', error)
    return { 
      success: false, 
      message: 'Session logout test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test complete login and logout cycle
 */
export async function testLoginLogoutCycle(credentials: LoginCredentials) {
  console.log('🧪 Testing complete login and logout cycle...')
  
  try {
    // Step 1: Login
    console.log('🔄 Step 1: Login...')
    const loginResponse = await authApi.login(credentials)
    console.log('Login successful:', loginResponse.user.name)
    
    // Verify authentication
    const isAuthenticated = authApi.isAuthenticated()
    const currentUser = authApi.getCurrentUser()
    console.log('After login - Is authenticated:', isAuthenticated)
    console.log('After login - Current user:', currentUser?.name)
    
    if (!isAuthenticated || !currentUser) {
      throw new Error('Login verification failed')
    }
    
    // Step 2: Logout
    console.log('🔄 Step 2: Logout...')
    await authApi.logout()
    
    // Verify logout
    const isAuthenticatedAfterLogout = authApi.isAuthenticated()
    const currentUserAfterLogout = authApi.getCurrentUser()
    console.log('After logout - Is authenticated:', isAuthenticatedAfterLogout)
    console.log('After logout - Current user:', currentUserAfterLogout?.name || 'None')
    
    const logoutSuccessful = !isAuthenticatedAfterLogout && !currentUserAfterLogout
    
    if (logoutSuccessful) {
      console.log('✅ Login and logout cycle test passed')
      return { success: true, message: 'Complete cycle test successful' }
    } else {
      console.log('❌ Login and logout cycle test failed')
      return { 
        success: false, 
        message: 'Logout verification failed',
        details: {
          isAuthenticated: isAuthenticatedAfterLogout,
          hasUser: !!currentUserAfterLogout
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Login and logout cycle test error:', error)
    return { 
      success: false, 
      message: 'Login and logout cycle test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Run all logout tests
 */
export async function runAllLogoutTests(credentials?: LoginCredentials) {
  console.log('🚀 Running all logout tests...')
  
  const results = []
  
  // Test 1: Basic logout flow
  console.log('\n--- Test 1: Basic Logout Flow ---')
  const basicLogoutResult = await testLogoutFlow()
  results.push({ test: 'Basic Logout Flow', ...basicLogoutResult })
  
  // Test 2: Session logout
  console.log('\n--- Test 2: Session Logout ---')
  const sessionLogoutResult = await testLogoutWithSession()
  results.push({ test: 'Session Logout', ...sessionLogoutResult })
  
  // Test 3: Complete cycle (if credentials provided)
  if (credentials) {
    console.log('\n--- Test 3: Complete Login/Logout Cycle ---')
    const cycleResult = await testLoginLogoutCycle(credentials)
    results.push({ test: 'Complete Cycle', ...cycleResult })
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:')
  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.test}: ${result.message}`)
    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`)
    }
  })
  
  const allPassed = results.every(result => result.success)
  console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall result: ${allPassed ? 'All tests passed' : 'Some tests failed'}`)
  
  return {
    allPassed,
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  }
}

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  (window as any).logoutTests = {
    testLogoutFlow,
    testLogoutWithSession,
    testLoginLogoutCycle,
    runAllLogoutTests
  }
}


