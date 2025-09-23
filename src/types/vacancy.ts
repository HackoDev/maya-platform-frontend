import type { FakeVacancy } from '@/services/fakeVacancyService'

// Vacancy data model and types

// Author interface matching API response
export interface VacancyAuthor {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  whatsapp: string
  phone: string
  telegram: string
}

// API response vacancy interface
export interface ApiVacancy {
  id: string
  title: string
  description: string
  isActive: boolean
  author: VacancyAuthor
  createdTimestamp: string
  updatedTimestamp: string
}

// Frontend vacancy interface (compatible with existing code)
export interface Vacancy {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  clientId: string
  clientName: string
  clientPhone: string
  isActive: boolean
  author: VacancyAuthor
  _fakeData?: FakeVacancy // Optional field to store fake data for contact info
}

// API pagination response interface
export interface ApiVacancyListResponse {
  items: ApiVacancy[]
  count: number
}

// Frontend pagination response interface (compatible with existing code)
export interface VacancyPaginationResponse {
  vacancies: Vacancy[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

// Create vacancy request interface
export interface CreateVacancyRequest {
  title: string
  description: string
  isActive: boolean
}

// Update vacancy request interface
export interface UpdateVacancyRequest {
  title?: string
  description?: string
  isActive?: boolean
}

// Search filters interface
export interface VacancySearchFilters {
  query?: string
  search?: string
  page?: number
  limit?: number
  offset?: number
  isActive?: string
}

export interface VacancyStoreState {
  vacancies: Vacancy[]
  loading: boolean
  error: string | null
  searchQuery: string
}