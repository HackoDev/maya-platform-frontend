import type { FakeVacancy } from '@/services/fakeVacancyService'

// Vacancy data model and types

export interface Vacancy {
  id: string
  title: string
  description: string
  status: 'draft' | 'published' | 'closed'
  createdAt: string
  updatedAt: string
  clientId: string
  clientName: string // New field
  clientPhone: string // New field
  _fakeData?: FakeVacancy // Optional field to store fake data for contact info
}

export interface VacancyPaginationResponse {
  vacancies: Vacancy[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface VacancySearchFilters {
  query?: string
  status?: string[]
  page?: number
  limit?: number
}

export interface VacancyStoreState {
  vacancies: Vacancy[]
  loading: boolean
  error: string | null
  searchQuery: string
}