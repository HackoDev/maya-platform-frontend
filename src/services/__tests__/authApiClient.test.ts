/**
 * Tests for AuthApiClient
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthApiClient, MemoryTokenStorage, type LoginCredentials } from '../authApiClient'

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('AuthApiClient', () => {
  let authClient: AuthApiClient
  let memoryStorage: MemoryTokenStorage

  beforeEach(() => {
    vi.clearAllMocks()
    memoryStorage = new MemoryTokenStorage()
    authClient = new AuthApiClient(
      'https://api.example.com',
      'test-client-id',
      memoryStorage
    )
  })

  describe('Configuration', () => {
    it('should set base URL and client ID correctly', () => {
      expect(authClient['baseURL']).toBe('https://api.example.com')
      expect(authClient['clientId']).toBe('test-client-id')
    })

    it('should use memory storage when provided', () => {
      expect(authClient['tokenStorage']).toBe(memoryStorage)
    })

    it('should set default headers for OAuth2', () => {
      const headers = authClient.getDefaultHeaders()
      expect(headers['Cache-Control']).toBe('no-cache')
      expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded')
    })
  })

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const mockTokenResponse = {
        access_token: 'access-token-123',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token-123',
      }

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockTokenResponse),
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const credentials: LoginCredentials = {
        username: 'test@example.com',
        password: 'password123',
        client_id: 'test-client-id',
      }

      const result = await authClient.login(credentials)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/oauth2/token/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
          }),
          body: expect.stringContaining('client_id=test-client-id'),
        })
      )

      expect(result).toEqual(mockTokenResponse)
      expect(memoryStorage.getToken()).toBe('access-token-123')
      expect(memoryStorage.getRefreshToken()).toBe('refresh-token-123')
    })

    it('should handle login failure', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const credentials: LoginCredentials = {
        username: 'wrong@example.com',
        password: 'wrongpassword',
      }

      await expect(authClient.login(credentials)).rejects.toMatchObject({
        message: 'HTTP 401: Unauthorized',
        status: 401,
      })
    })

    it('should check authentication status', () => {
      expect(authClient.isAuthenticated()).toBe(false)

      memoryStorage.setToken('test-token')
      expect(authClient.isAuthenticated()).toBe(true)
    })

    it('should get access token', () => {
      expect(authClient.getAccessToken()).toBe(null)

      memoryStorage.setToken('test-token')
      expect(authClient.getAccessToken()).toBe('test-token')
    })
  })

  describe('Token Management', () => {
    it('should refresh access token', async () => {
      // Set up initial tokens
      memoryStorage.setToken('old-access-token')
      memoryStorage.setRefreshToken('refresh-token-123')

      const mockTokenResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
      }

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockTokenResponse),
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const result = await authClient.refreshAccessToken()

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/oauth2/token/',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('grant_type=refresh_token'),
        })
      )

      expect(result).toEqual(mockTokenResponse)
      expect(memoryStorage.getToken()).toBe('new-access-token')
      expect(memoryStorage.getRefreshToken()).toBe('new-refresh-token')
    })

    it('should handle refresh token failure', async () => {
      memoryStorage.setRefreshToken('invalid-refresh-token')

      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ error: 'Invalid refresh token' }),
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await expect(authClient.refreshAccessToken()).rejects.toMatchObject({
        message: 'HTTP 400: Bad Request',
        status: 400,
      })

      // Tokens should be cleared on refresh failure
      expect(memoryStorage.getToken()).toBe(null)
      expect(memoryStorage.getRefreshToken()).toBe(null)
    })

    it('should logout and clear tokens', async () => {
      // Set up tokens
      memoryStorage.setToken('access-token')
      memoryStorage.setRefreshToken('refresh-token')

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true }),
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await authClient.logout()

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/oauth2/revoke_token/',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('token=access-token'),
        })
      )

      expect(memoryStorage.getToken()).toBe(null)
      expect(memoryStorage.getRefreshToken()).toBe(null)
    })
  })

  describe('Authenticated Requests', () => {
    beforeEach(() => {
      memoryStorage.setToken('test-access-token')
    })

    it('should make authenticated GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ user: { id: 1, name: 'John' } }),
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const result = await authClient.authenticatedRequest('GET', '/user/profile')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/user/profile',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-access-token',
          }),
        })
      )

      expect(result).toEqual({ user: { id: 1, name: 'John' } })
    })

    it('should make authenticated POST request', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ id: 1, name: 'New User' }),
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const userData = { name: 'New User', email: 'new@example.com' }
      const result = await authClient.authenticatedRequest('POST', '/users', userData)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-access-token',
          }),
          body: JSON.stringify(userData),
        })
      )

      expect(result).toEqual({ id: 1, name: 'New User' })
    })

    it('should throw error when no token available', async () => {
      memoryStorage.removeToken()

      await expect(
        authClient.authenticatedRequest('GET', '/user/profile')
      ).rejects.toThrow('No access token available. Please login first.')
    })
  })

  describe('Token Storage', () => {
    it('should use localStorage by default', () => {
      const defaultClient = new AuthApiClient()
      expect(defaultClient['tokenStorage']).toBeDefined()
    })

    it('should use provided token storage', () => {
      const customStorage = new MemoryTokenStorage()
      const client = new AuthApiClient('https://api.test.com', 'client-id', customStorage)
      expect(client['tokenStorage']).toBe(customStorage)
    })
  })

  describe('Initialization', () => {
    it('should initialize with stored token', () => {
      memoryStorage.setToken('stored-token')
      
      const result = authClient.initializeWithStoredToken()
      
      expect(result).toBe(true)
      expect(authClient.getDefaultHeaders()['Authorization']).toBe('Bearer stored-token')
    })

    it('should return false when no stored token', () => {
      const result = authClient.initializeWithStoredToken()
      
      expect(result).toBe(false)
      expect(authClient.getDefaultHeaders()['Authorization']).toBeUndefined()
    })
  })
})
