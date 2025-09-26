/**
 * Tests for VacancyApiClient
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VacancyApiClient } from '../vacancyApiClient'
import type { ApiVacancy, ApiVacancyListResponse } from '../../types/vacancy'

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
        isActive: true,
        author: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: '/avatar.jpg',
          whatsapp: '+1234567890',
          phone: '+1234567890',
          telegram: 'johndoe'
        },
        createdTimestamp: '2023-01-01T00:00:00Z',
        updatedTimestamp: '2023-01-01T00:00:00Z'
      }

      // Access private method through type assertion for testing
      const converted = (client as any).convertApiVacancyToVacancy(apiVacancy)

      expect(converted).toEqual({
        id: 'test-id',
        title: 'Test Vacancy',
        description: 'Test Description',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        clientId: 'test@example.com',
        clientName: 'John Doe',
        clientPhone: '+1234567890',
        isActive: true,
        author: apiVacancy.author
      })
    })

    it('should handle isActive: false correctly', () => {
      const apiVacancy: ApiVacancy = {
        id: 'test-id',
        title: 'Test Vacancy',
        description: 'Test Description',
        isActive: false,
        author: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: '/avatar.jpg',
          whatsapp: '+1234567890',
          phone: '+1234567890',
          telegram: 'johndoe'
        },
        createdTimestamp: '2023-01-01T00:00:00Z',
        updatedTimestamp: '2023-01-01T00:00:00Z'
      }

      const converted = (client as any).convertApiVacancyToVacancy(apiVacancy)
      expect(converted.isActive).toBe(false)
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
        isActive: true
      })
    })

    it('should handle isActive correctly', () => {
      const vacancy = {
        title: 'Test Vacancy',
        description: 'Test Description',
        isActive: false
      }

      const converted = (client as any).convertVacancyToApiFormat(vacancy)

      expect(converted).toEqual({
        title: 'Test Vacancy',
        description: 'Test Description',
        isActive: false
      })
    })
  })

  describe('getVacancies', () => {
    it('should call the correct endpoint with parameters', async () => {
      const mockResponse = {
        items: [
          {
            id: 'test-id',
            title: 'Test Vacancy',
            description: 'Test Description',
            isActive: true,
            author: {
              id: '1',
              email: 'test@example.com',
              firstName: 'John',
              lastName: 'Doe',
              avatar: '/avatar.jpg',
              whatsapp: '+1234567890',
              phone: '+1234567890',
              telegram: 'johndoe'
            },
            createdTimestamp: '2023-01-01T00:00:00Z',
            updatedTimestamp: '2023-01-01T00:00:00Z'
          }
        ],
        count: 1
      }

      const mockGet = vi.spyOn(client, 'authenticatedRequest').mockResolvedValueOnce(mockResponse)

      const result = await client.getVacancies({ limit: 10, offset: 0 })

      expect(mockGet).toHaveBeenCalledWith('GET', '/api/web/vacancies', { limit: 10, offset: 0 })

      expect(result).toEqual({
        vacancies: expect.arrayContaining([
          expect.objectContaining({
            id: 'test-id',
            title: 'Test Vacancy',
            isActive: true
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

  describe('getRandomVacancies', () => {
    it('should fetch random vacancies from the correct endpoint', async () => {
      const mockResponse: ApiVacancy[] = [
        {
          id: 'random-1',
          title: 'Random Vacancy 1',
          description: 'Random Description 1',
          isActive: true,
          author: {
            id: '1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            avatar: '/avatar.jpg',
            whatsapp: '+1234567890',
            phone: '+1234567890',
            telegram: 'johndoe'
          },
          createdTimestamp: '2023-01-01T00:00:00Z',
          updatedTimestamp: '2023-01-01T00:00:00Z'
        },
        {
          id: 'random-2',
          title: 'Random Vacancy 2',
          description: 'Random Description 2',
          isActive: true,
          author: {
            id: '2',
            email: 'test2@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            avatar: '/avatar2.jpg',
            whatsapp: '+1234567891',
            phone: '+1234567891',
            telegram: 'janesmith'
          },
          createdTimestamp: '2023-01-02T00:00:00Z',
          updatedTimestamp: '2023-01-02T00:00:00Z'
        }
      ]

      const mockGet = vi.spyOn(client, 'authenticatedRequest').mockResolvedValueOnce(mockResponse)

      const result = await client.getRandomVacancies()

      expect(mockGet).toHaveBeenCalledWith('GET', '/api/web/vacancies/random')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(expect.objectContaining({
        id: 'random-1',
        title: 'Random Vacancy 1',
        clientId: 'test@example.com',
        clientName: 'John Doe'
      }))
      expect(result[1]).toEqual(expect.objectContaining({
        id: 'random-2',
        title: 'Random Vacancy 2',
        clientId: 'test2@example.com',
        clientName: 'Jane Smith'
      }))

      mockGet.mockRestore()
    })
  })

  describe('createVacancy', () => {
    it('should create vacancy with correct data', async () => {
      const mockResponse: ApiVacancy = {
        id: 'new-id',
        title: 'New Vacancy',
        description: 'New Description',
        isActive: true,
        author: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: '/avatar.jpg',
          whatsapp: '+1234567890',
          phone: '+1234567890',
          telegram: 'johndoe'
        },
        createdTimestamp: '2023-01-01T00:00:00Z',
        updatedTimestamp: '2023-01-01T00:00:00Z'
      }

      const mockPost = vi.spyOn(client, 'authenticatedRequest').mockResolvedValueOnce(mockResponse)

      const vacancyData = {
        title: 'New Vacancy',
        description: 'New Description',
        isActive: true
      }

      const result = await client.createVacancy(vacancyData)

      expect(mockPost).toHaveBeenCalledWith(
        'POST',
        '/api/web/vacancies',
        {
          title: 'New Vacancy',
          description: 'New Description',
          isActive: true
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )

      expect(result).toEqual(expect.objectContaining({
        id: 'new-id',
        title: 'New Vacancy',
        isActive: true
      }))

      mockPost.mockRestore()
    })
  })
})
