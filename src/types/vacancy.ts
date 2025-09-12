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
}

export interface VacancyStoreState {
  vacancies: Vacancy[]
  loading: boolean
  error: string | null
  searchQuery: string
}