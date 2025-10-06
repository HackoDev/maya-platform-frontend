// Portfolio data model and types

// Skill interface matching API response
export interface ApiSkill {
  id: number
  name: string
  description: string
  tags: string[]
}

// Specialization interface matching API response
export interface ApiSpecialization {
  id: number
  name: string
  description: string
}

// Service interface matching API response
export interface ApiService {
  id: number
  name: string
  description: string
  price: string
}

// API pagination response interfaces
export interface ApiSkillListResponse {
  items: ApiSkill[]
  count: number
}

export interface ApiSpecializationListResponse {
  items: ApiSpecialization[]
  count: number
}

export interface ApiServiceListResponse {
  items: ApiService[]
  count: number
}

// Frontend interfaces (compatible with existing code patterns)
export interface Skill {
  id: number
  name: string
  description: string
  tags: string[]
}

export interface Specialization {
  id: number
  name: string
  description: string
}

export interface Service {
  id: number
  name: string
  description: string
  price: string
}

// Frontend pagination response interfaces
export interface SkillPaginationResponse {
  skills: Skill[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface SpecializationPaginationResponse {
  specializations: Specialization[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface ServicePaginationResponse {
  services: Service[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

// Search filters interfaces
export interface PortfolioSearchFilters {
  limit?: number
  offset?: number
  search?: string
  status?: string
  skills?: string[]
}

// Attachment interfaces
export interface Attachment {
  id: string
  title: string
  type: string
  url: string
}

export interface AttachmentUploadRequest {
  title: string
  type: string
  file: File
}

// Specialist search API interfaces
export interface ApiSpecialistUser {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar?: string
  whatsapp?: string
  phone?: string
  telegram?: string
}

export interface ApiSpecialistProfile {
  id: string
  user: ApiSpecialistUser
  superpower: string
  cachedSkills: string[]
  cachedSpecializations: string[]
  cachedServices: string[]
}

export interface ApiSpecialistSearchResponse {
  items: ApiSpecialistProfile[]
  count: number
}

// Frontend specialist profile interface for search results
export interface SpecialistSearchProfile {
  id: string
  userId: number
  displayName: string
  superpower: string
  avatarUrl?: string
  skills: string[]
  specializations: string[]
  services: string[]
  contacts: {
    telegram?: string
    email?: string
    phone?: string
    whatsapp?: string
  }
}

export interface SpecialistSearchPaginationResponse {
  specialists: SpecialistSearchProfile[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

// Store state interfaces
export interface SkillStoreState {
  skills: Skill[]
  loading: boolean
  error: string | null
}

export interface SpecializationStoreState {
  specializations: Specialization[]
  loading: boolean
  error: string | null
}

export interface ServiceStoreState {
  services: Service[]
  loading: boolean
  error: string | null
}
