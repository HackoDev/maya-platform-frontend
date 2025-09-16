import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useUserStore } from '@/stores/user'
import { createWrapper, flushPromises, waitForComponent } from '../utils/test-helpers'
import { createMockUser, createMockPlatformData } from '../utils/mock-factories'
import HomePage from '@/pages/HomePage.vue'
import type { User } from '@/types'

// Mock the platform data composable with more realistic behavior
const mockPlatformData = {
  portfolios: [],
  vacancies: [],
  loading: false,
  error: null,
  fetchPlatformData: vi.fn()
}

vi.mock('@/composables/usePlatformData', () => ({
  usePlatformData: () => mockPlatformData
}))

// Mock the router
const mockPush = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
      currentRoute: { value: { path: '/' } }
    })
  }
})

describe('HomePage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPlatformData.loading = false
    mockPlatformData.error = null
    mockPlatformData.portfolios = []
    mockPlatformData.vacancies = []
  })

  describe('Client User Flow', () => {
    it('loads and displays portfolio data for client users', async () => {
      // Setup mock data
      const mockPortfolios = createMockPlatformData('client').portfolios
      mockPlatformData.portfolios = mockPortfolios

      // Create client user
      const clientUser = createMockUser({ 
        userType: 'client', 
        firstName: 'John',
        lastName: 'Client' 
      })

      // Mount component with user
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: clientUser }
              }
            })
          ]
        }
      })

      // Wait for component to initialize
      await waitForComponent(wrapper)

      // Verify data fetching was triggered
      expect(mockPlatformData.fetchPlatformData).toHaveBeenCalled()

      // Verify client-specific content is displayed
      expect(wrapper.text()).toContain('Добро пожаловать, John!')
      expect(wrapper.text()).toContain('находить специалистов для ваших проектов')
      expect(wrapper.text()).toContain('Портфолио специалистов')

      // Verify portfolio cards are rendered in grid
      const gridContainer = wrapper.find('.grid')
      expect(gridContainer.exists()).toBe(true)
      expect(gridContainer.classes()).toEqual(
        expect.arrayContaining(['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6'])
      )
    })

    it('handles navigation to specialist search', async () => {
      const clientUser = createMockUser({ userType: 'client' })
      
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: clientUser }
              }
            })
          ]
        }
      })

      await waitForComponent(wrapper)

      // Find and click the search specialists link
      const searchLink = wrapper.find('a[href*=\"search/specialists\"]')
      expect(searchLink.exists()).toBe(true)
      expect(searchLink.text()).toContain('Найти специалиста')
    })
  })

  describe('Specialist User Flow', () => {
    it('loads and displays vacancy data for specialist users', async () => {
      // Setup mock data
      const mockVacancies = createMockPlatformData('specialist').vacancies
      mockPlatformData.vacancies = mockVacancies

      // Create specialist user
      const specialistUser = createMockUser({ 
        userType: 'specialist', 
        firstName: 'Jane',
        lastName: 'Developer' 
      })

      // Mount component with user
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: specialistUser }
              }
            })
          ]
        }
      })

      // Wait for component to initialize
      await waitForComponent(wrapper)

      // Verify data fetching was triggered
      expect(mockPlatformData.fetchPlatformData).toHaveBeenCalled()

      // Verify specialist-specific content is displayed
      expect(wrapper.text()).toContain('Добро пожаловать, Jane!')
      expect(wrapper.text()).toContain('находить интересные вакансии для работы')
      expect(wrapper.text()).toContain('Последние вакансии')

      // Verify vacancy cards are rendered in grid
      const gridContainer = wrapper.find('.grid')
      expect(gridContainer.exists()).toBe(true)
      expect(gridContainer.classes()).toEqual(
        expect.arrayContaining(['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6'])
      )
    })

    it('handles navigation to all vacancies', async () => {
      const specialistUser = createMockUser({ userType: 'specialist' })
      
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: specialistUser }
              }
            })
          ]
        }
      })

      await waitForComponent(wrapper)

      // Find the vacancies link
      const vacanciesLink = wrapper.find('a[href*=\"vacancies\"]')
      expect(vacanciesLink.exists()).toBe(true)
      expect(vacanciesLink.text()).toContain('Посмотреть все вакансии')
    })
  })

  describe('Error Handling Integration', () => {
    it('handles and displays loading states correctly', async () => {
      mockPlatformData.loading = true
      
      const clientUser = createMockUser({ userType: 'client' })
      
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: clientUser }
              }
            })
          ]
        }
      })

      // Should show loading spinner
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      
      // Should not show content yet
      expect(wrapper.find('[data-testid=\"portfolio-card\"]').exists()).toBe(false)
    })

    it('handles and displays error states correctly', async () => {
      mockPlatformData.loading = false
      mockPlatformData.error = 'Network error occurred'
      
      const clientUser = createMockUser({ userType: 'client' })
      
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: clientUser }
              }
            })
          ]
        }
      })

      await waitForComponent(wrapper)

      // Should show error message
      expect(wrapper.text()).toContain('Ошибка загрузки данных')
      expect(wrapper.text()).toContain('Network error occurred')
      
      // Should not show content
      expect(wrapper.find('[data-testid=\"portfolio-card\"]').exists()).toBe(false)
    })

    it('recovers from error states when data is refetched', async () => {
      // Start with error state
      mockPlatformData.loading = false
      mockPlatformData.error = 'Initial error'
      
      const clientUser = createMockUser({ userType: 'client' })
      
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: clientUser }
              }
            })
          ]
        }
      })

      await waitForComponent(wrapper)

      // Should show error initially
      expect(wrapper.text()).toContain('Ошибка загрузки данных')

      // Simulate successful data fetch
      mockPlatformData.error = null
      mockPlatformData.portfolios = createMockPlatformData('client').portfolios
      
      await wrapper.vm.$forceUpdate()
      await flushPromises()

      // Error should be gone, content should appear
      expect(wrapper.text()).not.toContain('Ошибка загрузки данных')
    })
  })

  describe('User Type Switching Integration', () => {
    it('updates content when user type changes', async () => {
      // Start with client user
      let currentUser = createMockUser({ userType: 'client', firstName: 'John' })
      
      const wrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser }
              }
            })
          ]
        }
      })

      await waitForComponent(wrapper)

      // Should show client content
      expect(wrapper.text()).toContain('находить специалистов для ваших проектов')

      // Switch to specialist user
      const userStore = useUserStore()
      userStore.currentUser = createMockUser({ userType: 'specialist', firstName: 'Jane' })
      mockPlatformData.vacancies = createMockPlatformData('specialist').vacancies
      
      await wrapper.vm.$forceUpdate()
      await flushPromises()

      // Should show specialist content
      expect(wrapper.text()).toContain('Добро пожаловать, Jane!')
      expect(wrapper.text()).toContain('находить интересные вакансии для работы')
    })
  })

  describe('Layout Consistency Integration', () => {
    it('maintains consistent layout structure across user types', async () => {
      // Test with client user
      const clientUser = createMockUser({ userType: 'client' })
      mockPlatformData.portfolios = createMockPlatformData('client').portfolios
      
      const clientWrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: clientUser }
              }
            })
          ]
        }
      })

      await waitForComponent(clientWrapper)

      // Verify layout structure
      const clientMain = clientWrapper.find('main')
      expect(clientMain.classes()).toContain('max-w-7xl')
      expect(clientMain.classes()).toContain('mx-auto')

      const clientGrid = clientWrapper.find('.grid')
      expect(clientGrid.exists()).toBe(true)
      expect(clientGrid.classes()).toEqual(
        expect.arrayContaining(['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3'])
      )

      // Test with specialist user
      const specialistUser = createMockUser({ userType: 'specialist' })
      mockPlatformData.vacancies = createMockPlatformData('specialist').vacancies
      mockPlatformData.portfolios = []
      
      const specialistWrapper = createWrapper(HomePage, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                user: { currentUser: specialistUser }
              }
            })
          ]
        }
      })

      await waitForComponent(specialistWrapper)

      // Should have same layout structure
      const specialistMain = specialistWrapper.find('main')
      expect(specialistMain.classes()).toContain('max-w-7xl')
      expect(specialistMain.classes()).toContain('mx-auto')

      const specialistGrid = specialistWrapper.find('.grid')
      expect(specialistGrid.exists()).toBe(true)
      expect(specialistGrid.classes()).toEqual(
        expect.arrayContaining(['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3'])
      )
    })
  })
})