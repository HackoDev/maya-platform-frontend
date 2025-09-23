/**
 * Utility functions to test proxy configuration
 * These functions help verify that the Vite proxy is working correctly
 */

/**
 * Test API proxy connection
 */
export async function testApiProxy(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('API Proxy Test:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    })
    
    return response.ok
  } catch (error) {
    console.error('API Proxy Test Failed:', error)
    return false
  }
}

/**
 * Test OAuth2 proxy connection
 */
export async function testOAuth2Proxy(): Promise<boolean> {
  try {
    // Test with invalid credentials to avoid actual login
    const formData = new FormData()
    formData.append('client_id', 'test-client-id')
    formData.append('username', 'test@example.com')
    formData.append('password', 'invalid-password')
    formData.append('grant_type', 'password')
    
    const response = await fetch('/oauth2/token/', {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
      },
      body: formData,
    })
    
    console.log('OAuth2 Proxy Test:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    })
    
    // We expect a 400 or 401 error for invalid credentials, which means proxy is working
    return response.status === 400 || response.status === 401
  } catch (error) {
    console.error('OAuth2 Proxy Test Failed:', error)
    return false
  }
}

/**
 * Test static files proxy
 */
export async function testStaticProxy(): Promise<boolean> {
  try {
    const response = await fetch('/static/test.txt', {
      method: 'GET',
    })
    
    console.log('Static Proxy Test:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    })
    
    // 404 is expected if the file doesn't exist, but proxy should work
    return response.status === 404 || response.ok
  } catch (error) {
    console.error('Static Proxy Test Failed:', error)
    return false
  }
}

/**
 * Run all proxy tests
 */
export async function runAllProxyTests(): Promise<{
  api: boolean
  oauth2: boolean
  static: boolean
  allPassed: boolean
}> {
  console.log('🧪 Running Proxy Tests...')
  
  const [api, oauth2, staticFiles] = await Promise.all([
    testApiProxy(),
    testOAuth2Proxy(),
    testStaticProxy(),
  ])
  
  const allPassed = api && oauth2 && staticFiles
  
  console.log('📊 Proxy Test Results:', {
    api,
    oauth2,
    static: staticFiles,
    allPassed,
  })
  
  if (allPassed) {
    console.log('✅ All proxy tests passed!')
  } else {
    console.log('❌ Some proxy tests failed. Check your backend server and proxy configuration.')
  }
  
  return { api, oauth2, static: staticFiles, allPassed }
}

/**
 * Test specific endpoint
 */
export async function testEndpoint(endpoint: string, options: RequestInit = {}): Promise<{
  success: boolean
  status: number
  statusText: string
  data?: any
  error?: string
}> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    let data
    try {
      data = await response.json()
    } catch {
      data = await response.text()
    }
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data,
    }
  } catch (error) {
    return {
      success: false,
      status: 0,
      statusText: 'Network Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Development helper to test proxy configuration
 * Call this in your browser console or in a component
 */
export function debugProxyConfig() {
  console.log('🔧 Proxy Configuration Debug Info:')
  console.log('Environment:', import.meta.env.MODE)
  console.log('Dev Mode:', import.meta.env.DEV)
  console.log('Base URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('OAuth Client ID:', import.meta.env.VITE_OAUTH_CLIENT_ID)
  console.log('Current URL:', window.location.href)
  
  // Run tests
  runAllProxyTests()
}

// Make debug function available globally in development
if (import.meta.env.DEV) {
  ;(window as any).debugProxy = debugProxyConfig
  ;(window as any).testProxy = runAllProxyTests
}


