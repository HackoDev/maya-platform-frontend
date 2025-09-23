/**
 * Example usage of AuthApiClient
 * This file demonstrates how to use the authApiClient for authentication
 */

import { AuthApiClient, authApi, type LoginCredentials } from './authApiClient'

// Example 1: Basic login
export async function exampleBasicLogin() {
  try {
    const credentials: LoginCredentials = {
      username: 'eugene@example.com',
      password: 'pass0911',
      client_id: 'XtBXtiE3ceaBoTdeagaLvBWArAhIR5oalakmwXFu',
      grant_type: 'password'
    }

    const tokenResponse = await authApi.login(credentials)
    console.log('Login successful:', tokenResponse)
    console.log('Access token:', tokenResponse.access_token)
    console.log('Token type:', tokenResponse.token_type)
    console.log('Expires in:', tokenResponse.expires_in, 'seconds')
    console.log('User data:', tokenResponse.user)

    // Check if authenticated
    console.log('Is authenticated:', authApi.isAuthenticated())
    console.log('Current token:', authApi.getToken())
    console.log('Current user:', authApi.getCurrentUser())

  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Example 2: Using custom AuthApiClient instance
export const customAuthClient = new AuthApiClient(
  'https://api.example.com', // base URL
  'your-client-id', // client ID
  // token storage (optional, defaults to localStorage)
)

export async function exampleCustomAuthClient() {
  try {
    const credentials: LoginCredentials = {
      username: 'user@example.com',
      password: 'password123',
      client_id: 'your-client-id'
    }

    const tokenResponse = await customAuthClient.login(credentials)
    console.log('Custom client login:', tokenResponse)

    // Make authenticated requests
    const userProfile = await customAuthClient.authenticatedRequest('GET', '/user/profile')
    console.log('User profile:', userProfile)

  } catch (error) {
    console.error('Custom auth error:', error)
  }
}

// Example 3: App initialization with stored token
export function initializeApp() {
  // Initialize with stored token (for app startup)
  const hasStoredToken = authApi.initialize()
  
  if (hasStoredToken) {
    console.log('App initialized with stored token')
    // User is already authenticated
  } else {
    console.log('No stored token found, user needs to login')
    // Redirect to login page
  }
}

// Example 4: Making authenticated API calls
export async function exampleAuthenticatedRequests() {
  try {
    // These requests will automatically include the Bearer token
    const users = await authApi.get('/api/users')
    console.log('Users:', users)

    const newUser = await authApi.post('/api/users', {
      name: 'John Doe',
      email: 'john@example.com'
    })
    console.log('Created user:', newUser)

    const updatedUser = await authApi.put('/api/users/123', {
      name: 'John Smith'
    })
    console.log('Updated user:', updatedUser)

    await authApi.delete('/api/users/123')
    console.log('User deleted')

  } catch (error) {
    console.error('Authenticated request failed:', error)
  }
}

// Example 5: Token refresh
export async function exampleTokenRefresh() {
  try {
    // This will automatically refresh the token if needed
    const refreshedToken = await authApi.refreshToken()
    console.log('Token refreshed:', refreshedToken)

  } catch (error) {
    console.error('Token refresh failed:', error)
    // Token refresh failed, user needs to login again
    console.log('Redirecting to login page...')
  }
}

// Example 6: Logout
export async function exampleLogout() {
  try {
    await authApi.logout()
    console.log('Logged out successfully')
    console.log('Is authenticated:', authApi.isAuthenticated()) // false

  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Example 7: Error handling
export async function exampleErrorHandling() {
  try {
    const response = await authApi.get('/api/protected-endpoint')
    console.log('Protected data:', response)

  } catch (error: any) {
    if (error.status === 401) {
      console.log('Unauthorized - token may be expired')
      // Try to refresh token
      try {
        await authApi.refreshToken()
        console.log('Token refreshed, retrying request...')
        // Retry the original request
        const response = await authApi.get('/api/protected-endpoint')
        console.log('Protected data after refresh:', response)
      } catch (refreshError) {
        console.log('Token refresh failed, redirecting to login')
        // Redirect to login page
      }
    } else if (error.status === 403) {
      console.log('Forbidden - insufficient permissions')
    } else {
      console.log('Other error:', error.message)
    }
  }
}

// Example 8: Vue.js composable usage
export function useAuth() {
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const isAuthenticated = () => authApi.isAuthenticated()
  const getToken = () => authApi.getToken()
  const getCurrentUser = () => authApi.getCurrentUser()
  const updateUserData = (user: any) => authApi.updateUserData(user)

  return {
    login,
    logout,
    isAuthenticated,
    getToken,
    getCurrentUser,
    updateUserData,
    initialize: authApi.initialize
  }
}

// Example 9: React hook usage (if using React)
export function useAuthReact() {
  // Note: This is a conceptual example - you would need to import useState and useEffect from React
  // const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated())
  // const [token, setToken] = useState(authApi.getToken())

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials)
      // setIsAuthenticated(true)
      // setToken(response.access_token)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      // setIsAuthenticated(false)
      // setToken(null)
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  // useEffect(() => {
  //   // Initialize with stored token on mount
  //   const hasToken = authApi.initialize()
  //   setIsAuthenticated(hasToken)
  //   setToken(authApi.getToken())
  // }, [])

  return {
    // isAuthenticated,
    // token,
    // user,
    login,
    logout,
    getCurrentUser: authApi.getCurrentUser,
    updateUserData: authApi.updateUserData
  }
}

// Example 10: Working with user data
export async function exampleUserDataManagement() {
  try {
    // Login and get user data
    const credentials: LoginCredentials = {
      username: 'eugene@example.com',
      password: 'pass0911',
      client_id: 'XtBXtiE3ceaBoTdeagaLvBWArAhIR5oalakmwXFu'
    }

    const loginResponse = await authApi.login(credentials)
    console.log('User logged in:', loginResponse.user)

    // Get current user data
    const currentUser = authApi.getCurrentUser()
    if (currentUser) {
      console.log('Current user:', currentUser)
      console.log('User ID:', currentUser.id)
      console.log('User name:', currentUser.name)
      console.log('User email:', currentUser.email)
      console.log('User type:', currentUser.userType)
      console.log('Is active:', currentUser.isActive)
      console.log('Last login:', currentUser.lastLoginAt)
    }

    // Update user data (e.g., after profile update)
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        firstName: 'Updated Name',
        phone: '+7 (999) 123-45-67'
      }
      authApi.updateUserData(updatedUser)
      console.log('User data updated:', authApi.getCurrentUser())
    }

    // Make authenticated requests with user context
    const userProfile = await authApi.get('/user/profile')
    console.log('User profile from API:', userProfile)

    // Update user profile
    const updatedProfile = await authApi.patch('/user/profile', {
      firstName: 'New First Name',
      lastName: 'New Last Name'
    })
    console.log('Profile updated:', updatedProfile)

    // Update local user data with the response
    if (updatedProfile.user) {
      authApi.updateUserData(updatedProfile.user)
    }

  } catch (error) {
    console.error('User data management error:', error)
  }
}
