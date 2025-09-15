import { ref } from 'vue'
import type { Ref } from 'vue'
import { VacancyService } from '@/services/vacancy'
import { PortfolioService } from '@/services/portfolio'
import { SpecialistProfileViewService } from '@/services/specialist-profile-view'
import type { PlatformStatistics } from '@/types/platform'
import type { Vacancy } from '@/types/vacancy'
import type { PortfolioCase } from '@/types/specialist-profile-view'
import type { SpecialistProfile } from '@/types/specialist-search'

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
      const [portfolioCount, vacancyCount, randomPortfolios, randomVacancies] = await Promise.all([
        portfolioService.getPortfolioStatistics(),
        vacancyService.getVacancyStatistics(),
        portfolioService.getRandomPortfolios(5),
        vacancyService.getRandomPublishedVacancies(5)
      ])

      statistics.value = {
        portfolioCount,
        vacancyCount
      }

      // Fetch specialist data for each portfolio
      const portfoliosWithSpecialists = await Promise.all(
        randomPortfolios.map(async (portfolio) => {
          // For mock data, we'll create a mock specialist profile
          // In a real implementation, we would fetch the actual specialist data
          const mockSpecialist: SpecialistProfile = {
            id: (portfolio as PortfolioCaseWithSpecialist).specialistId || 'specialist-1',
            userId: 'user-1',
            displayName: 'Анна Иванова',
            superpower: 'Создаю AI-ассистентов для автоматизации бизнес-процессов и увеличения продаж',
            avatarUrl: undefined,
            specializations: ['Нейроассистенты (AI-боты)', 'Нейроворонки (продажи + автоматизация)'],
            abilities: ['Собираю нейроворонки (от лида до оплаты)', 'Создаю персональных AI-ассистентов'],
            services: [
              {
                name: 'Нейроассистент под ключ',
                price: 15000,
                priceType: 'fixed',
              },
              {
                name: 'Консультация по AI',
                price: 2000,
                priceType: 'hourly',
              },
            ],
            contacts: {
              telegram: '@anna_ai_expert',
              email: 'anna@example.com',
            },
            status: 'available',
            lastActive: '2024-01-15T10:30:00Z',
          }
          
          return {
            portfolio,
            specialist: mockSpecialist
          }
        })
      )

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