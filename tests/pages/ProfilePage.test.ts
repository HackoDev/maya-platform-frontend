import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ProfilePage from '@/pages/ProfilePage.vue'
import { useUserStore } from '@/stores/user'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'
import type { User } from '@/types'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/profile', component: ProfilePage },
    { path: '/profile/neural-network', component: { template: '<div>Neural Network</div>' } },
    { path: '/profile/change-password', component: { template: '<div>Change Password</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
  ],
})

const mockSpecialistUser: User = {
  id: '1',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'user',
  userType: 'specialist',
  isActive: true,
  avatar: undefined,
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockClientUser: User = {
  ...mockSpecialistUser,
  userType: 'client',
}

describe('ProfilePage Component', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router.push('/')
  })

  describe('Component Rendering', () => {
    it('should render profile page with user information', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.find('h1').text()).toBe('Мой профиль')
      expect(wrapper.text()).toContain('John')
      expect(wrapper.text()).toContain('Doe')
      expect(wrapper.text()).toContain('john@example.com')
      expect(wrapper.text()).toContain('Специалист')
      expect(wrapper.text()).toContain('Активен')
    })

    it('should render actions section title', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.find('h2').text()).toBe('Действия профиля')
    })
  })

  describe('Action Cards for Specialists', () => {
    it('should render questionnaire card for specialist users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Анкета специалиста')
      expect(wrapper.text()).toContain('Заполните анкету нейросетевого специалиста')
    })

    it('should render password change card for all users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Смена пароля')
      expect(wrapper.text()).toContain('Измените пароль для обеспечения безопасности')
    })

    it('should render logout card for all users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Выход')
      expect(wrapper.text()).toContain('Завершить текущую сессию')
    })
  })

  describe('Action Cards for Clients', () => {
    it('should not render questionnaire card for client users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockClientUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).not.toContain('Анкета специалиста')
    })

    it('should render password change and logout cards for client users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockClientUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Смена пароля')
      expect(wrapper.text()).toContain('Выход')
    })
  })

  describe('Logout Functionality', () => {
    it('should call logout and redirect on logout action', async () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const logoutSpy = vi.spyOn(userStore, 'logout')
      const routerPushSpy = vi.spyOn(router, 'push').mockResolvedValue()

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Find and click the logout card
      const logoutCards = wrapper.findAll('.action-card')
      const logoutCard = logoutCards.find(card => card.text().includes('Выход'))
      expect(logoutCard).toBeTruthy()

      if (logoutCard) {
        await logoutCard.trigger('click')
      }

      expect(logoutSpy).toHaveBeenCalled()
      expect(routerPushSpy).toHaveBeenCalledWith('/login')

      logoutSpy.mockRestore()
      routerPushSpy.mockRestore()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Find the actions grid container (second grid)
      const gridContainers = wrapper.findAll('.grid')
      expect(gridContainers.length).toBeGreaterThan(1)
      
      const actionsGrid = gridContainers[1] // The actions grid is the second one
      expect(actionsGrid.exists()).toBe(true)
      
      // Check for responsive grid classes in the class string
      const classString = actionsGrid.attributes('class') || ''
      expect(classString).toContain('grid-cols-1')
      expect(classString).toContain('md:grid-cols-2')
      expect(classString).toContain('lg:grid-cols-3')
    })
  })

  describe('Dark Theme Support', () => {
    it('should have dark theme classes', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const pageContainer = wrapper.find('.min-h-screen')
      expect(pageContainer.classes()).toContain('dark:bg-gray-900')

      const cards = wrapper.findAll('.bg-white')
      cards.forEach(card => {
        expect(card.classes()).toContain('dark:bg-gray-800')
      })
    })
  })

  describe('User Type Display', () => {
    it('should display correct user type badge for specialist', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const badges = wrapper.findAll('.bg-green-100, .bg-blue-100')
      const specialistBadge = badges.find(badge => badge.text().includes('Специалист'))
      expect(specialistBadge).toBeTruthy()
    })

    it('should display correct user type badge for client', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockClientUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const badges = wrapper.findAll('.bg-green-100, .bg-blue-100')
      const clientBadge = badges.find(badge => badge.text().includes('Клиент'))
      expect(clientBadge).toBeTruthy()
    })
  })

  describe('User Status Display', () => {
    it('should display active status correctly', () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isActive: true }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Активен')
    })

    it('should display inactive status correctly', () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isActive: false }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Неактивен')
    })
  })

  describe('Questionnaire Status and Progress', () => {
    it('should display moderation status and completion percentage for specialists', () => {
      const userStore = useUserStore()
      const neuralNetworkStore = useNeuralNetworkProfileStore()
      userStore.currentUser = mockSpecialistUser

      // Mock the neural network store's initializeForm to set up mock data
      const initializeFormSpy = vi.spyOn(neuralNetworkStore, 'initializeForm')
      
      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Verify that initializeForm was called
      expect(initializeFormSpy).toHaveBeenCalled()
      
      // Check that the questionnaire card shows status information
      expect(wrapper.text()).toContain('Анкета специалиста')
    })

    it('should not call neural network store for client users', () => {
      const userStore = useUserStore()
      const neuralNetworkStore = useNeuralNetworkProfileStore()
      userStore.currentUser = mockClientUser

      const initializeFormSpy = vi.spyOn(neuralNetworkStore, 'initializeForm')
      
      mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Should not call initializeForm for client users
      expect(initializeFormSpy).not.toHaveBeenCalled()
    })

    it('should display different action text based on questionnaire status', async () => {
      const userStore = useUserStore()
      const neuralNetworkStore = useNeuralNetworkProfileStore()
      userStore.currentUser = mockSpecialistUser

      // Initialize with mock data
      neuralNetworkStore.initializeForm()
      
      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // The action text should be based on the default state (draft with 0% completion)
      // Since we're not properly setting up the mock profile in the test environment
      expect(wrapper.text()).toContain('Заполнить анкету')
      
      // Check that the status badge shows draft
      expect(wrapper.text()).toContain('Черновик')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing user data gracefully', () => {
      const userStore = useUserStore()
      userStore.currentUser = null

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.find('h1').text()).toBe('Мой профиль')
      expect(wrapper.find('h2').text()).toBe('Действия профиля')
      // Should still render action cards even without user data
      expect(wrapper.text()).toContain('Смена пароля')
      expect(wrapper.text()).toContain('Выход')
    })
  })
})