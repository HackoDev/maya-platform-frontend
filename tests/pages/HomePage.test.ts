import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

// Mock the composables
vi.mock('@/composables/usePlatformData', () => ({
  usePlatformData: () => ({
    portfolios: [
      {
        portfolio: { id: '1', title: 'Test Portfolio' },
        specialist: { id: '1', displayName: 'Test Specialist' }
      }
    ],
    vacancies: [
      { id: '1', title: 'Test Vacancy', description: 'Test Description' }
    ],
    loading: false,
    error: null,
    fetchPlatformData: vi.fn()
  })
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
  })

  const createWrapper = (user: User | null = null) => {
    const userStore = useUserStore()
    if (user) {
      userStore.currentUser = user
    }

    return mount(HomePage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      }
    })
  }

  it('renders client-specific content when user is a client', () => {
    const clientUser: User = {
      id: '1',
      name: 'Test Client',
      firstName: 'Test',
      lastName: 'Client',
      email: 'client@test.com',
      role: 'user',
      userType: 'client',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const wrapper = createWrapper(clientUser)

    // Should show portfolios section
    expect(wrapper.find('[data-testid="portfolio-card"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="vacancy-card"]').exists()).toBe(false)
    
    // Should show client-specific welcome message
    expect(wrapper.text()).toContain('находить специалистов для ваших проектов')
  })

  it('renders specialist-specific content when user is a specialist', () => {
    const specialistUser: User = {
      id: '1',
      name: 'Test Specialist',
      firstName: 'Test',
      lastName: 'Specialist',
      email: 'specialist@test.com',
      role: 'user',
      userType: 'specialist',
      isActive: true,
      isOpenToOffers: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const wrapper = createWrapper(specialistUser)

    // Should show vacancies section
    expect(wrapper.find('[data-testid="vacancy-card"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="portfolio-card"]').exists()).toBe(false)
    
    // Should show specialist-specific welcome message
    expect(wrapper.text()).toContain('находить интересные вакансии для работы')
  })

  it('renders fallback content when user type is unknown', () => {
    const wrapper = createWrapper()

    // Should show fallback message
    expect(wrapper.text()).toContain('Не удалось определить тип пользователя')
    expect(wrapper.find('[data-testid="portfolio-card"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="vacancy-card"]').exists()).toBe(false)
  })

})
