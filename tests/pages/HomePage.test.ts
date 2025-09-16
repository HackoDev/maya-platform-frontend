import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import { useUserStore } from '@/stores/user'
import { createWrapper, VIEWPORT_SIZES, setViewportSize, expectGridColumns, mockMatchMedia } from '../utils/test-helpers'
import { createMockUser, createMockPlatformData } from '../utils/mock-factories'
import type { User } from '@/types'

// Mock the composables
const mockPlatformData = {
  portfolios: createMockPlatformData('client').portfolios,
  vacancies: createMockPlatformData('specialist').vacancies,
  loading: false,
  error: null,
  fetchPlatformData: vi.fn()
}

vi.mock('@/composables/usePlatformData', () => ({
  usePlatformData: () => mockPlatformData
}))

// Mock the components
vi.mock('@/components/ui/PortfolioSpecialistCard.vue', () => ({
  default: { template: '<div data-testid="portfolio-card">Portfolio Card</div>' }
}))

vi.mock('@/components/vacancies/VacancyCard.vue', () => ({
  default: { template: '<div data-testid="vacancy-card">Vacancy Card</div>' }
}))

describe('HomePage', () => {
  let pinia: any
  let router: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomePage },
        { path: '/search/specialists', component: { template: '<div>Search Specialists</div>' } },
        { path: '/vacancies', component: { template: '<div>Vacancies</div>' } }
      ]
    })

    // Reset mocks
    vi.clearAllMocks()
    mockMatchMedia()
  })

  const createHomePageWrapper = (user: User | null = null) => {
    const userStore = useUserStore()
    if (user) {
      userStore.currentUser = user
    }

    return mount(HomePage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
            props: ['to'],
          },
          RouterView: {
            template: '<div><slot /></div>',
          },
        },
      }
    })
  }

  describe('Layout and Structure', () => {
    it('uses full width layout (max-w-7xl)', () => {
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      const mainContainer = wrapper.find('main')
      expect(mainContainer.exists()).toBe(true)
      expect(mainContainer.classes()).toContain('max-w-7xl')
      expect(mainContainer.classes()).toContain('mx-auto')
    })

    it('does not have nested width constraints', () => {
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      // Should not have the old max-w-4xl constraint
      expect(wrapper.find('.max-w-4xl').exists()).toBe(false)
      
      // Content should use full width
      const contentWrapper = wrapper.find('[data-testid="dynamic-content"]')
      if (contentWrapper.exists()) {
        expect(contentWrapper.classes()).toContain('w-full')
      }
    })

    it('has proper responsive grid layout for content', () => {
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      const gridContainer = wrapper.find('.grid')
      expect(gridContainer.exists()).toBe(true)
      expect(gridContainer.classes()).toContain('grid-cols-1')
      expect(gridContainer.classes()).toContain('md:grid-cols-2')
      expect(gridContainer.classes()).toContain('lg:grid-cols-3')
      expect(gridContainer.classes()).toContain('gap-6')
    })
  })

  describe('Responsive Behavior', () => {
    it('renders single column on mobile', () => {
      setViewportSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height)
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      expectGridColumns(wrapper, '.grid', 1)
    })

    it('renders multi-column grid on larger screens', () => {
      setViewportSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height)
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      const gridElement = wrapper.find('.grid')
      expect(gridElement.exists()).toBe(true)
      expect(gridElement.classes()).toContain('lg:grid-cols-3')
    })
  })

  describe('User Type Rendering', () => {
    it('renders client-specific content when user is a client', () => {
      const clientUser = createMockUser({ userType: 'client', firstName: 'Test' })
      const wrapper = createHomePageWrapper(clientUser)

      // Should show portfolios section
      expect(wrapper.find('[data-testid="portfolio-card"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="vacancy-card"]').exists()).toBe(false)
      
      // Should show client-specific welcome message
      expect(wrapper.text()).toContain('находить специалистов для ваших проектов')
      
      // Should have correct section title and action links
      expect(wrapper.text()).toContain('Портфолио специалистов')
      expect(wrapper.text()).toContain('Найти специалиста ->')
    })

    it('renders specialist-specific content when user is a specialist', () => {
      const specialistUser = createMockUser({ userType: 'specialist', firstName: 'Test' })
      const wrapper = createHomePageWrapper(specialistUser)

      // Should show vacancies section
      expect(wrapper.find('[data-testid="vacancy-card"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="portfolio-card"]').exists()).toBe(false)
      
      // Should show specialist-specific welcome message
      expect(wrapper.text()).toContain('находить интересные вакансии для работы')
      
      // Should have correct section title and action links
      expect(wrapper.text()).toContain('Последние вакансии')
      expect(wrapper.text()).toContain('Найти вакансии ->')
    })

    it('renders fallback content when user type is unknown', () => {
      const wrapper = createHomePageWrapper()

      // Should show fallback message
      expect(wrapper.text()).toContain('Не удалось определить тип пользователя')
      expect(wrapper.find('[data-testid="portfolio-card"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="vacancy-card"]').exists()).toBe(false)
    })
  })

  describe('Loading and Error States', () => {
    it('shows loading state when data is being fetched', async () => {
      mockPlatformData.loading = true
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      expect(wrapper.find('[data-testid="portfolio-card"]').exists()).toBe(false)
    })

    it('shows error state when data fetching fails', async () => {
      mockPlatformData.loading = false
      mockPlatformData.error = 'Failed to load data'
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      expect(wrapper.text()).toContain('Ошибка загрузки данных')
      expect(wrapper.text()).toContain('Failed to load data')
    })
  })

  describe('Navigation and Interactions', () => {
    it('calls fetchPlatformData on mount', () => {
      const clientUser = createMockUser({ userType: 'client' })
      createHomePageWrapper(clientUser)
      
      expect(mockPlatformData.fetchPlatformData).toHaveBeenCalled()
    })

    it('has correct router links for client actions', () => {
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      // Check for the action link text content
      expect(wrapper.text()).toContain('Найти специалиста ->')
    })

    it('has correct router links for specialist actions', () => {
      const specialistUser = createMockUser({ userType: 'specialist' })
      const wrapper = createHomePageWrapper(specialistUser)
      
      // Check for the action link text content
      expect(wrapper.text()).toContain('Найти вакансии ->')
    })

    it('limits portfolio cards to 9 items', () => {
      // Mock data with more than 9 items
      mockPlatformData.portfolios = Array.from({ length: 15 }, (_, i) => ({
        portfolio: { id: `p${i}`, title: `Portfolio ${i}` },
        specialist: { id: `s${i}`, displayName: `Specialist ${i}` }
      }))
      
      const clientUser = createMockUser({ userType: 'client' })
      const wrapper = createHomePageWrapper(clientUser)
      
      // Should show only 9 cards
      const portfolioCards = wrapper.findAll('[data-testid="portfolio-card"]')
      expect(portfolioCards.length).toBeLessThanOrEqual(9)
    })

    it('limits vacancy cards to 9 items', () => {
      // Mock data with more than 9 items
      mockPlatformData.vacancies = Array.from({ length: 15 }, (_, i) => ({
        id: `v${i}`,
        title: `Vacancy ${i}`,
        company: `Company ${i}`
      }))
      
      const specialistUser = createMockUser({ userType: 'specialist' })
      const wrapper = createHomePageWrapper(specialistUser)
      
      // Should show only 9 cards
      const vacancyCards = wrapper.findAll('[data-testid="vacancy-card"]')
      expect(vacancyCards.length).toBeLessThanOrEqual(9)
    })
  })
})