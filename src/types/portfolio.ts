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
