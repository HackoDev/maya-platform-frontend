import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SpecialistProfileViewPage from '@/pages/SpecialistProfileViewPage.vue'
import { useSpecialistProfileViewStore } from '@/stores/specialist-profile-view'
import type { ProfileViewData } from '@/types/specialist-profile-view'

// Mock vue-router
const mockRouter = {
  push: vi.fn(),
  go: vi.fn()
}

const mockRoute = {
  params: { id: 'specialist-1' },
  query: { from: 'search' }
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRoute
}))

// Mock profile data
const mockProfileData: ProfileViewData = {
  basicInfo: {
    id: 'specialist-1',
    userId: 'user-1',
    displayName: 'Анна Иванова',
    superpower: 'Создаю AI-ассистентов для автоматизации бизнес-процессов',
    status: 'available',
    lastActive: '2024-01-15T10:30:00Z'
  },
  detailedInfo: {
    specializations: ['Нейроассистенты (AI-боты)', 'Нейроворонки (продажи + автоматизация)'],
    abilities: ['Собираю нейроворонки (от лида до оплаты)', 'Создаю персональных AI-ассистентов'],
    services: [
      {
        name: 'Нейроассистент под ключ',
        price: 15000,
        priceType: 'fixed',
        isCustom: false
      }
    ],
    portfolio: [],
    experience: [],
    testimonials: {
      textTestimonials: [],
      externalLinks: [],
      files: [],
      totalCount: 0
    },
    contacts: {
      telegram: '@anna_ai_expert',
      email: 'anna@example.com'
    }
  },
  metadata: {
    profileCompleted: true,
    completionPercentage: 95,
    moderationStatus: 'approved',
    lastUpdated: '2024-01-15T12:30:00Z'
  }
}

describe('SpecialistProfileViewPage', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('renders loading state correctly', () => {
    const wrapper = mount(SpecialistProfileViewPage, {
      props: {
        specialistId: 'specialist-1'
      },
      global: {
        plugins: [pinia]
      }
    })

    const store = useSpecialistProfileViewStore()
    store.isLoading = true

    expect(wrapper.find('[data-testid="loading-overlay"]').exists()).toBe(true)
  })

  it('renders error state correctly', async () => {
    const wrapper = mount(SpecialistProfileViewPage, {
      props: {
        specialistId: 'specialist-1'
      },
      global: {
        plugins: [pinia]
      }
    })

    const store = useSpecialistProfileViewStore()
    store.error = 'Failed to load profile'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Ошибка загрузки профиля')
    expect(wrapper.text()).toContain('Failed to load profile')
  })

  it('renders profile content when loaded', async () => {
    const wrapper = mount(SpecialistProfileViewPage, {
      props: {
        specialistId: 'specialist-1'
      },
      global: {
        plugins: [pinia],
        stubs: {
          ProfileHeader: true,
          ProfileOverview: true,
          SpecializationsSection: true,
          ServicesSection: true,
          ContactSection: true
        }
      }
    })

    const store = useSpecialistProfileViewStore()
    store.currentProfile = mockProfileData
    await wrapper.vm.$nextTick()

    expect(wrapper.find('profile-header-stub').exists()).toBe(true)
    expect(wrapper.find('profile-overview-stub').exists()).toBe(true)
    expect(wrapper.find('specializations-section-stub').exists()).toBe(true)
  })

  it('handles modal mode correctly', async () => {
    const wrapper = mount(SpecialistProfileViewPage, {
      props: {
        specialistId: 'specialist-1',
        modalMode: true
      },
      global: {
        plugins: [pinia],
        stubs: {
          ProfileHeader: true,
          ProfileOverview: true,
          SpecializationsSection: true,
          ServicesSection: true,
          ContactSection: true
        }
      }
    })

    const store = useSpecialistProfileViewStore()
    store.currentProfile = mockProfileData
    await wrapper.vm.$nextTick()

    // Back navigation should not be visible in modal mode
    expect(wrapper.text()).not.toContain('Назад к поиску')
  })

  it('handles back navigation correctly', async () => {
    const wrapper = mount(SpecialistProfileViewPage, {
      props: {
        specialistId: 'specialist-1'
      },
      global: {
        plugins: [pinia],
        stubs: {
          ProfileHeader: true,
          ProfileOverview: true,
          SpecializationsSection: true,
          ServicesSection: true,
          ContactSection: true
        }
      }
    })

    const store = useSpecialistProfileViewStore()
    store.currentProfile = mockProfileData
    await wrapper.vm.$nextTick()

    const backButton = wrapper.find('button')
    await backButton.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith('/search/specialists')
  })

  it('handles retry loading correctly', async () => {
    const wrapper = mount(SpecialistProfileViewPage, {
      props: {
        specialistId: 'specialist-1'
      },
      global: {
        plugins: [pinia]
      }
    })

    const store = useSpecialistProfileViewStore()
    store.error = 'Network error'
    store.loadProfile = vi.fn()
    await wrapper.vm.$nextTick()

    const retryButton = wrapper.find('button')
    await retryButton.trigger('click')

    expect(store.loadProfile).toHaveBeenCalledWith('specialist-1')
  })

  it('conditionally renders optional sections', async () => {
    const wrapper = mount(SpecialistProfileViewPage, {
      props: {
        specialistId: 'specialist-1'
      },
      global: {
        plugins: [pinia],
        stubs: {
          ProfileHeader: true,
          ProfileOverview: true,
          SpecializationsSection: true,
          ServicesSection: true,
          PortfolioSection: true,
          ExperienceSection: true,
          TestimonialsSection: true,
          ContactSection: true
        }
      }
    })

    const store = useSpecialistProfileViewStore()
    store.currentProfile = {
      ...mockProfileData,
      detailedInfo: {
        ...mockProfileData.detailedInfo,
        portfolio: [{ id: '1', title: 'Test Case', description: 'Test', type: 'text', content: 'content', createdAt: '2024-01-01' }],
        experience: [{ id: '1', client: 'Test Client', task: 'Test Task', tools: ['Tool1'], result: 'Success' }],
        testimonials: {
          ...mockProfileData.detailedInfo.testimonials,
          totalCount: 1,
          textTestimonials: [{ id: '1', clientName: 'John', testimonialText: 'Great work!' }]
        }
      }
    }
    
    store.hasPortfolio = true
    store.hasExperience = true  
    store.hasTestimonials = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('portfolio-section-stub').exists()).toBe(true)
    expect(wrapper.find('experience-section-stub').exists()).toBe(true)
    expect(wrapper.find('testimonials-section-stub').exists()).toBe(true)
  })
})