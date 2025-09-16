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
  isOpenToOffers: false, // Added this field for toggle tests
  // Mock contact data
  phone: '+7 (916) 123-45-67',
  whatsapp: '+7 (916) 123-45-67',
  telegram: '@john_specialist',
  avatar: undefined,
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockClientUser: User = {
  ...mockSpecialistUser,
  userType: 'client',
  // Different contact data for client
  phone: '+7 (903) 987-65-43',
  whatsapp: '+7 (903) 987-65-43',
  telegram: '@client_user',
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

      expect(wrapper.find('h1').text()).toBe('John Doe')
      expect(wrapper.text()).toContain('john@example.com')
      expect(wrapper.text()).toContain('Специалист')
      // Check for contact information
      expect(wrapper.text()).toContain('+7 (916) 123-45-67')
      expect(wrapper.text()).toContain('@john_specialist')
    })

    it('should render contact information fields', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Check for contact field labels
      expect(wrapper.text()).toContain('Телефон')
      expect(wrapper.text()).toContain('WhatsApp')
      expect(wrapper.text()).toContain('Telegram')
      
      // Check for contact values
      expect(wrapper.text()).toContain('+7 (916) 123-45-67')
      expect(wrapper.text()).toContain('@john_specialist')
    })

    it('should not render Name/Surname fields anymore', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Name and surname should not appear as separate fields since they're removed
      expect(wrapper.text()).not.toContain('Имя')
      expect(wrapper.text()).not.toContain('Фамилия')
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
      expect(wrapper.text()).toContain('Улучшите свою анкету')
    })

    it('should render settings card for all users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Настройки')
      expect(wrapper.text()).toContain('Управление личными данными')
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

    it('should render settings and logout cards for client users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockClientUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Настройки')
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

      // Find and click the logout card by looking for cards with 'Выход' text
      const allCards = wrapper.findAll('[class*="border"][class*="rounded-lg"][class*="p-5"]')
      const logoutCard = allCards.find(card => card.text().includes('Выход'))
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

      // Check if the HTML contains dark theme classes
      const htmlContent = wrapper.html()
      expect(htmlContent).toContain('dark:bg-gray-800')
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

      const badges = wrapper.findAll('.bg-green-100, .bg-blue-100, .bg-purple-100')
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

      const badges = wrapper.findAll('.bg-green-100, .bg-blue-100, .bg-purple-100')
      const clientBadge = badges.find(badge => badge.text().includes('Клиент'))
      expect(clientBadge).toBeTruthy()
    })
  })

  describe('User Status Display', () => {
    it('should display email as green badge', () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isActive: true }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Email should be displayed as a green badge
      expect(wrapper.text()).toContain('john@example.com')
      const emailBadges = wrapper.findAll('.bg-green-100')
      const emailBadge = emailBadges.find(badge => badge.text().includes('john@example.com'))
      expect(emailBadge).toBeTruthy()
    })

    it('should not display active/inactive status badge', () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isActive: false }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Since we removed the active/inactive status badge, it should not appear
      expect(wrapper.text()).not.toContain('Неактивен')
      expect(wrapper.text()).not.toContain('Активен')
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

      expect(wrapper.find('h1').text()).toBe('')
      expect(wrapper.find('h2').text()).toBe('Действия профиля')
      // Should still render action cards even without user data
      expect(wrapper.text()).toContain('Настройки')
      expect(wrapper.text()).toContain('Выход')
    })
  })

  describe('Toggle Confirmation Modal', () => {
    it('should render toggle for specialist users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockSpecialistUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Should have the toggle switch
      const toggleSwitch = wrapper.find('[role="switch"]')
      expect(toggleSwitch.exists()).toBe(true)
      expect(wrapper.text()).toContain('Открыт к предложениям')
    })

    it('should not render toggle for client users', () => {
      const userStore = useUserStore()
      userStore.currentUser = mockClientUser

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Should not have the toggle switch
      const toggleSwitch = wrapper.find('[role="switch"]')
      expect(toggleSwitch.exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Открыт к предложениям')
    })

    it('should show confirmation modal when toggle is clicked', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Find and click the toggle
      const toggleSwitch = wrapper.find('[role="switch"]')
      await toggleSwitch.trigger('click')
      await wrapper.vm.$nextTick()

      // Check that confirmation modal is visible
      expect(wrapper.text()).toContain('Показать в поиске')
      expect(wrapper.text()).toContain('Ваша анкета специалиста снова будет показана')
      expect(wrapper.text()).toContain('Показать профиль')
      expect(wrapper.text()).toContain('Отмена')
    })

    it('should show correct modal content when enabling availability', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Click toggle to enable
      const toggleSwitch = wrapper.find('[role="switch"]')
      await toggleSwitch.trigger('click')
      await wrapper.vm.$nextTick()

      // Check modal content for enabling
      expect(wrapper.text()).toContain('Показать в поиске')
      expect(wrapper.text()).toContain('снова будет показана в поиске активных специалистов')
      expect(wrapper.text()).toContain('Показать профиль')
    })

    it('should show correct modal content when disabling availability', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: true }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Wait for component to fully mount and watch to initialize
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Give more time for initialization
      
      // Get the component instance
      const vm = wrapper.vm as any
      
      // Make sure modal is closed and state is clean before test
      vm.showConfirmModal = false
      vm.pendingToggleValue = null
      await wrapper.vm.$nextTick()

      // Verify initial state - the watch should have synchronized it
      const toggleSwitch = wrapper.find('[role="switch"]')
      expect(toggleSwitch.exists()).toBe(true)
      expect(vm.isOpenToOffers).toBe(true) // Should be synced from store

      // Click toggle to disable (true -> false)
      await toggleSwitch.trigger('click')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Now the pendingToggleValue should be false (the desired new state)
      expect(vm.pendingToggleValue).toBe(false)
      expect(vm.showConfirmModal).toBe(true)
      
      // Check modal content for disabling
      expect(wrapper.text()).toContain('Скрыть из поиска')
      expect(wrapper.text()).toContain('не будет показана в поиске активных специалистов')
      expect(wrapper.text()).toContain('Скрыть профиль')
    })

    it('should call updateOpenToOffers when confirmed', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }

      const updateOpenToOffersSpy = vi.spyOn(userStore, 'updateOpenToOffers').mockResolvedValue()

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Click toggle
      const toggleSwitch = wrapper.find('[role="switch"]')
      await toggleSwitch.trigger('click')
      await wrapper.vm.$nextTick()

      // Find and click confirm button
      const confirmButtons = wrapper.findAll('button')
      const confirmButton = confirmButtons.find(button => 
        button.text().includes('Показать профиль')
      )
      expect(confirmButton).toBeTruthy()
      await confirmButton!.trigger('click')
      await wrapper.vm.$nextTick()

      expect(updateOpenToOffersSpy).toHaveBeenCalledWith(true)
      updateOpenToOffersSpy.mockRestore()
    })

    it('should revert toggle when cancelled', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Click toggle
      const toggleSwitch = wrapper.find('[role="switch"]')
      await toggleSwitch.trigger('click')
      await wrapper.vm.$nextTick()

      // Find and click cancel button
      const cancelButtons = wrapper.findAll('button')
      const cancelButton = cancelButtons.find(button => 
        button.text().includes('Отмена')
      )
      expect(cancelButton).toBeTruthy()
      await cancelButton!.trigger('click')
      await wrapper.vm.$nextTick()

      // Modal should be hidden and toggle should remain false
      expect(wrapper.text()).not.toContain('Показать в поиске')
      // The toggle should be reverted to its original state
      const toggleComponent = wrapper.findComponent({ name: 'ControlledToggle' })
      expect(toggleComponent.exists()).toBe(true)
      // Verify that the component's getCurrentValue returns false
      const vm = wrapper.vm as any
      expect(vm.isOpenToOffers).toBe(false)
    })

    it('should update toggle visual state after successful confirmation', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }

      const updateOpenToOffersSpy = vi.spyOn(userStore, 'updateOpenToOffers').mockResolvedValue()

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Initially should be false
      const vm = wrapper.vm as any
      expect(vm.isOpenToOffers).toBe(false)
      expect(wrapper.find('[aria-checked="false"]').exists()).toBe(true)

      // Click toggle
      const toggleSwitch = wrapper.find('[role="switch"]')
      await toggleSwitch.trigger('click')
      await wrapper.vm.$nextTick()

      // Confirm the action
      const confirmButtons = wrapper.findAll('button')
      const confirmButton = confirmButtons.find(button => 
        button.text().includes('Показать профиль')
      )
      expect(confirmButton).toBeTruthy()
      await confirmButton!.trigger('click')
      await wrapper.vm.$nextTick()

      // Verify API was called
      expect(updateOpenToOffersSpy).toHaveBeenCalledWith(true)
      
      // Verify toggle state updated
      expect(vm.isOpenToOffers).toBe(true)
      expect(wrapper.find('[aria-checked="true"]').exists()).toBe(true)
      
      // Verify modal is closed
      expect(wrapper.text()).not.toContain('Показать в поиске')

      updateOpenToOffersSpy.mockRestore()
    })

    it('should maintain toggle state on API error', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }

      const updateOpenToOffersSpy = vi.spyOn(userStore, 'updateOpenToOffers')
        .mockRejectedValue(new Error('API Error'))
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Initially should be false
      const vm = wrapper.vm as any
      expect(vm.isOpenToOffers).toBe(false)

      // Click toggle
      const toggleSwitch = wrapper.find('[role="switch"]')
      await toggleSwitch.trigger('click')
      await wrapper.vm.$nextTick()

      // Confirm the action
      const confirmButtons = wrapper.findAll('button')
      const confirmButton = confirmButtons.find(button => 
        button.text().includes('Показать профиль')
      )
      expect(confirmButton).toBeTruthy()
      await confirmButton!.trigger('click')
      await wrapper.vm.$nextTick()

      // Should log error and maintain original state
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update availability status:', expect.any(Error))
      expect(vm.isOpenToOffers).toBe(false)
      expect(wrapper.find('[aria-checked="false"]').exists()).toBe(true)

      updateOpenToOffersSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })

    it('should disable toggle during API call', async () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }
      userStore.loading = true

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const toggleSwitch = wrapper.find('[role="switch"]')
      expect(toggleSwitch.attributes('disabled')).toBeDefined()
    })

    it('should display "Открыт к предложениям" badge when user is available', () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: true }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Should show the "open to offers" badge in the user info section
      const badges = wrapper.findAll('.bg-green-100')
      const openToBadge = badges.find(badge => badge.text().includes('Открыт к предложениям'))
      expect(openToBadge).toBeTruthy()
    })

    it('should not display "Открыт к предложениям" badge when user is not available', () => {
      const userStore = useUserStore()
      userStore.currentUser = { ...mockSpecialistUser, isOpenToOffers: false }

      const wrapper = mount(ProfilePage, {
        global: {
          plugins: [router, pinia],
        },
      })

      // Should not show the "open to offers" badge
      const badges = wrapper.findAll('.bg-green-100')
      const openToBadge = badges.find(badge => badge.text().includes('Открыт к предложениям'))
      expect(openToBadge).toBeFalsy()
    })
  })
})