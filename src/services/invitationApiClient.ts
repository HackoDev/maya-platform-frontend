/**
 * Invitation API Client
 * Extends BaseApiClient to handle invitation CRUD operations
 */

import { AuthApiClient } from './authApiClient'
import { CONTENT_TYPES } from './baseApiClient'
import type { 
  ApiInvitation, 
  ApiInvitationListResponse, 
  Invitation, 
  CreateInvitationRequest, 
  UpdateInvitationRequest,
  InvitationSearchFilters,
  InvitationPaginationResponse,
  InvitationUser,
  InvitationUsersResponse,
  InvitationUsersFilters,
  InvitationRegistrationRequest,
  InvitationRegistrationResponse
} from '@/types/invitation'

/**
 * Invitation API Client class
 * Handles invitation CRUD operations with authentication
 */
export class InvitationApiClient extends AuthApiClient {
  constructor(baseURL?: string) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const apiBaseURL = baseURL || ''

    // Call AuthApiClient constructor with proper parameters
    super(apiBaseURL)
    
    // Update headers for invitation API calls
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }

  /**
   * Convert API invitation to frontend invitation format
   */
  private convertApiInvitationToInvitation(apiInvitation: ApiInvitation): Invitation {
    return {
      id: apiInvitation.id,
      userType: apiInvitation.userType,
      expiresAt: apiInvitation.expiresAt,
      isActive: apiInvitation.isActive,
      token: apiInvitation.token,
      registrationsCount: apiInvitation.registrationsCount,
      createdAt: apiInvitation.createdTimestamp,
      updatedAt: apiInvitation.updatedTimestamp,
      isOneTime: apiInvitation.isOneTime,
      isExpired: apiInvitation.isExpired,
    }
  }

  /** Build payload for create */
  private buildCreatePayload(invitation: Partial<Invitation>): CreateInvitationRequest {
    return {
      userType: invitation.userType || 'client',
      expiresAfter: invitation.expiresAfter,
      count: invitation.count,
      isOneTime: invitation.isOneTime,
    }
  }

  /** Build payload for update */
  private buildUpdatePayload(invitation: Partial<Invitation>): UpdateInvitationRequest {
    const payload: UpdateInvitationRequest = {}
    if (typeof invitation.isActive === 'boolean') payload.isActive = invitation.isActive
    if (typeof invitation.expiresAt === 'string') payload.expiresAt = invitation.expiresAt
    return payload
  }

  /**
   * Get all invitations with pagination
   */
  async getInvitations(filters?: InvitationSearchFilters): Promise<InvitationPaginationResponse> {
    const params: Record<string, any> = {}
    
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset
    if (filters?.userType) params.userType = filters.userType
    if (filters?.isActive !== undefined) params.isActive = filters.isActive
    if (filters?.id) params.id = filters.id

    const response = await this.authenticatedRequest<ApiInvitationListResponse>('GET', '/api/web/invitations', params)
    
    const convertedInvitations = response.items.map(apiInvitation => 
      this.convertApiInvitationToInvitation(apiInvitation)
    )

    // Calculate pagination info
    const limit = filters?.limit || 10
    const offset = filters?.offset || 0
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = (offset + limit) < response.count

    return {
      invitations: convertedInvitations,
      page: currentPage,
      pageSize: limit,
      total: response.count,
      hasMore,
    }
  }

  /**
   * Get invitation by ID
   */
  async getInvitationById(id: string): Promise<Invitation> {
    const response = await this.authenticatedRequest<ApiInvitation>('GET', `/api/web/invitations/${id}`)
    return this.convertApiInvitationToInvitation(response)
  }

  /**
   * Create new invitation
   */
  async createInvitation(invitationData: Partial<Invitation>): Promise<Invitation> {
    const apiData = this.buildCreatePayload(invitationData)
    
    const response = await this.authenticatedRequest<ApiInvitation>('POST', '/api/web/invitations', apiData, {
      headers: {
        'Content-Type': CONTENT_TYPES.JSON,
      },
    })
    
    return this.convertApiInvitationToInvitation(response)
  }

  /**
   * Update invitation
   */
  async updateInvitation(id: string, invitationData: Partial<Invitation>): Promise<Invitation> {
    const apiData = this.buildUpdatePayload(invitationData)
    
    const response = await this.authenticatedRequest<ApiInvitation>('PATCH', `/api/web/invitations/${id}`, apiData, {
      headers: {
        'Content-Type': CONTENT_TYPES.JSON,
      },
    })
    
    return this.convertApiInvitationToInvitation(response)
  }

  /**
   * Delete invitation
   */
  async deleteInvitation(id: string): Promise<{ message: string }> {
    const response = await this.authenticatedRequest<{ message: string }>('DELETE', `/api/web/invitations/${id}`)
    return response
  }

  /**
   * Search invitations with filters
   */
  async searchInvitations(filters: InvitationSearchFilters): Promise<InvitationPaginationResponse> {
    return this.getInvitations(filters)
  }

  /**
   * Get users registered through a specific invitation
   */
  async getInvitationUsers(invitationId: string, filters?: InvitationUsersFilters): Promise<InvitationUsersResponse> {
    const params: Record<string, any> = {}
    
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset !== undefined) params.offset = filters.offset

    const response = await this.authenticatedRequest<InvitationUsersResponse>('GET', `/api/web/invitations/${invitationId}/users`, params)
    return response
  }

  /**
   * Register user by invitation
   */
  async registerByInvitation(registrationData: InvitationRegistrationRequest): Promise<InvitationRegistrationResponse> {
    const response = await this.nonAuthenticatedRequest<InvitationRegistrationResponse>('POST', '/api/web/invitations/register', registrationData, {
      headers: {
        'Content-Type': CONTENT_TYPES.JSON,
      },
    })
    return response
  }
}

// Create default instance
export const invitationApiClient = new InvitationApiClient()

// Export convenience functions
export const invitationApi = {
  // List operations
  getInvitations: (filters?: InvitationSearchFilters) => invitationApiClient.getInvitations(filters),
  searchInvitations: (filters: InvitationSearchFilters) => invitationApiClient.searchInvitations(filters),
  
  // CRUD operations
  getInvitationById: (id: string) => invitationApiClient.getInvitationById(id),
  createInvitation: (invitationData: Partial<Invitation>) => invitationApiClient.createInvitation(invitationData),
  updateInvitation: (id: string, invitationData: Partial<Invitation>) => invitationApiClient.updateInvitation(id, invitationData),
  deleteInvitation: (id: string) => invitationApiClient.deleteInvitation(id),
  
  // Users operations
  getInvitationUsers: (invitationId: string, filters?: InvitationUsersFilters) => invitationApiClient.getInvitationUsers(invitationId, filters),
  
  // Registration operations
  registerByInvitation: (registrationData: InvitationRegistrationRequest) => invitationApiClient.registerByInvitation(registrationData),
}

// Export types
export type { 
  ApiInvitation, 
  ApiInvitationListResponse, 
  Invitation, 
  CreateInvitationRequest, 
  UpdateInvitationRequest,
  InvitationSearchFilters,
  InvitationPaginationResponse,
  InvitationUser,
  InvitationUsersResponse,
  InvitationUsersFilters,
  InvitationRegistrationRequest,
  InvitationRegistrationResponse
}
