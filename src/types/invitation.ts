/**
 * Invitation types
 * Types for invitation management system
 */

export interface ApiInvitation {
  id: string
  userType: 'client' | 'specialist'
  expiresAt: string
  isActive: boolean
  token: string
  registrationsCount: number
  createdTimestamp: string
  updatedTimestamp: string
  isOneTime?: boolean
  isExpired?: boolean
}

export interface ApiInvitationListResponse {
  items: ApiInvitation[]
  count: number
}

export interface Invitation {
  id: string
  userType: 'client' | 'specialist'
  expiresAt: string
  isActive: boolean
  token: string
  registrationsCount: number
  createdAt: string
  updatedAt: string
  count?: number
  isOneTime?: boolean
  expiresAfter?: number
  isExpired?: boolean
}

export interface InvitationSearchFilters {
  limit?: number
  offset?: number
  userType?: 'client' | 'specialist'
  isActive?: boolean
  id?: string
}

export interface InvitationPaginationResponse {
  invitations: Invitation[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface CreateInvitationRequest {
  userType: 'client' | 'specialist'
  expiresAfter?: number
  count?: number
  isOneTime?: boolean
}

export interface UpdateInvitationRequest {
  isActive?: boolean
  expiresAt?: string
}

export interface InvitationUser {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string | null
  dateJoined: string
  lastLogin: string
}

export interface InvitationUsersResponse {
  items: InvitationUser[]
  count: number
}

export interface InvitationUsersFilters {
  limit?: number
  offset?: number
}

export interface InvitationRegistrationRequest {
  token: string
  invitationId: string
  confirmPassword: string
  consent: boolean
  email: string
  firstName: string
  lastName: string
  password: string
  phone: string
}

export interface InvitationRegistrationResponse {
  message: string
}
