import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import TopNavbar from '@/components/common/TopNavbar.vue'
import MobileNavigationMenu from '@/components/common/MobileNavigationMenu.vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'
import { THEME_CONFIG } from '@/types/theme'

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  SunIcon: {
    name: 'SunIcon',
    template: '<svg data-testid="sun-icon"><title>Sun Icon</title></svg>',
  },
  MoonIcon: {
    name: 'MoonIcon', 
    template: '<svg data-testid="moon-icon"><title>Moon Icon</title></svg>',
  },
  ComputerDesktopIcon: {
    name: 'ComputerDesktopIcon',
    template: '<svg data-testid="computer-icon"><title>Computer Icon</title></svg>',
  },
  ChevronDownIcon: {
    name: 'ChevronDownIcon',
    template: '<svg data-testid="chevron-down-icon"><title>Chevron Down Icon</title></svg>',
  },
  CheckIcon: {
    name: 'CheckIcon',
    template: '<svg data-testid="check-icon"><title>Check Icon</title></svg>',
  },
  Bars3Icon: {
    name: 'Bars3Icon',
    template: '<svg data-testid="bars3-icon"><title>Menu Icon</title></svg>',
  },
  XMarkIcon: {
    name: 'XMarkIcon',
    template: '<svg data-testid="x-mark-icon"><title>Close Icon</title></svg>',
  },
  PlusIcon: {
    name: 'PlusIcon',
    template: '<svg data-testid="plus-icon"><title>Plus Icon</title></svg>',
  },
  ArrowRightOnRectangleIcon: {
    name: 'ArrowRightOnRectangleIcon',
    template: '<svg data-testid="logout-icon"><title>Logout Icon</title></svg>',
  },
}))

// Mock MayaLogoIcon
vi.mock('@/components/icons/MayaLogoIcon.vue', () => ({
  default: {
    name: 'MayaLogoIcon',
    template: '<svg data-testid="maya-logo"><title>Maya Logo</title></svg>',
  },
}))

// Mock UserProfileSection
vi.mock('@/components/common/UserProfileSection.vue', () => ({
  default: {
    name: 'UserProfileSection',
    template: '<div data-testid="user-profile-section">User Profile</div>',
    props: ['user'],
  },
}))

// Mock globals
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

const matchMediaMock = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))

