/**
 * Tests for VacancyApiClient
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VacancyApiClient } from '../vacancyApiClient'
import type { ApiVacancy, ApiVacancyListResponse } from '@/types/vacancy'

// Mock fetch
global.fetch = vi.fn()

describe('VacancyApiClient', () => {
  let client: VacancyApiClient

  beforeEach(() => {
    client = new VacancyApiClient('http://test-api.com')
    vi.clearAllMocks()
    
    // Mock the authentication methods
    vi.spyOn(client, 'getAccessToken').mockReturnValue('mock-token')
    vi.spyOn(client, 'isAuthenticated').mockReturnValue(true)
  })

  describe('convertApiVacancyToVacancy', () => {
    it('should convert API vacancy to frontend vacancy format', () => {
      const apiVacancy: ApiVacancy = {
        id: 'test-id',
        title: 'Test Vacancy',
        description: 'Test Description',
        is_active: true,
        author: {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          avatar: '/avatar.jpg',
          whatsapp: '+1234567890',
          phone: '+1234567890',
          telegram: 'johndoe'
        },
        created_timestamp: '2023-01-01T00:00:00Z',
        updated_timestamp: '2023-01-01T00:00:00Z'
      }

      // Access private method through type assertion for testing
      const converted = (client as any).convertApiVacancyToVacancy(apiVacancy)

      expect(converted).toEqual({
        id: 'test-id',
        title: 'Test Vacancy',
        description: 'Test Description',
        status: 'published', // is_active: true should map to 'published'
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        clientId: 'test@example.com',
        clientName: 'John Doe',
        clientPhone: '+1234567890',
        isActive: true,
        author: apiVacancy.author
      })
    })

    it('should map is_active: false to draft status', () => {
      const apiVacancy: ApiVacancy = {
        id: 'test-id',
        title: 'Test Vacancy',
        description: 'Test Description',
        is_active: false,
        author: {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          avatar: '/avatar.jpg',
          whatsapp: '+1234567890',
          phone: '+1234567890',
          telegram: 'johndoe'
        },
        created_timestamp: '2023-01-01T00:00:00Z',
        updated_timestamp: '2023-01-01T00:00:00Z'
      }

      const converted = (client as any).convertApiVacancyToVacancy(apiVacancy)
      expect(converted.status).toBe('draft')
    })
  })

  describe('convertVacancyToApiFormat', () => {
    it('should convert frontend vacancy to API format', () => {
      const vacancy = {
        title: 'Test Vacancy',
        description: 'Test Description',
        isActive: true
      }

      const converted = (client as any).convertVacancyToApiFormat(vacancy)

      expect(converted).toEqual({
        title: 'Test Vacancy',
        description: 'Test Description',
        is_active: true
      })
    })

    it('should map status to is_active correctly', () => {
      const vacancy = {
        title: 'Test Vacancy',
        description: 'Test Description',
        status: 'published' as const
      }

      const converted = (client as any).convertVacancyToApiFormat(vacancy)

      expect(converted).toEqual({
        title: 'Test Vacancy',
        description: 'Test Description',
        is_active: true
      })
    })
  })

  describe('getVacancies', () => {
    it('should call the correct endpoint with parameters', async () => {
      // Mock the base client's get method instead of fetch directly
      const mockGet = vi.spyOn(client, 'get').mockResolvedValueOnce({
        data: {
          items: [
            {
              id: 'test-id',
              title: 'Test Vacancy',
              description: 'Test Description',
              is_active: true,
              author: {
                email: 'test@example.com',
                first_name: 'John',
                last_name: 'Doe',
                avatar: '/avatar.jpg',
                whatsapp: '+1234567890',
                phone: '+1234567890',
                telegram: 'johndoe'
              },
              created_timestamp: '2023-01-01T00:00:00Z',
              updated_timestamp: '2023-01-01T00:00:00Z'
            }
          ],
          count: 1
        },
        status: 200,
        statusText: 'OK',
        headers: {}
      })

      const result = await client.getVacancies({ limit: 10, offset: 0 })

      expect(mockGet).toHaveBeenCalledWith('/api/web/vacancies', { limit: 10, offset: 0 }, expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token'
        })
      }))

      expect(result).toEqual({
        vacancies: expect.arrayContaining([
          expect.objectContaining({
            id: 'test-id',
            title: 'Test Vacancy',
            status: 'published'
          })
        ]),
        page: 1,
        pageSize: 10,
        total: 1,
        hasMore: false
      })

      mockGet.mockRestore()
    })
  })

  describe('createVacancy', () => {
    it('should create vacancy with correct data', async () => {
      const mockResponse: ApiVacancy = {
        id: 'new-id',
        title: 'New Vacancy',
        description: 'New Description',
        is_active: true,
        author: {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          avatar: '/avatar.jpg',
          whatsapp: '+1234567890',
          phone: '+1234567890',
          telegram: 'johndoe'
        },
        created_timestamp: '2023-01-01T00:00:00Z',
        updated_timestamp: '2023-01-01T00:00:00Z'
      }

      const mockPost = vi.spyOn(client, 'post').mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      })

      const vacancyData = {
        title: 'New Vacancy',
        description: 'New Description',
        isActive: true
      }

      const result = await client.createVacancy(vacancyData)

      expect(mockPost).toHaveBeenCalledWith(
        '/api/web/vacancies',
        {
          title: 'New Vacancy',
          description: 'New Description',
          is_active: true
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      )

      expect(result).toEqual(expect.objectContaining({
        id: 'new-id',
        title: 'New Vacancy',
        status: 'published'
      }))

      mockPost.mockRestore()
    })
  })
})
