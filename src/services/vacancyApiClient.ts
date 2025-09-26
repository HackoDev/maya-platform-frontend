/**
 * Vacancy API Client
 * Extends BaseApiClient to handle vacancy CRUD operations
 */

import { AuthApiClient } from './authApiClient'
import { CONTENT_TYPES } from './baseApiClient'
import type { 
  ApiVacancy, 
  ApiVacancyListResponse, 
  Vacancy, 
  CreateVacancyRequest, 
  UpdateVacancyRequest,
  VacancySearchFilters,
  VacancyPaginationResponse
} from '@/types/vacancy'

/**
 * Vacancy API Client class
 * Handles vacancy CRUD operations with authentication
 */
export class VacancyApiClient extends AuthApiClient {
  constructor(baseURL?: string) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const apiBaseURL = baseURL || ''

    // Call AuthApiClient constructor with proper parameters
    super(apiBaseURL)
    
    // Update headers for vacancy API calls
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }

  /**
   * Convert API vacancy to frontend vacancy format
   */
  private convertApiVacancyToVacancy(apiVacancy: ApiVacancy): Vacancy {
    return {
      id: apiVacancy.id,
      title: apiVacancy.title,
      description: apiVacancy.description,
      createdAt: apiVacancy.createdTimestamp,
      updatedAt: apiVacancy.updatedTimestamp,
      clientId: apiVacancy.author.email, // Use email as clientId for now
      clientName: `${apiVacancy.author.firstName} ${apiVacancy.author.lastName}`,
      clientPhone: apiVacancy.author.phone,
      isActive: apiVacancy.isActive,
      author: apiVacancy.author,
    }
  }

  /**
   * Convert frontend vacancy to API format
   */
  private convertVacancyToApiFormat(vacancy: Partial<Vacancy>): CreateVacancyRequest | UpdateVacancyRequest {
    return {
      title: vacancy.title || '',
      description: vacancy.description || '',
      isActive: vacancy.isActive ?? vacancy.isActive,
    }
  }

  /**
   * Get all vacancies with pagination
   */
  async getVacancies(filters?: VacancySearchFilters): Promise<VacancyPaginationResponse> {
    const params: Record<string, any> = {}
    
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset
    if (filters?.isActive !== undefined) params.isActive = filters.isActive

    const response = await this.authenticatedRequest<ApiVacancyListResponse>('GET', '/api/web/vacancies', params)
    
    const convertedVacancies = response.items.map(apiVacancy => 
      this.convertApiVacancyToVacancy(apiVacancy)
    )

    // Calculate pagination info
    const limit = filters?.limit || 10
    const offset = filters?.offset || 0
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = (offset + limit) < response.count

    return {
      vacancies: convertedVacancies,
      page: currentPage,
      pageSize: limit,
        total: response.count,
      hasMore,
    }
  }

  /**
   * Get my vacancies (vacancies created by current user)
   */
  async getMyVacancies(filters?: VacancySearchFilters): Promise<VacancyPaginationResponse> {
    const params: Record<string, any> = {}
    if (filters?.search) params.search = filters.search
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset
    if (filters?.isActive) params.isActive = filters.isActive

    const response = await this.authenticatedRequest<ApiVacancyListResponse>('GET', '/api/web/vacancies/my-vacancies', params)
    
    const convertedVacancies = response.items.map(apiVacancy => 
      this.convertApiVacancyToVacancy(apiVacancy)
    )

    // Calculate pagination info
    const limit = filters?.limit || 10
    const offset = filters?.offset || 0
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = (offset + limit) < response.count

    return {
      vacancies: convertedVacancies,
      page: currentPage,
      pageSize: limit,
        total: response.count,
      hasMore,
    }
  }

  /**
   * Get vacancy by ID
   */
  async getVacancyById(id: string): Promise<Vacancy> {
    const response = await this.authenticatedRequest<ApiVacancy>('GET', `/api/web/vacancies/${id}`)
    return this.convertApiVacancyToVacancy(response)
  }

  /**
   * Create new vacancy
   */
  async createVacancy(vacancyData: Partial<Vacancy>): Promise<Vacancy> {
    const apiData = this.convertVacancyToApiFormat(vacancyData) as CreateVacancyRequest
    
    const response = await this.authenticatedRequest<ApiVacancy>('POST', '/api/web/vacancies', apiData, {
      headers: {
        'Content-Type': CONTENT_TYPES.JSON,
      },
    })
    
    return this.convertApiVacancyToVacancy(response)
  }

  /**
   * Update vacancy
   */
  async updateVacancy(id: string, vacancyData: Partial<Vacancy>): Promise<Vacancy> {
    const apiData = this.convertVacancyToApiFormat(vacancyData) as UpdateVacancyRequest
    
    const response = await this.authenticatedRequest<ApiVacancy>('PATCH', `/api/web/vacancies/${id}`, apiData, {
      headers: {
        'Content-Type': CONTENT_TYPES.JSON,
      },
    })
    
    return this.convertApiVacancyToVacancy(response)
  }

  /**
   * Delete vacancy
   */
  async deleteVacancy(id: string): Promise<{ message: string }> {
    const response = await this.authenticatedRequest<{ message: string }>('DELETE', `/api/web/vacancies/${id}`)
    return response
  }

  /**
   * Get random vacancies for homepage
   */
  async getRandomVacancies(): Promise<Vacancy[]> {
    const response = await this.authenticatedRequest<ApiVacancy[]>('GET', '/api/web/vacancies/random')
    
    return response.map(apiVacancy => 
      this.convertApiVacancyToVacancy(apiVacancy)
    )
  }

  /**
   * Search vacancies with filters
   */
  async searchVacancies(filters: VacancySearchFilters): Promise<VacancyPaginationResponse> {
    return this.getVacancies(filters)
  }
}

// Create default instance
export const vacancyApiClient = new VacancyApiClient()

// Export convenience functions
export const vacancyApi = {
  // List operations
  getVacancies: (filters?: VacancySearchFilters) => vacancyApiClient.getVacancies(filters),
  getMyVacancies: (filters?: VacancySearchFilters) => vacancyApiClient.getMyVacancies(filters),
  getRandomVacancies: () => vacancyApiClient.getRandomVacancies(),
  searchVacancies: (filters: VacancySearchFilters) => vacancyApiClient.searchVacancies(filters),
  
  // CRUD operations
  getVacancyById: (id: string) => vacancyApiClient.getVacancyById(id),
  createVacancy: (vacancyData: Partial<Vacancy>) => vacancyApiClient.createVacancy(vacancyData),
  updateVacancy: (id: string, vacancyData: Partial<Vacancy>) => vacancyApiClient.updateVacancy(id, vacancyData),
  deleteVacancy: (id: string) => vacancyApiClient.deleteVacancy(id),
}

// Export types
export type { 
  ApiVacancy, 
  ApiVacancyListResponse, 
  Vacancy, 
  CreateVacancyRequest, 
  UpdateVacancyRequest,
  VacancySearchFilters,
  VacancyPaginationResponse
}