const documentMock = {
  documentElement: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

Object.defineProperty(global, 'window', {
  value: { matchMedia: matchMediaMock },
  writable: true,
})

Object.defineProperty(global, 'document', {
  value: documentMock,
  writable: true,
})

describe('Theme System Integration', () => {
  let router: any
  let themeStore: ReturnType<typeof useThemeStore>
  let userStore: ReturnType<typeof useUserStore>
  let navigationStore: ReturnType<typeof useNavigationStore>

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Create router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } },
      ],
    })

    // Create pinia and stores
    setActivePinia(createPinia())
    themeStore = useThemeStore()
    userStore = useUserStore()
    navigationStore = useNavigationStore()

    // Initialize stores
    themeStore.initializeTheme()
    
    // Push to home route
    await router.push('/')
    await router.isReady()
  })

  afterEach(() => {
    themeStore.cleanup()
  })

  describe('TopNavbar Theme Integration', () => {
    it('should render theme toggle in desktop navbar', async () => {
      const wrapper = mount(TopNavbar, {
        global: {
          plugins: [router],
        },
      })

      await flushPromises()

      // Should contain theme toggle component
      expect(wrapper.html()).toContain('theme-toggle')
      
      // Should show theme toggle button on desktop
      const themeToggle = wrapper.find('.theme-toggle')
      expect(themeToggle.exists()).toBe(true)
    })

    it('should hide theme toggle on mobile when menu is open', async () => {
      const wrapper = mount(TopNavbar, {
        global: {
          plugins: [router],
        },
      })

      await flushPromises()

      // Open mobile menu
      navigationStore.toggleMobileMenu()
      await wrapper.vm.$nextTick()

      // Theme toggle should be hidden when mobile menu is open
      const themeToggle = wrapper.find('.theme-toggle')
      expect(themeToggle.exists()).toBe(false)
    })

    it('should sync theme changes between navbar and store', async () => {
      const wrapper = mount(TopNavbar, {
        global: {
          plugins: [router],
        },
      })

      await flushPromises()

      // Find and click theme toggle button
      const themeButton = wrapper.find('.theme-toggle button')
      expect(themeButton.exists()).toBe(true)

      // Initial theme should be system
      expect(themeStore.currentTheme).toBe('system')

      // Click to cycle theme
      await themeButton.trigger('click')
      expect(themeStore.currentTheme).toBe('light')

      // Click again
      await themeButton.trigger('click')
      expect(themeStore.currentTheme).toBe('dark')
    })
  })

  describe('Mobile Navigation Theme Integration', () => {
    it('should render theme toggle in mobile menu', async () => {
      const navigationItems = [
        { id: '1', label: 'Home', route: '/', requiresAuth: false },
        { id: '2', label: 'About', route: '/about', requiresAuth: false },
      ]

      const wrapper = mount(MobileNavigationMenu, {
        props: {
          isOpen: true,
          navigationItems,
          user: null,
        },
        global: {
          plugins: [router],
        },
      })

      await flushPromises()

      // Should contain theme toggle in mobile menu
      expect(wrapper.html()).toContain('theme-toggle')
      
      // Should be dropdown variant
      const themeToggle = wrapper.find('.theme-toggle--dropdown')
      expect(themeToggle.exists()).toBe(true)
    })

    it('should allow theme selection from mobile dropdown', async () => {
      const navigationItems = [
        { id: '1', label: 'Home', route: '/', requiresAuth: false },
      ]

      const wrapper = mount(MobileNavigationMenu, {
        props: {
          isOpen: true,
          navigationItems,
          user: null,
        },
        global: {
          plugins: [router],
        },
      })

      await flushPromises()

      // Find theme dropdown button
      const dropdownButton = wrapper.find('.theme-toggle button')
      expect(dropdownButton.exists()).toBe(true)

      // Open dropdown
      await dropdownButton.trigger('click')

      // Find dark theme option
      const menuItems = wrapper.findAll('[role="menuitem"]')
      const darkOption = menuItems.find(item => item.text().includes('Dark'))
      
      expect(darkOption).toBeTruthy()
      
      // Select dark theme
      await darkOption!.trigger('click')
      expect(themeStore.currentTheme).toBe('dark')
    })
  })

  describe('Theme Persistence Integration', () => {
    it('should persist theme changes across component mounts', async () => {
      localStorageMock.getItem.mockReturnValue('dark')

      // Create new theme store instance (simulating app restart)
      const newThemeStore = useThemeStore()
      newThemeStore.initializeTheme()

      expect(newThemeStore.currentTheme).toBe('dark')
      expect(localStorageMock.getItem).toHaveBeenCalledWith(THEME_CONFIG.STORAGE_KEY)
    })

    it('should save theme changes to localStorage', async () => {
      const wrapper = mount(TopNavbar, {
        global: {
          plugins: [router],
        },
      })

      await flushPromises()

      // Change theme
      themeStore.setTheme('dark')

      // Should save to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        THEME_CONFIG.STORAGE_KEY,
        'dark'
      )
    })
  })

  describe('System Theme Detection Integration', () => {
    it('should detect system preference on initialization', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })

      const newThemeStore = useThemeStore()
      newThemeStore.initializeTheme()

      expect(newThemeStore.getSystemPreference()).toBe(true)
    })

    it('should update theme when system preference changes', () => {
      const addEventListener = vi.fn()
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener: vi.fn(),
      })

      themeStore.setTheme('system')
      themeStore.initializeTheme()

      // Simulate system theme change
      const changeHandler = addEventListener.mock.calls[0][1]
      changeHandler({ matches: true })

      expect(themeStore.isDarkMode).toBe(true)
    })
  })

  describe('DOM Integration', () => {
    it('should apply dark class to document when in dark mode', () => {
      themeStore.setTheme('dark')

      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith(
        THEME_CONFIG.DARK_CLASS
      )
    })

    it('should remove dark class from document when in light mode', () => {
      themeStore.setTheme('light')

      expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith(
        THEME_CONFIG.DARK_CLASS
      )
    })

    it('should handle system theme DOM updates', () => {
      const addEventListener = vi.fn()
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener,
        removeEventListener: vi.fn(),
      })

      themeStore.setTheme('system')
      themeStore.initializeTheme()

      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith(
        THEME_CONFIG.DARK_CLASS
      )
    })
  })

  describe('Cross-Component Theme Synchronization', () => {
    it('should synchronize theme between navbar and mobile menu', async () => {
      const navigationItems = [
        { id: '1', label: 'Home', route: '/', requiresAuth: false },
      ]

      // Mount both navbar and mobile menu
      const navbarWrapper = mount(TopNavbar, {
        global: { plugins: [router] },
      })

      const mobileWrapper = mount(MobileNavigationMenu, {
        props: {
          isOpen: true,
          navigationItems,
          user: null,
        },
        global: { plugins: [router] },
      })

      await flushPromises()

      // Change theme via navbar
      const navbarButton = navbarWrapper.find('.theme-toggle button')
      await navbarButton.trigger('click')

      // Both components should reflect the same theme
      expect(themeStore.currentTheme).toBe('light')

      // The mobile menu should show the same theme
      await mobileWrapper.vm.$nextTick()
      const mobileButton = mobileWrapper.find('.theme-toggle button')
      expect(mobileButton.text()).toContain('Light')
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage full')
      })

      // Should not throw error
      expect(() => themeStore.setTheme('dark')).not.toThrow()

      // Store should still update
      expect(themeStore.currentTheme).toBe('dark')
    })

    it('should handle missing global objects gracefully', () => {
      // Temporarily remove global objects
      const originalWindow = global.window
      const originalDocument = global.document

      delete (global as any).window
      delete (global as any).document

      // Should not throw errors
      expect(() => themeStore.setTheme('dark')).not.toThrow()
      expect(() => themeStore.initializeTheme()).not.toThrow()

      // Restore global objects
      global.window = originalWindow
      global.document = originalDocument
    })
  })
})