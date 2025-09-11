// Specialist search type definitions

export interface SpecialistProfile {
  id: string
  userId: string

  // Basic info
  displayName: string
  superpower: string
  avatarUrl?: string

  // Skills and specializations (from questionnaire)
  specializations: string[]
  abilities: string[]

  // Services and pricing
  services: ServiceSummary[]

  // Contact info
  contacts: {
    telegram?: string
    email?: string
    website?: string
  }

  // Metadata
  rating?: number
  reviewCount?: number
  completedProjects?: number
  responseTime?: string
  status: 'available' | 'busy' | 'unavailable'
  lastActive: string
}

export interface ServiceSummary {
  name: string
  price: number | string
  priceType: 'fixed' | 'hourly' | 'project' | 'negotiable'
}

export interface SkillOption {
  key: string
  label: string
  category: 'specialization' | 'ability'
  description?: string
}

export interface SearchFilters {
  query?: string
  skills: string[]
  priceRange?: {
    min?: number
    max?: number
  }
  // Pagination parameters
  page?: number
  limit?: number
}

export interface SearchResults {
  specialists: SpecialistProfile[]
  total: number
  currentPage: number
  totalPages: number
  hasMore: boolean
  facets: {
    skills: { key: string; count: number }[]
    specializations: { key: string; count: number }[]
  }
}

// Infinite scroll state management
export interface InfiniteScrollState {
  isLoadingMore: boolean
  hasReachedEnd: boolean
  currentPage: number
  pageSize: number
}

// Component prop interfaces
export interface SpecialistSearchFiltersProps {
  onSearch: (filters: Partial<SearchFilters>) => void
  loading: boolean
}

export interface MultiSkillSelectorProps {
  modelValue: string[]
  options: SkillOption[]
  placeholder?: string
  maxSelections?: number
}

export interface SpecialistSearchResultsProps {
  specialists: SpecialistProfile[]
  loading: boolean
  empty: boolean
  canLoadMore: boolean
  onLoadMore: () => void
}

export interface SpecialistCardProps {
  specialist: SpecialistProfile
}

export interface ContactButtonsProps {
  contacts: SpecialistProfile['contacts']
  specialistName: string
}

// Search summary interface
export interface SearchSummary {
  total: number
  query?: string
  skillsCount: number
  hasFilters: boolean
}