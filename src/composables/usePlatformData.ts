import { ref } from 'vue'
import type { Ref } from 'vue'
import { VacancyService } from '@/services/vacancy'
import { PortfolioService } from '@/services/portfolio'
import { SpecialistProfileViewService } from '@/services/specialist-profile-view'
import { portfoliosApi } from '@/services/portfoliosApiClient'
import { vacancyApi } from '@/services/vacancyApiClient'
import type { PlatformStatistics } from '@/types/platform'
import type { Vacancy } from '@/types/vacancy'
import type { PortfolioCase } from '@/types/specialist-profile-view'
import type { SpecialistProfile } from '@/types/specialist-search'
import type { SpecialistSearchProfile } from '@/types/portfolio'

// Extend the PortfolioCase type to include specialistId
interface PortfolioCaseWithSpecialist extends PortfolioCase {
  specialistId?: string
}

const vacancyService = new VacancyService()
const portfolioService = new PortfolioService()
const specialistService = new SpecialistProfileViewService()

export function usePlatformData() {
  const statistics: Ref<PlatformStatistics | null> = ref(null)
  const portfolios: Ref<{portfolio: PortfolioCase, specialist: SpecialistProfile}[]> = ref([])
  const vacancies: Ref<Vacancy[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPlatformData = async () => {
    loading.value = true
    error.value = null

    try {
      // Fetch all data in parallel
      const [portfolioCount, vacancyCount, randomSpecialists, randomVacancies] = await Promise.all([
        portfolioService.getPortfolioStatistics(),
        vacancyService.getVacancyStatistics(),
        portfoliosApi.getRandomSpecialists().catch(() => []), // Fallback to empty array if API fails
        vacancyApi.getRandomVacancies().catch(() => []) // Use new API with fallback
      ])

      statistics.value = {
        portfolioCount,
        vacancyCount
      }

      // Convert API specialists to the format expected by the UI
      const portfoliosWithSpecialists = randomSpecialists.map((specialist) => {
        // Create a mock portfolio case for each specialist
        const mockPortfolio: PortfolioCase = {
          id: `portfolio-${specialist.id}`,
          title: specialist.superpower,
          description: `Специалист по ${specialist.specializations.join(', ')}`,
          type: 'text',
          content: specialist.superpower,
          result: `Навыки: ${specialist.skills.slice(0, 3).join(', ')}`,
          tools: specialist.skills.slice(0, 5),
          createdAt: new Date().toISOString(),
          typeLabel: 'Текст',
          typeIcon: 'document-text'
        }

        // Convert SpecialistSearchProfile to SpecialistProfile
        const convertedSpecialist: SpecialistProfile = {
          id: specialist.id,
          userId: specialist.userId.toString(),
          displayName: specialist.displayName,
          superpower: specialist.superpower,
          avatarUrl: specialist.avatarUrl,
          specializations: specialist.specializations,
          abilities: specialist.skills,
          services: specialist.services.map(service => ({
            name: service,
            price: 'Договорная',
            priceType: 'negotiable' as const,
          })),
          contacts: {
            telegram: specialist.contacts.telegram,
            email: specialist.contacts.email,
            website: undefined,
          },
          status: 'available' as const,
          lastActive: new Date().toISOString(),
        }
        
        return {
          portfolio: mockPortfolio,
          specialist: convertedSpecialist
        }
      })

      portfolios.value = portfoliosWithSpecialists
      vacancies.value = randomVacancies
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch platform data'
      console.error('Error fetching platform data:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    statistics,
    portfolios,
    vacancies,
    loading,
    error,
    fetchPlatformData
  }
}