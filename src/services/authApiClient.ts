/**
 * Auth API Client
 * Extends BaseApiClient to handle OAuth2 authentication
 */

import { BaseApiClient, CONTENT_TYPES, type ApiRequestConfig } from './baseApiClient'

// User interface matching the API response
export interface User {
  id: number
  email: string
  userType: string
  firstName: string
  lastName: string
  isActive: boolean
  avatar: string | null
  whatsapp: string | null
  phone: string | null
  telegram: string | null
  isOpenToOffers?: boolean
  generalConsentAccepted?: boolean
  uiTheme?: string | null
  portfolioStatus?: 'published' | 'draft' | 'archived' | null
  lastLoginAt: string
  createdAt: string
  name: string
}

// OAuth2 token response interface
export interface OAuth2TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
  user: User
}

// Login credentials interface
export interface LoginCredentials {
  username: string
  password: string
  client_id: string
  grant_type?: string
}

// Token storage interface
export interface TokenStorage {
  getToken(): string | null
  setToken(token: string): void
  removeToken(): void
  getRefreshToken(): string | null
  setRefreshToken(token: string): void
  removeRefreshToken(): void
  getUser(): User | null
  setUser(user: User): void
  removeUser(): void
  // Track when user profile was last synchronized from backend
  getUserSyncedAt?(): number | null
  setUserSyncedAt?(timestampMs: number): void
  removeUserSyncedAt?(): void
}

// Local storage implementation
class LocalStorageTokenStorage implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'auth_access_token'
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token'
  private readonly USER_KEY = 'auth_user'
  private readonly USER_SYNCED_AT_KEY = 'auth_user_synced_at'

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  setToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token)
  }

  removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token)
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY)
  }

  getUserSyncedAt(): number | null {
    const value = localStorage.getItem(this.USER_SYNCED_AT_KEY)
    return value ? Number(value) : null
  }

  setUserSyncedAt(timestampMs: number): void {
    localStorage.setItem(this.USER_SYNCED_AT_KEY, String(timestampMs))
  }

  removeUserSyncedAt(): void {
    localStorage.removeItem(this.USER_SYNCED_AT_KEY)
  }
}

// Memory storage implementation (for testing or when localStorage is not available)
export class MemoryTokenStorage implements TokenStorage {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private user: User | null = null
  private userSyncedAtMs: number | null = null

  getToken(): string | null {
    return this.accessToken
  }

  setToken(token: string): void {
    this.accessToken = token
  }

  removeToken(): void {
    this.accessToken = null
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  setRefreshToken(token: string): void {
    this.refreshToken = token
  }

  removeRefreshToken(): void {
    this.refreshToken = null
  }

  getUser(): User | null {
    return this.user
  }

  setUser(user: User): void {
    this.user = user
  }

  removeUser(): void {
    this.user = null
  }

  getUserSyncedAt(): number | null {
    return this.userSyncedAtMs
  }

  setUserSyncedAt(timestampMs: number): void {
    this.userSyncedAtMs = timestampMs
  }

  removeUserSyncedAt(): void {
    this.userSyncedAtMs = null
  }
}

/**
 * Auth API Client class
 * Handles OAuth2 authentication and token management
 */
export class AuthApiClient extends BaseApiClient {
  private tokenStorage: TokenStorage
  private clientId: string
  private isRefreshing: boolean = false
  private refreshPromise: Promise<OAuth2TokenResponse> | null = null
  private isLoggingOut: boolean = false
  private readonly USER_REFRESH_TTL_MS = 20 * 1000

  constructor(
    baseURL?: string,
    clientId?: string,
    tokenStorage?: TokenStorage
  ) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const isDev = import.meta.env.DEV
    const apiBaseURL = baseURL || 
      (isDev ? '' : import.meta.env.VITE_API_BASE_URL) || 
      (isDev ? '' : import.meta.env.VITE_BASE_URL) ||
      (isDev ? '' : 'http://127.0.0.1:8000')

    super(apiBaseURL, {
      'Cache-Control': 'no-cache',
      'Content-Type': CONTENT_TYPES.URL_ENCODED,
    })

    this.clientId = clientId || 
      import.meta.env.VITE_OAUTH_CLIENT_ID || 
      'XtBXtiE3ceaBoTdeagaLvBWArAhIR5oalakmwXFu'

    this.tokenStorage = tokenStorage || new LocalStorageTokenStorage()

    // Set up automatic token refresh on 401 responses
    this.setupTokenRefresh()
  }

