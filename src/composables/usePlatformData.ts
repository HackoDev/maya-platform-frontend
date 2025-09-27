import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { VacancyService } from '@/services/vacancy'
import { PortfolioService } from '@/services/portfolio'
import { portfoliosApi } from '@/services/portfoliosApiClient'
import { vacancyApi } from '@/services/vacancyApiClient'
import type { PlatformStatistics } from '@/types/platform'
import type { Vacancy } from '@/types/vacancy'
import type { PortfolioCase } from '@/types/specialist-profile-view'
import type { SpecialistProfile } from '@/types/specialist-search'
import type { SpecialistSearchProfile } from '@/types/portfolio'

const vacancyService = new VacancyService()
const portfolioService = new PortfolioService()

export function usePlatformData(userType?: string | Ref<string | undefined>) {
  const statistics: Ref<PlatformStatistics | null> = ref(null)
  const portfolios: Ref<{portfolio: PortfolioCase, specialist: SpecialistProfile}[]> = ref([])
  const vacancies: Ref<Vacancy[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Handle both string and reactive userType
  const currentUserType = computed(() => {
    return typeof userType === 'string' ? userType : userType?.value
  })

  const fetchPlatformData = async () => {
    loading.value = true
    error.value = null

    try {
      // Prepare promises array based on user type
      const promises: Promise<any>[] = []
      const promiseLabels: string[] = []

      // Always fetch statistics
      promises.push(portfolioService.getPortfolioStatistics())
      promiseLabels.push('portfolioStats')
      
      promises.push(vacancyService.getVacancyStatistics())
      promiseLabels.push('vacancyStats')

      // Conditionally fetch data based on user type
      if (currentUserType.value === 'client') {
        // For clients, fetch portfolios/specialists
        promises.push(portfoliosApi.getRandomSpecialists().catch(() => []))
        promiseLabels.push('specialists')
      } else if (currentUserType.value === 'specialist') {
        // For specialists, fetch vacancies
        promises.push(vacancyApi.getRandomVacancies().catch(() => []))
        promiseLabels.push('vacancies')
      } else {
        // For unknown user types, fetch both (fallback behavior)
        promises.push(portfoliosApi.getRandomSpecialists().catch(() => []))
        promiseLabels.push('specialists')
        promises.push(vacancyApi.getRandomVacancies().catch(() => []))
        promiseLabels.push('vacancies')
      }

      // Execute all promises
      const results = await Promise.all(promises)

      // Parse results
      const portfolioCount = results[0]
      const vacancyCount = results[1]
      
      statistics.value = {
        portfolioCount,
        vacancyCount
      }

      // Process data based on what was fetched
      if (currentUserType.value === 'client') {
        const randomSpecialists = results[2]
        
        // Convert API specialists to the format expected by the UI
        const portfoliosWithSpecialists = randomSpecialists.map((specialist: SpecialistSearchProfile) => {
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
            services: specialist.services.map((service: string) => ({
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
        vacancies.value = [] // Clear vacancies for clients
        
      } else if (currentUserType.value === 'specialist') {
        const randomVacancies = results[2]
        vacancies.value = randomVacancies
        portfolios.value = [] // Clear portfolios for specialists
        
      } else {
        // Fallback: fetch both (original behavior)
        const randomSpecialists = results[2]
        const randomVacancies = results[3]
        
        // Convert API specialists to the format expected by the UI
        const portfoliosWithSpecialists = randomSpecialists.map((specialist: SpecialistSearchProfile) => {
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
            services: specialist.services.map((service: string) => ({
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
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch platform data'
      console.error('Error fetching platform data:', err)
    } finally {
      loading.value = false
    }
  }

  // Watch for user type changes and refetch data
  if (typeof userType !== 'string' && userType) {
    watch(currentUserType, (newUserType, oldUserType) => {
      if (newUserType && newUserType !== oldUserType) {
        console.log(`🔄 User type changed from ${oldUserType} to ${newUserType}, refetching data...`)
        fetchPlatformData()
      }
    }, { immediate: false })
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