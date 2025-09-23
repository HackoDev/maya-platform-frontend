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
}

// Local storage implementation
class LocalStorageTokenStorage implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'auth_access_token'
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token'
  private readonly USER_KEY = 'auth_user'

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
}

// Memory storage implementation (for testing or when localStorage is not available)
export class MemoryTokenStorage implements TokenStorage {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private user: User | null = null

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
    try {
      // Revoke tokens on server using OAuth2 revoke endpoint
      const accessToken = this.tokenStorage.getToken()
      const refreshToken = this.tokenStorage.getRefreshToken()
      
      // Revoke access token if available
      if (accessToken) {
        await this.post('/oauth2/revoke_token/', new URLSearchParams({
          token: accessToken,
          client_id: this.clientId,
        }), {
          headers: {
            'Content-Type': CONTENT_TYPES.URL_ENCODED,
          },
        }).catch((error) => {
          console.warn('Failed to revoke access token:', error)
        })
      }
      
      // Revoke refresh token if available and different from access token
      if (refreshToken && refreshToken !== accessToken) {
        await this.post('/oauth2/revoke_token/', new URLSearchParams({
          token: refreshToken,
          client_id: this.clientId,
        }), {
          headers: {
            'Content-Type': CONTENT_TYPES.URL_ENCODED,
          },
        }).catch((error) => {
          console.warn('Failed to revoke refresh token:', error)
        })
      }
    } catch (error) {
      console.warn('Error during logout:', error)
    } finally {
      // Clear stored tokens and user data
      this.tokenStorage.removeToken()
      this.tokenStorage.removeRefreshToken()
      this.tokenStorage.removeUser()

      // Remove authorization header
      const headers = this.getDefaultHeaders()
      delete headers['Authorization']
      this.setDefaultHeaders(headers)
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<OAuth2TokenResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh(refreshToken)

    try {
      const response = await this.refreshPromise
      return response
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
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

      // Store new tokens and user data
      this.tokenStorage.setToken(response.data.access_token)
      if (response.data.refresh_token) {
        this.tokenStorage.setRefreshToken(response.data.refresh_token)
      }
      if (response.data.user) {
        this.tokenStorage.setUser(response.data.user)
      }

      // Update default headers with new token
      this.setDefaultHeaders({
        ...this.getDefaultHeaders(),
        'Authorization': `Bearer ${response.data.access_token}`,
      })

      return response.data
    } catch (error) {
      // If refresh fails, clear all tokens and user data
      this.tokenStorage.removeToken()
      this.tokenStorage.removeRefreshToken()
      this.tokenStorage.removeUser()
      throw error
    }
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
        // If we get a 401 and have a refresh token, try to refresh
        if (error.status === 401 && this.tokenStorage.getRefreshToken()) {
          try {
            await this.refreshAccessToken()
            // Retry the original request with new token
            return await originalMethod(...args)
          } catch (refreshError) {
            // If refresh fails, logout and rethrow original error
            await this.logout()
            throw error
          }
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
    
    if (!token) {
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

    return response.data
  }

  /**
   * Initialize with stored token (for app startup)
   */
  initializeWithStoredToken(): boolean {
    const token = this.tokenStorage.getToken()
    
    if (token) {
      this.setDefaultHeaders({
        ...this.getDefaultHeaders(),
        'Authorization': `Bearer ${token}`,
      })
      return true
    }
    
    return false
  }

  /**
   * Update user data (useful when user profile is updated)
   */
  updateUserData(user: User): void {
    this.tokenStorage.setUser(user)
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