  /**
   * Set OAuth2 client ID
   */
  setClientId(clientId: string): void {
    this.clientId = clientId
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.tokenStorage.getToken()
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.tokenStorage.getUser()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  /**
   * Login with username and password
   */
  async login(credentials: LoginCredentials): Promise<OAuth2TokenResponse> {
    const loginData = {
      client_id: credentials.client_id || this.clientId,
      username: credentials.username,
      password: credentials.password,
      grant_type: credentials.grant_type || 'password',
    }

    try {
      const response = await this.post<OAuth2TokenResponse>(
        '/oauth2/token/',
        loginData,
        {
          headers: {
            'Content-Type': CONTENT_TYPES.URL_ENCODED,
            'Cache-Control': 'no-cache',
          },
        }
      )

      // Store tokens and user data
      this.tokenStorage.setToken(response.data.access_token)
      if (response.data.refresh_token) {
        this.tokenStorage.setRefreshToken(response.data.refresh_token)
      }
      this.tokenStorage.setUser(response.data.user)
      // Mark user as freshly synced at login
      this.tokenStorage.setUserSyncedAt?.(Date.now())

      // Update default headers with new token
      this.setDefaultHeaders({
        ...this.getDefaultHeaders(),
        'Authorization': `Bearer ${response.data.access_token}`,
      })

      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  /**
   * Logout and clear stored tokens
   */
  async logout(): Promise<void> {
    // Prevent multiple simultaneous logout calls
    if (this.isLoggingOut) {
      console.log('🚪 [Logout] Already logging out, skipping...')
      return
    }
    
    this.isLoggingOut = true
    console.log('🚪 [Logout] Starting logout process...')
    
    try {
      // Revoke tokens on server using OAuth2 revoke endpoint
      const accessToken = this.tokenStorage.getToken()
      const refreshToken = this.tokenStorage.getRefreshToken()
      
      console.log('🚪 [Logout] Has access token:', !!accessToken)
      console.log('🚪 [Logout] Has refresh token:', !!refreshToken)
      console.log('🚪 [Logout] Tokens are different:', accessToken !== refreshToken)
      
      // Revoke access token if available
      if (accessToken) {
        console.log('🚪 [Logout] Revoking access token...')
        try {
          await this.post('/oauth2/revoke_token/', new URLSearchParams({
            token: accessToken,
            client_id: this.clientId,
          }), {
            headers: {
              'Content-Type': CONTENT_TYPES.URL_ENCODED,
            },
          })
          console.log('✅ [Logout] Access token revoked successfully')
        } catch (error) {
          console.warn('⚠️ [Logout] Failed to revoke access token:', error)
        }
      }
      
      // Revoke refresh token if available and different from access token
      if (refreshToken && refreshToken !== accessToken) {
        console.log('🚪 [Logout] Revoking refresh token...')
        try {
          await this.post('/oauth2/revoke_token/', new URLSearchParams({
            token: refreshToken,
            client_id: this.clientId,
          }), {
            headers: {
              'Content-Type': CONTENT_TYPES.URL_ENCODED,
            },
          })
          console.log('✅ [Logout] Refresh token revoked successfully')
        } catch (error) {
          console.warn('⚠️ [Logout] Failed to revoke refresh token:', error)
        }
      } else if (refreshToken && refreshToken === accessToken) {
        console.log('ℹ️ [Logout] Refresh token same as access token, skipping separate revocation')
      }
    } catch (error) {
      console.warn('⚠️ [Logout] Error during token revocation:', error)
    } finally {
      // Clear stored tokens and user data
      console.log('🧹 [Logout] Clearing stored tokens and user data...')
      this.tokenStorage.removeToken()
      this.tokenStorage.removeRefreshToken()
      this.tokenStorage.removeUser()
      this.tokenStorage.removeUserSyncedAt?.()

      // Remove authorization header
      const headers = this.getDefaultHeaders()
      delete headers['Authorization']
      this.setDefaultHeaders(headers)
      console.log('✅ [Logout] Logout process completed')
      
      // Reset logout flag
      this.isLoggingOut = false
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<OAuth2TokenResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken()
    
    console.log('🔄 [Token Refresh] Starting token refresh process...')
    console.log('🔄 [Token Refresh] Has refresh token:', !!refreshToken)
    console.log('🔄 [Token Refresh] Currently refreshing:', this.isRefreshing)
    
    if (!refreshToken) {
      console.error('❌ [Token Refresh] No refresh token available')
      throw new Error('No refresh token available')
    }

    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      console.log('🔄 [Token Refresh] Already refreshing, waiting for existing promise...')
      return this.refreshPromise
    }

    console.log('🔄 [Token Refresh] Initiating new refresh request...')
    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh(refreshToken)

    try {
      const response = await this.refreshPromise
      console.log('✅ [Token Refresh] Token refresh successful')
      console.log('✅ [Token Refresh] New access token received:', !!response.access_token)
      console.log('✅ [Token Refresh] New refresh token received:', !!response.refresh_token)
      return response
    } catch (error) {
      console.error('❌ [Token Refresh] Token refresh failed:', error)
      throw error
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
      console.log('🔄 [Token Refresh] Refresh process completed, flags reset')
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(refreshToken: string): Promise<OAuth2TokenResponse> {
    const refreshData = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
    }

    console.log('🔄 [Token Refresh] Making refresh request to /oauth2/token/')
    console.log('🔄 [Token Refresh] Client ID:', this.clientId)
    console.log('🔄 [Token Refresh] Refresh token (first 10 chars):', refreshToken.substring(0, 10) + '...')
    console.log('🔄 [Token Refresh] Request data:', { 
      grant_type: refreshData.grant_type, 
      client_id: refreshData.client_id,
      refresh_token: refreshToken.substring(0, 10) + '...'
    })

    try {
      const response = await this.post<OAuth2TokenResponse>(
        '/oauth2/token/',
        refreshData,
        {
          headers: {
            'Content-Type': CONTENT_TYPES.URL_ENCODED,
            'Cache-Control': 'no-cache',
          },
        }
      )

      console.log('✅ [Token Refresh] Refresh API call successful')
      console.log('✅ [Token Refresh] Response status:', response.status)
      console.log('✅ [Token Refresh] Has access token:', !!response.data.access_token)
      console.log('✅ [Token Refresh] Has refresh token:', !!response.data.refresh_token)
      console.log('✅ [Token Refresh] Has user data:', !!response.data.user)
      console.log('✅ [Token Refresh] Token type:', response.data.token_type)
      console.log('✅ [Token Refresh] Expires in:', response.data.expires_in, 'seconds')

      // Store new tokens and user data
      this.tokenStorage.setToken(response.data.access_token)
      if (response.data.refresh_token) {
        this.tokenStorage.setRefreshToken(response.data.refresh_token)
        console.log('✅ [Token Refresh] New refresh token stored')
      }
      if (response.data.user) {
        this.tokenStorage.setUser(response.data.user)
        console.log('✅ [Token Refresh] User data updated')
      }
      // Any successful token refresh means user data is up-to-date now
      this.tokenStorage.setUserSyncedAt?.(Date.now())

      // Update default headers with new token
      this.setDefaultHeaders({
        ...this.getDefaultHeaders(),
        'Authorization': `Bearer ${response.data.access_token}`,
      })
      console.log('✅ [Token Refresh] Authorization header updated')

      return response.data
    } catch (error: any) {
      console.error('❌ [Token Refresh] Refresh API call failed')
      console.error('❌ [Token Refresh] Error status:', error.status)
      console.error('❌ [Token Refresh] Error message:', error.message)
      console.error('❌ [Token Refresh] Error data:', error.data)
      console.error('❌ [Token Refresh] Full error:', error)
      
      // If refresh fails, clear all tokens and user data
      console.log('🧹 [Token Refresh] Clearing all stored tokens due to refresh failure')
      this.tokenStorage.removeToken()
      this.tokenStorage.removeRefreshToken()
      this.tokenStorage.removeUser()
      this.tokenStorage.removeUserSyncedAt?.()
      
      // Remove authorization header
      const headers = this.getDefaultHeaders()
      delete headers['Authorization']
      this.setDefaultHeaders(headers)
      console.log('🧹 [Token Refresh] Authorization header removed')
      
      throw error
    }
  }

  /**
   * Retry a request with fresh token in headers
   */
  private async retryWithFreshToken(originalMethod: Function, args: any[], freshToken: string | null): Promise<any> {
    if (!freshToken) {
      throw new Error('No fresh token available for retry')
    }

    // Extract the original arguments
    const [url, dataOrParams, config] = args
    
    // Create new config with fresh token in Authorization header
    const retryConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Authorization': `Bearer ${freshToken}`,
      },
    }

    console.log('🔄 [Retry] Retrying with fresh token in headers')
    console.log('🔄 [Retry] Fresh token (first 10 chars):', freshToken.substring(0, 10) + '...')
    
    // Call the original method with updated config
    return await originalMethod(url, dataOrParams, retryConfig)
  }

  /**
   * Set up automatic token refresh on 401 responses
   */
  private setupTokenRefresh(): void {
    // Store original methods
    const originalGet = this.get.bind(this)
    const originalPost = this.post.bind(this)
    const originalPut = this.put.bind(this)
    const originalPatch = this.patch.bind(this)
    const originalDelete = this.delete.bind(this)

    // Helper function to handle token refresh
    const handleRequestWithRefresh = async (originalMethod: Function, ...args: any[]) => {
      try {
        return await originalMethod(...args)
      } catch (error: any) {
        console.log('🔍 [401 Handler] Request failed with status:', error.status)
        console.log('🔍 [401 Handler] Error message:', error.message)
        console.log('🔍 [401 Handler] Has refresh token:', !!this.tokenStorage.getRefreshToken())
        
        // If we get a 401 and have a refresh token, try to refresh
        if (error.status === 401 && this.tokenStorage.getRefreshToken()) {
          console.log('🔄 [401 Handler] 401 detected, attempting token refresh...')
          try {
            await this.refreshAccessToken()
            console.log('✅ [401 Handler] Token refresh successful, retrying original request...')
            
            // Get the fresh token for the retry
            const freshToken = this.getAccessToken()
            console.log('🔄 [401 Handler] Fresh token for retry:', freshToken ? freshToken.substring(0, 10) + '...' : 'none')
            
            // Retry the original request with fresh token in headers
            const retryResult = await this.retryWithFreshToken(originalMethod, args, freshToken)
            console.log('✅ [401 Handler] Original request retry successful')
            return retryResult
          } catch (refreshError: any) {
            console.error('❌ [401 Handler] Token refresh failed:', refreshError)
            console.error('❌ [401 Handler] Refresh error status:', refreshError.status)
            console.error('❌ [401 Handler] Refresh error message:', refreshError.message)
            console.log('🧹 [401 Handler] Logging out due to refresh failure...')
            // If refresh fails, logout and rethrow original error
            await this.logout()
            throw error
          }
        } else if (error.status === 401) {
          console.log('⚠️ [401 Handler] 401 detected but no refresh token available')
        }
        throw error
      }
    }

    // Override methods to include token refresh logic
    this.get = async (url: string, params?: Record<string, any>, config?: any) => {
      return handleRequestWithRefresh(originalGet, url, params, config)
    }

    this.post = async (url: string, data?: any, config?: any) => {
      return handleRequestWithRefresh(originalPost, url, data, config)
    }

    this.put = async (url: string, data?: any, config?: any) => {
      return handleRequestWithRefresh(originalPut, url, data, config)
    }

    this.patch = async (url: string, data?: any, config?: any) => {
      return handleRequestWithRefresh(originalPatch, url, data, config)
    }

    this.delete = async (url: string, config?: any) => {
      return handleRequestWithRefresh(originalDelete, url, config)
    }
  }

  /**
   * Make authenticated request (automatically includes token)
   */
  async authenticatedRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<T> {
    const token = this.getAccessToken()
    
    console.log(`🔐 [Auth Request] ${method} ${url}`)
    console.log('🔐 [Auth Request] Has access token:', !!token)
    console.log('🔐 [Auth Request] Token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'none')
    
    if (!token) {
      console.error('❌ [Auth Request] No access token available')
      throw new Error('No access token available. Please login first.')
    }

    // Use the appropriate method based on the HTTP method
    let response: any
    switch (method) {
      case 'GET':
        response = await this.get<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
            'Authorization': `Bearer ${token}`,
          },
        })
        break
      case 'POST':
        response = await this.post<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
            'Authorization': `Bearer ${token}`,
          },
        })
        break
      case 'PUT':
        response = await this.put<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
            'Authorization': `Bearer ${token}`,
          },
        })
        break
      case 'PATCH':
        response = await this.patch<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
            'Authorization': `Bearer ${token}`,
          },
        })
        break
      case 'DELETE':
        response = await this.delete<T>(url, {
          ...config,
          headers: {
            ...config?.headers,
            'Authorization': `Bearer ${token}`,
          },
        })
        break
    }

    console.log(`✅ [Auth Request] ${method} ${url} completed successfully`)
    return response.data
  }

  /**
   * Make non-authenticated request (does not include token)
   */
  async nonAuthenticatedRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<T> {
    console.log(`🔐 [Auth Request] ${method} ${url}`)
    console.log('🔐 [Auth Request] Has access token:', false)
    console.log('🔐 [Auth Request] Token (first 10 chars):', 'none')
    
    // Use the appropriate method based on the HTTP method
    let response: any
    switch (method) {
      case 'GET':
        response = await this.get<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
          },
        })
        break
      case 'POST':
        response = await this.post<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
          },
        })
        break
      case 'PUT':
        response = await this.put<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
          },
        })
        break
      case 'PATCH':
        response = await this.patch<T>(url, data, {
          ...config,
          headers: {
            ...config?.headers,
          },
        })
        break
      case 'DELETE':
        response = await this.delete<T>(url, {
          ...config,
          headers: {
            ...config?.headers,
          },
        })
        break
    }

    console.log(`✅ [Auth Request] ${method} ${url} completed successfully`)
    return response.data
  }

  /**
   * Initialize with stored token (for app startup)
   */
  initializeWithStoredToken(): boolean {
    const token = this.tokenStorage.getToken()
    
    console.log('🚀 [Auth Init] Initializing with stored token...')
    console.log('🚀 [Auth Init] Has stored token:', !!token)
    console.log('🚀 [Auth Init] Token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'none')
    
    if (token) {
      this.setDefaultHeaders({
        ...this.getDefaultHeaders(),
        'Authorization': `Bearer ${token}`,
      })
      console.log('✅ [Auth Init] Authorization header set from stored token')
      return true
    }
    
    console.log('ℹ️ [Auth Init] No stored token found')
    return false
  }

  /**
   * Update user data (useful when user profile is updated)
   */
  updateUserData(user: User): void {
    this.tokenStorage.setUser(user)
    // Update sync timestamp on local manual updates as well
    this.tokenStorage.setUserSyncedAt?.(Date.now())
  }

  /**
   * Ensure the locally stored user profile is fresh.
   * If older than TTL, fetch /api/web/users/me and update storage.
   */
  async ensureFreshUser(): Promise<User | null> {
    try {
      const token = this.getAccessToken()
      if (!token) return null

      const lastSyncedAt = this.tokenStorage.getUserSyncedAt?.() || null
      const now = Date.now()
      if (lastSyncedAt && now - lastSyncedAt < this.USER_REFRESH_TTL_MS) {
        return this.getCurrentUser()
      }

      // Fetch current user from backend
      const meResponse = await this.authenticatedRequest<any>('GET', '/api/web/users/me')
      const freshUser = this.transformUserFromMeResponse(meResponse)
      this.tokenStorage.setUser(freshUser)
      this.tokenStorage.setUserSyncedAt?.(Date.now())
      return freshUser
    } catch (error) {
      console.warn('⚠️ [EnsureFreshUser] Failed to refresh user profile:', error)
      return this.getCurrentUser()
    }
  }

  // Map API /users/me response to AuthApiClient.User
  private transformUserFromMeResponse(apiUser: any): User {
    return {
      id: apiUser.id,
      name: apiUser.name,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      email: apiUser.email,
      avatar: apiUser.avatar ?? null,
      userType: apiUser.userType,
      isActive: apiUser.isActive,
      isOpenToOffers: apiUser.isOpenToOffers ?? false,
      generalConsentAccepted: apiUser.generalConsentAccepted ?? false,
      uiTheme: apiUser.uiTheme ?? null,
      portfolioStatus: apiUser.portfolioStatus ?? null,
      whatsapp: apiUser.whatsapp ?? null,
      phone: apiUser.phone ?? null,
      telegram: apiUser.telegram ?? null,
      lastLoginAt: apiUser.lastLoginAt,
      createdAt: apiUser.createdAt,
    }
  }
}

