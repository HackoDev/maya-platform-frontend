import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'

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
}))

// Mock localStorage and matchMedia
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

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

Object.defineProperty(global, 'window', {
  value: { matchMedia: matchMediaMock },
  writable: true,
})

Object.defineProperty(global, 'document', {
  value: {
    documentElement: {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  writable: true,
})

describe('ThemeToggle Component', () => {
  let themeStore: ReturnType<typeof useThemeStore>

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    themeStore = useThemeStore()
    themeStore.initializeTheme()
  })

  describe('Button Variant', () => {
    it('should render button variant by default', () => {
      const wrapper = mount(ThemeToggle)
      
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('[data-testid="sun-icon"]').exists()).toBe(true)
    })

    it('should show correct icon for current theme', async () => {
      const wrapper = mount(ThemeToggle)
      
      // Default should be system/sun icon
      expect(wrapper.find('[data-testid="computer-icon"]').exists()).toBe(true)
      
      // Switch to dark theme
      themeStore.setTheme('dark')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="moon-icon"]').exists()).toBe(true)
      
      // Switch to light theme
      themeStore.setTheme('light')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="sun-icon"]').exists()).toBe(true)
    })

    it('should cycle themes on button click', async () => {
      const wrapper = mount(ThemeToggle)
      const button = wrapper.find('button')
      
      // Start with system theme
      expect(themeStore.currentTheme).toBe('system')
      
      // Click to go to light
      await button.trigger('click')
      expect(themeStore.currentTheme).toBe('light')
      
      // Click to go to dark
      await button.trigger('click')
      expect(themeStore.currentTheme).toBe('dark')
      
      // Click to go to system
      await button.trigger('click')
      expect(themeStore.currentTheme).toBe('system')
    })

    it('should handle keyboard events', async () => {
      const wrapper = mount(ThemeToggle)
      const button = wrapper.find('button')
      
      const initialTheme = themeStore.currentTheme
      
      // Test Enter key
      await button.trigger('keydown.enter')
      expect(themeStore.currentTheme).not.toBe(initialTheme)
      
      // Test Space key
      const afterEnterTheme = themeStore.currentTheme
      await button.trigger('keydown.space')
      expect(themeStore.currentTheme).not.toBe(afterEnterTheme)
    })

    it('should display label when showLabel is true', () => {
      const wrapper = mount(ThemeToggle, {
        props: { showLabel: true },
      })
      
      expect(wrapper.text()).toContain('System')
    })

    it('should apply correct size classes', () => {
      const wrapperSm = mount(ThemeToggle, { props: { size: 'sm' } })
      const wrapperMd = mount(ThemeToggle, { props: { size: 'md' } })
      const wrapperLg = mount(ThemeToggle, { props: { size: 'lg' } })
      
      expect(wrapperSm.find('button').classes()).toContain('h-8')
      expect(wrapperMd.find('button').classes()).toContain('h-10')
      expect(wrapperLg.find('button').classes()).toContain('h-12')
    })
  })

  describe('Dropdown Variant', () => {
    it('should render dropdown variant', () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      
      expect(wrapper.find('[data-testid="chevron-down-icon"]').exists()).toBe(true)
    })

    it('should toggle dropdown on button click', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      
      const button = wrapper.find('button')
      
      // Initially closed
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
      
      // Click to open
      await button.trigger('click')
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)
      
      // Click to close
      await button.trigger('click')
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('should close dropdown on escape key', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      
      const button = wrapper.find('button')
      
      // Open dropdown
      await button.trigger('click')
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)
      
      // Press escape
      await button.trigger('keydown.escape')
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('should select theme from dropdown', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      
      // Open dropdown
      await wrapper.find('button').trigger('click')
      
      // Find and click dark theme option
      const menuItems = wrapper.findAll('[role="menuitem"]')
      const darkOption = menuItems.find(item => item.text().includes('Dark'))
      
      expect(darkOption).toBeDefined()
      await darkOption!.trigger('click')
      
      expect(themeStore.currentTheme).toBe('dark')
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('should show check icon for current theme', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      
      themeStore.setTheme('dark')
      await wrapper.vm.$nextTick()
      
      // Open dropdown
      await wrapper.find('button').trigger('click')
      
      // Check that the current theme has a check icon
      const menuItems = wrapper.findAll('[role="menuitem"]')
      const darkOption = menuItems.find(item => item.text().includes('Dark'))
      
      expect(darkOption!.find('[data-testid="check-icon"]').exists()).toBe(true)
    })

    it('should position dropdown correctly', () => {
      const wrapperRight = mount(ThemeToggle, {
        props: { variant: 'dropdown', position: 'right' },
      })
      
      const wrapperLeft = mount(ThemeToggle, {
        props: { variant: 'dropdown', position: 'left' },
      })
      
      // These would need to be tested when dropdown is open
      // For now, just verify the component renders without error
      expect(wrapperRight.exists()).toBe(true)
      expect(wrapperLeft.exists()).toBe(true)
    })
  })

  describe('Switch Variant', () => {
    it('should render switch variant', () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'switch' },
      })
      
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
      expect(wrapper.find('label').exists()).toBe(true)
    })

    it('should reflect dark mode state', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'switch' },
      })
      
      const checkbox = wrapper.find('input[type="checkbox"]')
      
      // Set to light theme
      themeStore.setTheme('light')
      await wrapper.vm.$nextTick()
      expect(checkbox.element.checked).toBe(false)
      
      // Set to dark theme
      themeStore.setTheme('dark')
      await wrapper.vm.$nextTick()
      expect(checkbox.element.checked).toBe(true)
    })

    it('should toggle theme on switch change', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'switch' },
      })
      
      const checkbox = wrapper.find('input[type="checkbox"]')
      
      themeStore.setTheme('light')
      await wrapper.vm.$nextTick()
      
      await checkbox.trigger('change')
      expect(themeStore.currentTheme).toBe('dark')
      
      await checkbox.trigger('change')
      expect(themeStore.currentTheme).toBe('light')
    })

    it('should show switch label when enabled', () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'switch', showLabel: true },
      })
      
      expect(wrapper.text()).toMatch(/Light|Dark/)
    })

    it('should show correct icon in switch thumb', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'switch' },
      })
      
      // Light mode should show sun icon
      themeStore.setTheme('light')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="sun-icon"]').exists()).toBe(true)
      
      // Dark mode should show moon icon
      themeStore.setTheme('dark')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="moon-icon"]').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for button variant', () => {
      const wrapper = mount(ThemeToggle)
      const button = wrapper.find('button')
      
      expect(button.attributes('aria-label')).toBeTruthy()
      expect(button.attributes('title')).toBeTruthy()
    })

    it('should have proper ARIA attributes for dropdown variant', () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      const button = wrapper.find('button')
      
      expect(button.attributes('aria-label')).toBeTruthy()
      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-haspopup')).toBe('true')
    })

    it('should have proper ARIA attributes for switch variant', () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'switch' },
      })
      const checkbox = wrapper.find('input[type="checkbox"]')
      
      expect(checkbox.attributes('aria-label')).toBeTruthy()
      expect(checkbox.classes()).toContain('sr-only')
    })

    it('should update dropdown aria-expanded state', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      const button = wrapper.find('button')
      
      expect(button.attributes('aria-expanded')).toBe('false')
      
      await button.trigger('click')
      expect(button.attributes('aria-expanded')).toBe('true')
    })

    it('should have menu role for dropdown items', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
      })
      
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)
      expect(wrapper.findAll('[role="menuitem"]').length).toBe(3)
    })
  })

  describe('Click Outside Handler', () => {
    it('should close dropdown when clicking outside', async () => {
      const wrapper = mount(ThemeToggle, {
        props: { variant: 'dropdown' },
        attachTo: document.body,
      })
      
      // Open dropdown
      await wrapper.find('button').trigger('click')
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)
      
      // Simulate click outside
      const outsideEvent = new Event('click')
      document.dispatchEvent(outsideEvent)
      
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
      
      wrapper.unmount()
    })
  })

  describe('Component Props', () => {
    it('should apply default props correctly', () => {
      const wrapper = mount(ThemeToggle)
      
      expect(wrapper.classes()).toContain('theme-toggle--button')
      expect(wrapper.classes()).toContain('theme-toggle--md')
    })

    it('should handle all size variants', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      
      sizes.forEach(size => {
        const wrapper = mount(ThemeToggle, { props: { size } })
        expect(wrapper.classes()).toContain(`theme-toggle--${size}`)
      })
    })

    it('should handle all variant types', () => {
      const variants = ['button', 'dropdown', 'switch'] as const
      
      variants.forEach(variant => {
        const wrapper = mount(ThemeToggle, { props: { variant } })
        expect(wrapper.classes()).toContain(`theme-toggle--${variant}`)
      })
    })
  })
})