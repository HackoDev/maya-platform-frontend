/**
 * Authentication State Synchronization Test Utility
 * Tests that authentication state is properly synchronized across components
 */

import { useUserStore } from '@/stores/user'
import { useGlobalSession } from '@/composables/useSession'
import type { LoginCredentials } from '@/services/authApiClient'

/**
 * Test authentication state synchronization between user store and session
 */
export async function testAuthStateSync(): Promise<{ success: boolean; message: string }> {
  console.log('🧪 Testing authentication state synchronization...')
  
  try {
    const userStore = useUserStore()
    const session = useGlobalSession()
    
    // Check initial state
    console.log('Initial state:')
    console.log('- UserStore isAuthenticated:', !!userStore.currentUser)
    console.log('- Session isAuthenticated:', session.isAuthenticated.value)
    console.log('- UserStore currentUser:', userStore.currentUser?.name || 'None')
    console.log('- Session currentUser:', session.currentUser.value?.name || 'None')
    
    // Check if states are synchronized
    const userStoreAuth = !!userStore.currentUser
    const sessionAuth = session.isAuthenticated.value
    const userStoreUser = userStore.currentUser
    const sessionUser = session.currentUser.value
    
    const authStatesMatch = userStoreAuth === sessionAuth
    const userDataMatches = userStoreUser?.id === sessionUser?.id && 
                           userStoreUser?.email === sessionUser?.email
    
    if (authStatesMatch && userDataMatches) {
      console.log('✅ Authentication states are synchronized')
      return { 
        success: true, 
        message: 'Authentication states are properly synchronized' 
      }
    } else {
      console.log('❌ Authentication states are not synchronized')
      console.log('- Auth states match:', authStatesMatch)
      console.log('- User data matches:', userDataMatches)
      return { 
        success: false, 
        message: 'Authentication states are not synchronized',
        details: {
          authStatesMatch,
          userDataMatches,
          userStoreAuth,
          sessionAuth,
          userStoreUserId: userStoreUser?.id,
          sessionUserId: sessionUser?.id
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Auth state sync test error:', error)
    return { 
      success: false, 
      message: 'Auth state sync test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test authentication state after login
 */
export async function testAuthStateAfterLogin(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
  console.log('🧪 Testing authentication state after login...')
  
  try {
    const userStore = useUserStore()
    const session = useGlobalSession()
    
    // Perform login
    console.log('🔄 Performing login...')
    const loginResponse = await userStore.login(credentials.username, credentials.password)
    
    if (!loginResponse) {
      return { 
        success: false, 
        message: 'Login failed' 
      }
    }
    
    console.log('✅ Login successful')
    
    // Wait a bit for state to propagate
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Check state after login
    console.log('State after login:')
    console.log('- UserStore isAuthenticated:', !!userStore.currentUser)
    console.log('- Session isAuthenticated:', session.isAuthenticated.value)
    console.log('- UserStore currentUser:', userStore.currentUser?.name || 'None')
    console.log('- Session currentUser:', session.currentUser.value?.name || 'None')
    
    // Check synchronization
    const userStoreAuth = !!userStore.currentUser
    const sessionAuth = session.isAuthenticated.value
    const userStoreUser = userStore.currentUser
    const sessionUser = session.currentUser.value
    
    const authStatesMatch = userStoreAuth === sessionAuth
    const userDataMatches = userStoreUser?.id === sessionUser?.id && 
                           userStoreUser?.email === sessionUser?.email
    
    if (authStatesMatch && userDataMatches && sessionAuth) {
      console.log('✅ Authentication states are synchronized after login')
      return { 
        success: true, 
        message: 'Authentication states are properly synchronized after login' 
      }
    } else {
      console.log('❌ Authentication states are not synchronized after login')
      return { 
        success: false, 
        message: 'Authentication states are not synchronized after login',
        details: {
          authStatesMatch,
          userDataMatches,
          userStoreAuth,
          sessionAuth,
          userStoreUserId: userStoreUser?.id,
          sessionUserId: sessionUser?.id
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Auth state after login test error:', error)
    return { 
      success: false, 
      message: 'Auth state after login test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test authentication state after logout
 */
export async function testAuthStateAfterLogout(): Promise<{ success: boolean; message: string }> {
  console.log('🧪 Testing authentication state after logout...')
  
  try {
    const userStore = useUserStore()
    const session = useGlobalSession()
    
    // Perform logout
    console.log('🔄 Performing logout...')
    await userStore.logout()
    
    // Wait a bit for state to propagate
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Check state after logout
    console.log('State after logout:')
    console.log('- UserStore isAuthenticated:', !!userStore.currentUser)
    console.log('- Session isAuthenticated:', session.isAuthenticated.value)
    console.log('- UserStore currentUser:', userStore.currentUser?.name || 'None')
    console.log('- Session currentUser:', session.currentUser.value?.name || 'None')
    
    // Check synchronization
    const userStoreAuth = !!userStore.currentUser
    const sessionAuth = session.isAuthenticated.value
    
    const authStatesMatch = userStoreAuth === sessionAuth
    const bothLoggedOut = !userStoreAuth && !sessionAuth
    
    if (authStatesMatch && bothLoggedOut) {
      console.log('✅ Authentication states are synchronized after logout')
      return { 
        success: true, 
        message: 'Authentication states are properly synchronized after logout' 
      }
    } else {
      console.log('❌ Authentication states are not synchronized after logout')
      return { 
        success: false, 
        message: 'Authentication states are not synchronized after logout',
        details: {
          authStatesMatch,
          bothLoggedOut,
          userStoreAuth,
          sessionAuth
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Auth state after logout test error:', error)
    return { 
      success: false, 
      message: 'Auth state after logout test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test complete authentication flow synchronization
 */
export async function testCompleteAuthFlowSync(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
  console.log('🧪 Testing complete authentication flow synchronization...')
  
  try {
    // Test 1: Initial state
    console.log('\n--- Test 1: Initial State ---')
    const initialSync = await testAuthStateSync()
    if (!initialSync.success) {
      return initialSync
    }
    
    // Test 2: After login
    console.log('\n--- Test 2: After Login ---')
    const afterLoginSync = await testAuthStateAfterLogin(credentials)
    if (!afterLoginSync.success) {
      return afterLoginSync
    }
    
    // Test 3: After logout
    console.log('\n--- Test 3: After Logout ---')
    const afterLogoutSync = await testAuthStateAfterLogout()
    if (!afterLogoutSync.success) {
      return afterLogoutSync
    }
    
    console.log('✅ Complete authentication flow synchronization test passed')
    return { 
      success: true, 
      message: 'Complete authentication flow synchronization test passed' 
    }
    
  } catch (error) {
    console.error('❌ Complete auth flow sync test error:', error)
    return { 
      success: false, 
      message: 'Complete auth flow sync test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Run all authentication synchronization tests
 */
export async function runAllAuthSyncTests(credentials?: LoginCredentials): Promise<{
  allPassed: boolean
  results: Array<{ test: string; success: boolean; message: string }>
  summary: { total: number; passed: number; failed: number }
}> {
  console.log('🚀 Running all authentication synchronization tests...')
  
  const results = []
  
  // Test 1: Current state synchronization
  console.log('\n--- Test 1: Current State Synchronization ---')
  const currentSyncResult = await testAuthStateSync()
  results.push({ test: 'Current State Synchronization', ...currentSyncResult })
  
  // Test 2: Complete flow (if credentials provided)
  if (credentials) {
    console.log('\n--- Test 2: Complete Authentication Flow ---')
    const completeFlowResult = await testCompleteAuthFlowSync(credentials)
    results.push({ test: 'Complete Authentication Flow', ...completeFlowResult })
  }
  
  // Summary
  console.log('\n📊 Authentication Synchronization Test Results Summary:')
  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.test}: ${result.message}`)
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
  (window as any).authSyncTests = {
    testAuthStateSync,
    testAuthStateAfterLogin,
    testAuthStateAfterLogout,
    testCompleteAuthFlowSync,
    runAllAuthSyncTests
  }
}