// Create default instance
export const authApiClient = new AuthApiClient()

// Export convenience functions
export const authApi = {
  login: (credentials: LoginCredentials) => authApiClient.login(credentials),
  logout: () => authApiClient.logout(),
  refreshToken: () => authApiClient.refreshAccessToken(),
  isAuthenticated: () => authApiClient.isAuthenticated(),
  getToken: () => authApiClient.getAccessToken(),
  getCurrentUser: () => authApiClient.getCurrentUser(),
  updateUserData: (user: User) => authApiClient.updateUserData(user),
  initialize: () => authApiClient.initializeWithStoredToken(),
  ensureFreshUser: () => authApiClient.ensureFreshUser(),
  
  // Authenticated requests
  get: <T = any>(url: string, params?: Record<string, any>, config?: ApiRequestConfig) =>
    authApiClient.authenticatedRequest<T>('GET', url, params, config),
  post: <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
    authApiClient.authenticatedRequest<T>('POST', url, data, config),
  put: <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
    authApiClient.authenticatedRequest<T>('PUT', url, data, config),
  patch: <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
    authApiClient.authenticatedRequest<T>('PATCH', url, data, config),
  delete: <T = any>(url: string, config?: ApiRequestConfig) =>
    authApiClient.authenticatedRequest<T>('DELETE', url, config),
}

// Note: Types are already exported above with their declarations
