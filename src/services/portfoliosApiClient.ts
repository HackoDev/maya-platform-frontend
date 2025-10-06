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
  ApiSpecialistProfile,
  ApiSpecialistSearchResponse,
  Skill,
  Specialization,
  Service,
  SkillPaginationResponse,
  SpecializationPaginationResponse,
  ServicePaginationResponse,
  SpecialistSearchProfile,
  SpecialistSearchPaginationResponse,
  PortfolioSearchFilters,
  Attachment,
  AttachmentUploadRequest
} from '@/types/portfolio'
import type { NeuralNetworkProfile, PublicLinkItem } from '@/types/neural-network-profile-simple'

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
   * Convert API specialist profile to frontend specialist format
   */
  private convertApiSpecialistToSpecialist(apiSpecialist: ApiSpecialistProfile): SpecialistSearchProfile {
    return {
      id: apiSpecialist.id,
      userId: apiSpecialist.user.id,
      displayName: `${apiSpecialist.user.firstName} ${apiSpecialist.user.lastName}`,
      superpower: apiSpecialist.superpower,
      avatarUrl: apiSpecialist.user.avatar,
      skills: apiSpecialist.cachedSkills,
      specializations: apiSpecialist.cachedSpecializations,
      services: apiSpecialist.cachedServices,
      contacts: {
        telegram: apiSpecialist.user.telegram,
        email: apiSpecialist.user.email,
        phone: apiSpecialist.user.phone,
        whatsapp: apiSpecialist.user.whatsapp,
      },
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

  /**
   * Search specialists with pagination
   */
  async searchSpecialists(filters?: PortfolioSearchFilters): Promise<SpecialistSearchPaginationResponse> {
    const params: Record<string, any> = {}
    
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset
    if (filters?.search) params.search = filters.search
    if (filters?.status) params.status = filters.status
    if (filters?.skills) params.skills = filters.skills

    const response = await this.authenticatedRequest<ApiSpecialistSearchResponse>('GET', '/api/web/portfolios/search', params)
    
    const convertedSpecialists = response.items.map(apiSpecialist => 
      this.convertApiSpecialistToSpecialist(apiSpecialist)
    )

    // Calculate pagination info
    const limit = filters?.limit || 100
    const offset = filters?.offset || 0
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = (offset + limit) < response.count

    return {
      specialists: convertedSpecialists,
      page: currentPage,
      pageSize: limit,
      total: response.count,
      hasMore,
    }
  }

  /**
   * Get specialist profile by ID
   */
  async getSpecialistById(id: string): Promise<NeuralNetworkProfile> {
    const response = await this.authenticatedRequest<any>('GET', `/api/web/portfolios/${id}`)
    return this.convertMeResponseToSimplifiedProfile(response)
  }

  /**
   * Review (moderate) a specialist portfolio by ID
   * PATCH /api/web/portfolios/{id}/review
   */
  async reviewPortfolio(id: string, payload: { status: 'published' | 'draft' | 'archived' | null; message?: string }): Promise<any> {
    const body = {
      status: payload.status,
      message: payload.message ?? ''
    }
    const response = await this.authenticatedRequest<any>('PATCH', `/api/web/portfolios/${id}/review`, body)
    return response;
  }

  /**
   * Get random specialists for homepage
   */
  async getRandomSpecialists(): Promise<SpecialistSearchProfile[]> {
    const response = await this.authenticatedRequest<ApiSpecialistProfile[]>('GET', '/api/web/portfolios/random')
    return response.map(apiSpecialist => this.convertApiSpecialistToSpecialist(apiSpecialist))
  }

  /**
   * Convert "my portfolio" API response to simplified NeuralNetworkProfile
   */
  private convertMeResponseToSimplifiedProfile(apiData: any): NeuralNetworkProfile {
    return {
      id: apiData.id,
      userId: apiData.user.id,
      status: apiData.status,
      readyForReview: apiData?.readyForReview ?? false,
      createdAt: apiData?.createdTimestamp ?? new Date().toISOString(),
      updatedAt: apiData?.updatedTimestamp ?? new Date().toISOString(),
      // Сохраняем данные пользователя
      user: {
        id: apiData.user.id,
        email: apiData.user.email,
        firstName: apiData.user.firstName,
        lastName: apiData.user.lastName,
        avatar: apiData.user.avatar,
        phone: apiData.user.phone,
        telegram: apiData.user.telegram,
        whatsapp: apiData.user.whatsapp,
        isOpenToOffers: apiData.user.isOpenToOffers,
        generalConsentAccepted: apiData.user.generalConsentAccepted,
      },
      specializations: apiData.specializations,
      customSpecializations: apiData.customSpecializations,
      superpower: apiData.superpower,
      publicLinks: (apiData.publicLinks || []).map(
        (item: Partial<PublicLinkItem>) => {
          return {id: item.url, title: item.title, url: item.url}
        }
      ),
      skills: apiData.skills,
      customSkills: apiData.customSkills,
      portfolio: apiData.portfolioItems || [],
      services: apiData.services || [], // Сохраняем полные данные услуг
      customServices: apiData.customServices || [],
      // Service options may have a different structure on the backend; keep as empty for now
      serviceOptions: apiData.serviceOptions,
      experience: apiData.experience,
      testimonials: apiData.testimonials,
      customContacts: {
        phone: apiData.user.phone,
        telegram: apiData.user.telegram,
        whatsapp: apiData.user.whatsapp,
      },
    }
  }

  /**
   * Fetch current user's portfolio/profile (simplified schema)
   */
  async getMySimplifiedProfile(): Promise<NeuralNetworkProfile> {
    const response = await this.authenticatedRequest<any>('GET', '/api/web/portfolios/me')
    return this.convertMeResponseToSimplifiedProfile(response)
  }

  /**
   * Partially update current user's profile (send only changed fields)
   * Example payloads:
   * { superpower: '...' }
   * { specializations: [1,2], customSpecializations: ['...'] }
   */
  async patchMyProfile(partial: Partial<NeuralNetworkProfile>): Promise<NeuralNetworkProfile> {
    // Backend expects field names aligned with our simplified schema for these blocks
    const payload: Record<string, any> = {}
    if (partial.superpower !== undefined) payload.superpower = partial.superpower
    if (partial.publicLinks !== undefined) payload.publicLinks = partial.publicLinks
    if (partial.readyForReview !== undefined) payload.readyForReview = partial.readyForReview
    if (partial.specializations !== undefined) payload.specializations = partial.specializations.map(spec => spec.id)
    if (partial.customSpecializations !== undefined) payload.customSpecializations = partial.customSpecializations
    if (partial.skills !== undefined) payload.skills = partial.skills.map(skill => skill.id)
    if (partial.customSkills !== undefined) payload.customSkills = partial.customSkills
    if (partial.portfolio !== undefined) payload.portfolioItems = partial.portfolio
    if (partial.services !== undefined) payload.services = partial.services.map(service => service.id)
    if (partial.customServices !== undefined) payload.customServices = partial.customServices
    if (partial.serviceOptions !== undefined) payload.serviceOptions = partial.serviceOptions
    if (partial.experience !== undefined) payload.experience = partial.experience
    if (partial.testimonials !== undefined) payload.testimonials = partial.testimonials
    if (partial.customContacts !== undefined) payload.customContacts = partial.customContacts

    const response = await this.authenticatedRequest<any>('PATCH', '/api/web/portfolios/me', payload)
    return this.convertMeResponseToSimplifiedProfile(response)
  }

  /**
   * Upload attachment file for portfolio
   */
  async uploadAttachment(uploadRequest: AttachmentUploadRequest): Promise<Attachment> {
    const formData = new FormData()
    formData.append('title', uploadRequest.title)
    formData.append('type', uploadRequest.type)
    formData.append('file', uploadRequest.file)

    // Override content type for multipart/form-data
    const config = {
      headers: {
        ...this.getDefaultHeaders(),
        'Content-Type': 'multipart/form-data',
      }
    }

    const response = await this.authenticatedRequest<Attachment>('POST', '/api/web/portfolios/me/attachments', formData, config)
    return response
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
  
  // Specialist search operations
  searchSpecialists: (filters?: PortfolioSearchFilters) => portfoliosApiClient.searchSpecialists(filters),
  getSpecialistById: (id: string) => portfoliosApiClient.getSpecialistById(id),
  reviewPortfolio: (id: string, payload: { status: 'published' | 'draft' | 'archived' | null; message?: string }) => portfoliosApiClient.reviewPortfolio(id, payload),
  getRandomSpecialists: () => portfoliosApiClient.getRandomSpecialists(),
  
  // Simplified Profile operations
  getMySimplifiedProfile: () => portfoliosApiClient.getMySimplifiedProfile(),
  patchMyProfile: (partial: Partial<NeuralNetworkProfile>) => portfoliosApiClient.patchMyProfile(partial),
  
  // Attachment operations
  uploadAttachment: (uploadRequest: AttachmentUploadRequest) => portfoliosApiClient.uploadAttachment(uploadRequest),
}

// Export types
export type { 
  ApiSkill,
  ApiSkillListResponse,
  ApiSpecialization,
  ApiSpecializationListResponse,
  ApiService,
  ApiServiceListResponse,
  ApiSpecialistProfile,
  ApiSpecialistSearchResponse,
  Skill,
  Specialization,
  Service,
  SkillPaginationResponse,
  SpecializationPaginationResponse,
  ServicePaginationResponse,
  SpecialistSearchProfile,
  SpecialistSearchPaginationResponse,
  PortfolioSearchFilters,
  Attachment,
  AttachmentUploadRequest
}
