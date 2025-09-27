import type {
  SpecialistProfile,
  SkillOption,
  SearchFilters,
  SearchResults,
} from '@/types/specialist-search'
import { portfoliosApi } from './portfoliosApiClient'
import type { SpecialistSearchProfile } from '@/types/portfolio'

export class SpecialistSearchService {
  /**
   * Convert API specialist profile to frontend SpecialistProfile format
   */
  private convertApiSpecialistToSpecialistProfile(apiSpecialist: SpecialistSearchProfile): SpecialistProfile {
    return {
      id: apiSpecialist.id,
      userId: apiSpecialist.userId.toString(),
      displayName: apiSpecialist.displayName,
      superpower: apiSpecialist.superpower,
      avatarUrl: apiSpecialist.avatarUrl,
      specializations: apiSpecialist.specializations,
      abilities: apiSpecialist.skills, // Map skills to abilities
      services: apiSpecialist.services.map(service => ({
        name: service,
        price: 'Договорная',
        priceType: 'negotiable' as const,
      })),
      contacts: {
        telegram: apiSpecialist.contacts.telegram,
        email: apiSpecialist.contacts.email,
        website: undefined, // Not available in API response
      },
      status: 'available' as const, // Default status
      lastActive: new Date().toISOString(),
    }
  }

  async searchSpecialists(filters: SearchFilters): Promise<SearchResults> {
    try {
      // Use real API for specialist search
      const page = filters.page || 1
      const limit = filters.limit || 5
      const offset = (page - 1) * limit

      const apiFilters = {
        limit,
        offset,
        search: filters.query,
        status: filters.status,
      }

      const response = await portfoliosApi.searchSpecialists(apiFilters)
      
      // Convert API specialists to frontend format
      const specialists = response.specialists.map(apiSpecialist => 
        this.convertApiSpecialistToSpecialistProfile(apiSpecialist)
      )

      return {
        specialists,
        total: response.total,
        currentPage: response.page,
        totalPages: Math.ceil(response.total / response.pageSize),
        hasMore: response.hasMore,
      }
    } catch (error) {
      console.error('API search failed, falling back to fake data:', error)

      throw error
      
      // Fallback to fake data if API fails
    }
  }
}