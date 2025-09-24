/**
 * Portfolio API Client
 * Extends AuthApiClient to handle portfolio data operations (skills, specializations, services)
 */

import { AuthApiClient } from './authApiClient'
import { CONTENT_TYPES } from './baseApiClient'
import type { 
  ApiSkill,
  ApiSkillListResponse,
  ApiSpecialization,
  ApiSpecializationListResponse,
  ApiService,
  ApiServiceListResponse,
  Skill,
  Specialization,
  Service,
  SkillPaginationResponse,
  SpecializationPaginationResponse,
  ServicePaginationResponse,
  PortfolioSearchFilters
} from '@/types/portfolio'

/**
 * Portfolio API Client class
 * Handles portfolio data operations with authentication
 */
export class PortfoliosApiClient extends AuthApiClient {
  constructor(baseURL?: string) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const apiBaseURL = baseURL || ''

    // Call AuthApiClient constructor with proper parameters
    super(apiBaseURL)
    
    // Update headers for portfolio API calls
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }

  /**
   * Convert API skill to frontend skill format
   */
  private convertApiSkillToSkill(apiSkill: ApiSkill): Skill {
    return {
      id: apiSkill.id,
      name: apiSkill.name,
      description: apiSkill.description,
      tags: apiSkill.tags,
    }
  }

  /**
   * Convert API specialization to frontend specialization format
   */
  private convertApiSpecializationToSpecialization(apiSpecialization: ApiSpecialization): Specialization {
    return {
      id: apiSpecialization.id,
      name: apiSpecialization.name,
      description: apiSpecialization.description,
    }
  }

  /**
   * Convert API service to frontend service format
   */
  private convertApiServiceToService(apiService: ApiService): Service {
    return {
      id: apiService.id,
      name: apiService.name,
      description: apiService.description,
      price: apiService.price,
    }
  }

  /**
   * Get all skills with pagination
   */
  async getSkills(filters?: PortfolioSearchFilters): Promise<SkillPaginationResponse> {
    const params: Record<string, any> = {}
    
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset

    const response = await this.authenticatedRequest<ApiSkillListResponse>('GET', '/api/web/portfolios/skills', params)
    
    const convertedSkills = response.items.map(apiSkill => 
      this.convertApiSkillToSkill(apiSkill)
    )

    // Calculate pagination info
    const limit = filters?.limit || 100
    const offset = filters?.offset || 0
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = (offset + limit) < response.count

    return {
      skills: convertedSkills,
      page: currentPage,
      pageSize: limit,
      total: response.count,
      hasMore,
    }
  }

  /**
   * Get all specializations with pagination
   */
  async getSpecializations(filters?: PortfolioSearchFilters): Promise<SpecializationPaginationResponse> {
    const params: Record<string, any> = {}
    
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset

    const response = await this.authenticatedRequest<ApiSpecializationListResponse>('GET', '/api/web/portfolios/specializations', params)
    
    const convertedSpecializations = response.items.map(apiSpecialization => 
      this.convertApiSpecializationToSpecialization(apiSpecialization)
    )

    // Calculate pagination info
    const limit = filters?.limit || 100
    const offset = filters?.offset || 0
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = (offset + limit) < response.count

    return {
      specializations: convertedSpecializations,
      page: currentPage,
      pageSize: limit,
      total: response.count,
      hasMore,
    }
  }

  /**
   * Get all services with pagination
   */
  async getServices(filters?: PortfolioSearchFilters): Promise<ServicePaginationResponse> {
    const params: Record<string, any> = {}
    
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset

    const response = await this.authenticatedRequest<ApiServiceListResponse>('GET', '/api/web/portfolios/services', params)
    
    const convertedServices = response.items.map(apiService => 
      this.convertApiServiceToService(apiService)
    )

    // Calculate pagination info
    const limit = filters?.limit || 100
    const offset = filters?.offset || 0
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = (offset + limit) < response.count

    return {
      services: convertedServices,
      page: currentPage,
      pageSize: limit,
      total: response.count,
      hasMore,
    }
  }

  /**
   * Get skill by ID
   */
  async getSkillById(id: number): Promise<Skill> {
    const response = await this.authenticatedRequest<ApiSkill>('GET', `/api/web/portfolios/skills/${id}`)
    return this.convertApiSkillToSkill(response)
  }

  /**
   * Get specialization by ID
   */
  async getSpecializationById(id: number): Promise<Specialization> {
    const response = await this.authenticatedRequest<ApiSpecialization>('GET', `/api/web/portfolios/specializations/${id}`)
    return this.convertApiSpecializationToSpecialization(response)
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: number): Promise<Service> {
    const response = await this.authenticatedRequest<ApiService>('GET', `/api/web/portfolios/services/${id}`)
    return this.convertApiServiceToService(response)
  }
}

// Create default instance
export const portfoliosApiClient = new PortfoliosApiClient()

// Export convenience functions
export const portfoliosApi = {
  // Skills operations
  getSkills: (filters?: PortfolioSearchFilters) => portfoliosApiClient.getSkills(filters),
  getSkillById: (id: number) => portfoliosApiClient.getSkillById(id),
  
  // Specializations operations
  getSpecializations: (filters?: PortfolioSearchFilters) => portfoliosApiClient.getSpecializations(filters),
  getSpecializationById: (id: number) => portfoliosApiClient.getSpecializationById(id),
  
  // Services operations
  getServices: (filters?: PortfolioSearchFilters) => portfoliosApiClient.getServices(filters),
  getServiceById: (id: number) => portfoliosApiClient.getServiceById(id),
}

// Export types
export type { 
  ApiSkill,
  ApiSkillListResponse,
  ApiSpecialization,
  ApiSpecializationListResponse,
  ApiService,
  ApiServiceListResponse,
  Skill,
  Specialization,
  Service,
  SkillPaginationResponse,
  SpecializationPaginationResponse,
  ServicePaginationResponse,
  PortfolioSearchFilters
}
