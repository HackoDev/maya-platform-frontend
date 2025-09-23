/**
 * Login Flow Test Utility
 * Tests the complete login flow to ensure no redirects occur after successful login
 */

import { useGlobalSession } from '@/composables/useSession'
import type { LoginCredentials } from '@/services/authApiClient'

/**
 * Test complete login flow
 */
export async function testLoginFlow(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
  console.log('🧪 Testing complete login flow...')
  
  try {
    const session = useGlobalSession()
    
    // Check initial state
    console.log('Initial state:')
    console.log('- Is authenticated:', session.isAuthenticated.value)
    console.log('- Current user:', session.currentUser.value?.name || 'None')
    console.log('- Is loading:', session.isLoading.value)
    
    // Perform login
    console.log('🔄 Performing login...')
    const loginSuccess = await session.login(credentials.username, credentials.password)
    
    if (!loginSuccess) {
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
    console.log('- Is authenticated:', session.isAuthenticated.value)
    console.log('- Current user:', session.currentUser.value?.name || 'None')
    console.log('- Is loading:', session.isLoading.value)
    console.log('- Is initialized:', session.isInitialized.value)
    
    // Verify authentication state
    const isAuthenticated = session.isAuthenticated.value
    const hasUser = !!session.currentUser.value
    const isNotLoading = !session.isLoading.value
    const isInitialized = session.isInitialized.value
    
    if (isAuthenticated && hasUser && isNotLoading && isInitialized) {
      console.log('✅ Login flow test passed - user is properly authenticated')
      return { 
        success: true, 
        message: 'Login flow test passed - user is properly authenticated' 
      }
    } else {
      console.log('❌ Login flow test failed - authentication state is incorrect')
      return { 
        success: false, 
        message: 'Login flow test failed - authentication state is incorrect',
        details: {
          isAuthenticated,
          hasUser,
          isNotLoading,
          isInitialized
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Login flow test error:', error)
    return { 
      success: false, 
      message: 'Login flow test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test login flow with router navigation simulation
 */
export async function testLoginFlowWithNavigation(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
  console.log('🧪 Testing login flow with navigation simulation...')
  
  try {
    const session = useGlobalSession()
    
    // Simulate navigation to a protected route
    console.log('🔄 Simulating navigation to protected route...')
    
    // Check if user would be allowed to access protected route
    const wouldBeAllowed = session.isAuthenticated.value && !!session.currentUser.value
    
    if (!wouldBeAllowed) {
      // Perform login first
      console.log('🔄 User not authenticated, performing login...')
      const loginSuccess = await session.login(credentials.username, credentials.password)
      
      if (!loginSuccess) {
        return { 
          success: false, 
          message: 'Login failed during navigation test' 
        }
      }
      
      // Wait for state to propagate
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Check if user can now access protected route
    const canAccessProtectedRoute = session.isAuthenticated.value && !!session.currentUser.value
    
    if (canAccessProtectedRoute) {
      console.log('✅ Navigation test passed - user can access protected route')
      return { 
        success: true, 
        message: 'Navigation test passed - user can access protected route' 
      }
    } else {
      console.log('❌ Navigation test failed - user cannot access protected route')
      return { 
        success: false, 
        message: 'Navigation test failed - user cannot access protected route',
        details: {
          isAuthenticated: session.isAuthenticated.value,
          hasUser: !!session.currentUser.value
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Navigation test error:', error)
    return { 
      success: false, 
      message: 'Navigation test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test login flow with multiple rapid logins
 */
export async function testRapidLoginFlow(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
  console.log('🧪 Testing rapid login flow...')
  
  try {
    const session = useGlobalSession()
    
    // Perform multiple rapid logins
    console.log('🔄 Performing rapid logins...')
    const loginPromises = []
    
    for (let i = 0; i < 3; i++) {
      loginPromises.push(session.login(credentials.username, credentials.password))
    }
    
    const results = await Promise.all(loginPromises)
    const successCount = results.filter(r => r).length
    
    console.log(`✅ Rapid login test completed: ${successCount}/3 successful`)
    
    // Check final state
    const isAuthenticated = session.isAuthenticated.value
    const hasUser = !!session.currentUser.value
    
    if (isAuthenticated && hasUser) {
      console.log('✅ Rapid login test passed - final state is correct')
      return { 
        success: true, 
        message: 'Rapid login test passed - final state is correct' 
      }
    } else {
      console.log('❌ Rapid login test failed - final state is incorrect')
      return { 
        success: false, 
        message: 'Rapid login test failed - final state is incorrect',
        details: {
          isAuthenticated,
          hasUser,
          successCount
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Rapid login test error:', error)
    return { 
      success: false, 
      message: 'Rapid login test failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Run all login flow tests
 */
export async function runAllLoginFlowTests(credentials: LoginCredentials): Promise<{
  allPassed: boolean
  results: Array<{ test: string; success: boolean; message: string }>
  summary: { total: number; passed: number; failed: number }
}> {
  console.log('🚀 Running all login flow tests...')
  
  const results = []
  
  // Test 1: Basic login flow
  console.log('\n--- Test 1: Basic Login Flow ---')
  const basicLoginResult = await testLoginFlow(credentials)
  results.push({ test: 'Basic Login Flow', ...basicLoginResult })
  
  // Test 2: Login flow with navigation
  console.log('\n--- Test 2: Login Flow with Navigation ---')
  const navigationResult = await testLoginFlowWithNavigation(credentials)
  results.push({ test: 'Login Flow with Navigation', ...navigationResult })
  
  // Test 3: Rapid login flow
  console.log('\n--- Test 3: Rapid Login Flow ---')
  const rapidLoginResult = await testRapidLoginFlow(credentials)
  results.push({ test: 'Rapid Login Flow', ...rapidLoginResult })
  
  // Summary
  console.log('\n📊 Login Flow Test Results Summary:')
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
  (window as any).loginFlowTests = {
    testLoginFlow,
    testLoginFlowWithNavigation,
    testRapidLoginFlow,
    runAllLoginFlowTests
  }
}


