/**
 * Tests for BaseApiClient
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BaseApiClient, CONTENT_TYPES } from '../baseApiClient'

// Mock fetch
global.fetch = vi.fn()

describe('BaseApiClient', () => {
  let apiClient: BaseApiClient

  beforeEach(() => {
    vi.clearAllMocks()
    apiClient = new BaseApiClient('https://api.example.com', {
      'Authorization': 'Bearer test-token'
    })
  })

  describe('Configuration', () => {
    it('should set base URL correctly', () => {
      expect(apiClient['baseURL']).toBe('https://api.example.com')
    })

    it('should set default headers correctly', () => {
      const headers = apiClient.getDefaultHeaders()
      expect(headers['Authorization']).toBe('Bearer test-token')
      expect(headers['Content-Type']).toBe(CONTENT_TYPES.JSON)
    })

    it('should allow updating base URL', () => {
      apiClient.setBaseURL('https://new-api.example.com')
      expect(apiClient['baseURL']).toBe('https://new-api.example.com')
    })

    it('should allow updating default headers', () => {
      apiClient.setDefaultHeaders({
        'X-Custom-Header': 'custom-value'
      })
      const headers = apiClient.getDefaultHeaders()
      expect(headers['X-Custom-Header']).toBe('custom-value')
    })
  })

  describe('GET requests', () => {
    it('should make GET request with query parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ users: [] })
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const response = await apiClient.get('/users', { page: 1, limit: 10 })

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/users?page=1&limit=10',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          })
        })
      )

      expect(response.data).toEqual({ users: [] })
      expect(response.status).toBe(200)
    })
  })

  describe('POST requests', () => {
    it('should make POST request with JSON data', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ id: 1, name: 'John' })
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const userData = { name: 'John', email: 'john@example.com' }
      const response = await apiClient.post('/users', userData)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(userData)
        })
      )

      expect(response.data).toEqual({ id: 1, name: 'John' })
    })

    it('should make POST request with FormData', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true })
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const formData = new FormData()
      formData.append('name', 'John')
      formData.append('email', 'john@example.com')

      const response = await apiClient.post('/users', formData)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          headers: expect.not.objectContaining({
            'Content-Type': expect.stringContaining('multipart/form-data')
          }),
          body: formData
        })
      )

      expect(response.data).toEqual({ success: true })
    })
  })

  describe('Error handling', () => {
    it('should handle HTTP errors correctly', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ error: 'Resource not found' })
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      await expect(apiClient.get('/nonexistent')).rejects.toMatchObject({
        message: 'HTTP 404: Not Found',
        status: 404,
        statusText: 'Not Found',
        data: { error: 'Resource not found' }
      })
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.get('/users')).rejects.toMatchObject({
        message: 'Network error'
      })
    })

    it('should handle timeout errors', async () => {
      // Mock AbortController
      const mockAbortController = {
        abort: vi.fn(),
        signal: {} as AbortSignal
      }
      
      vi.mocked(fetch).mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            const error = new Error('Request timeout')
            error.name = 'AbortError'
            reject(error)
          }, 100)
        })
      })

      await expect(apiClient.get('/users', undefined, { timeout: 50 }))
        .rejects.toMatchObject({
          message: 'Request timeout',
          status: 408,
          statusText: 'Request Timeout'
        })
    })
  })

  describe('Content types', () => {
    it('should handle different content types', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('Hello World')
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const response = await apiClient.post('/text', 'Hello World', {
        headers: { 'Content-Type': CONTENT_TYPES.TEXT }
      })

      expect(response.data).toBe('Hello World')
    })
  })

  describe('File operations', () => {
    it('should handle file upload', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ fileId: '123' })
      }

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const response = await apiClient.uploadFile('/upload', file, {
        description: 'Test file'
      })

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      )

      expect(response.data).toEqual({ fileId: '123' })
    })
  })
})


