/**
 * Test utility for token refresh flow
 * This can be used to manually test the refresh token functionality
 */

import { authApi } from '@/services/authApiClient'

export async function testTokenRefresh() {
  console.log('🧪 [Refresh Test] Starting token refresh test...')
  
  try {
    // Check if we have a refresh token
    const hasRefreshToken = !!authApi.getCurrentUser()
    console.log('🧪 [Refresh Test] Has refresh token:', hasRefreshToken)
    
    if (!hasRefreshToken) {
      console.log('⚠️ [Refresh Test] No refresh token available, please login first')
      return false
    }
    
    // Try to refresh the token
    console.log('🧪 [Refresh Test] Attempting token refresh...')
    const result = await authApi.refreshToken()
    
    console.log('✅ [Refresh Test] Token refresh successful!')
    console.log('🧪 [Refresh Test] New access token received:', !!result.access_token)
    console.log('🧪 [Refresh Test] New refresh token received:', !!result.refresh_token)
    console.log('🧪 [Refresh Test] User data received:', !!result.user)
    
    return true
  } catch (error) {
    console.error('❌ [Refresh Test] Token refresh failed:', error)
    return false
  }
}

export async function testAuthenticatedRequest() {
  console.log('🧪 [Auth Test] Testing authenticated request...')
  
  try {
    // Make a simple authenticated request
    const result = await authApi.get('/user/profile')
    console.log('✅ [Auth Test] Authenticated request successful:', result)
    return true
  } catch (error) {
    console.error('❌ [Auth Test] Authenticated request failed:', error)
    return false
  }
}

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testTokenRefresh = testTokenRefresh
  (window as any).testAuthenticatedRequest = testAuthenticatedRequest
  console.log('🧪 [Refresh Test] Test functions available globally:')
  console.log('  - testTokenRefresh()')
  console.log('  - testAuthenticatedRequest()')
}
