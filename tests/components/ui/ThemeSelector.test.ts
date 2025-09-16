import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'
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
  },
  writable: true,
})

describe('ThemeSelector Component', () => {
  let themeStore: ReturnType<typeof useThemeStore>

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    themeStore = useThemeStore()
    themeStore.initializeTheme()
  })

  describe('Rendering', () => {
    it('should render all three theme options', () => {
      const wrapper = mount(ThemeSelector)
      
      // Should render 3 theme cards
      const themeCards = wrapper.findAll('[data-testid]').filter(w => 
        w.attributes('data-testid')?.includes('-icon')
      )
      expect(themeCards.length).toBeGreaterThanOrEqual(3)
      
      // Check for theme labels
      expect(wrapper.text()).toContain('Светлая тема')
      expect(wrapper.text()).toContain('Темная тема')
      expect(wrapper.text()).toContain('Системная тема')
    })

    it('should render theme descriptions', () => {
      const wrapper = mount(ThemeSelector)
      
      expect(wrapper.text()).toContain('Классический светлый интерфейс')
      expect(wrapper.text()).toContain('Стильный темный интерфейс')
      expect(wrapper.text()).toContain('Следует настройкам системы')
    })

    it('should show correct icons for each theme', () => {
      const wrapper = mount(ThemeSelector)
      
      expect(wrapper.find('[data-testid="sun-icon"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="moon-icon"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="computer-icon"]').exists()).toBe(true)
    })
  })

  describe('Theme Selection', () => {
    it('should highlight the currently selected theme', async () => {
      const wrapper = mount(ThemeSelector)
      
      // Initially system theme should be selected
      expect(themeStore.currentTheme).toBe('system')
      
      // Check that check icon is shown for selected theme
      expect(wrapper.find('[data-testid="check-icon"]').exists()).toBe(true)
    })

    it('should change theme when clicking on a theme card', async () => {
      const wrapper = mount(ThemeSelector)
      
      // Find all clickable theme cards
      const themeCards = wrapper.findAll('.cursor-pointer.group')
      expect(themeCards.length).toBe(3)
      
      // Click on the first card (light theme)
      await themeCards[0].trigger('click')
      
      expect(themeStore.currentTheme).toBe('light')
    })

    it('should update visual selection when theme changes', async () => {
      const wrapper = mount(ThemeSelector)
      
      // Change theme to dark
      themeStore.setTheme('dark')
      await wrapper.vm.$nextTick()
      
      // Check that the dark theme card shows selection styling
      const themeCards = wrapper.findAll('.cursor-pointer.group')
      const darkCard = themeCards[1] // Assuming dark is second card
      
      expect(darkCard.classes()).toContain('border-blue-500')
    })
  })

  describe('Theme Previews', () => {
    it('should show different preview styles for each theme', () => {
      const wrapper = mount(ThemeSelector)
      
      // Find preview containers
      const previews = wrapper.findAll('.h-24.relative')
      expect(previews.length).toBe(3)
      
      // Light theme should have white background
      expect(previews[0].classes()).toContain('bg-white')
      
      // Dark theme should have dark background
      expect(previews[1].classes()).toContain('bg-gray-900')
    })

    it('should show system theme preview based on system preference', () => {
      // Mock system dark preference
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
      
      const wrapper = mount(ThemeSelector)
      themeStore.initializeTheme()
      
      const previews = wrapper.findAll('.h-24.relative')
      // System theme preview should reflect system preference
      expect(previews[2].classes()).toContain('bg-gray-900')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = mount(ThemeSelector)
      
      const themeCards = wrapper.findAll('.cursor-pointer')
      
      themeCards.forEach(card => {
        // Cards should be clickable and focusable
        expect(card.attributes('role')).toBeDefined()
      })
    })

    it('should support keyboard navigation', async () => {
      const wrapper = mount(ThemeSelector)
      
      const firstCard = wrapper.find('.cursor-pointer')
      
      // Should be able to trigger with keyboard events
      await firstCard.trigger('keydown.enter')
      // Should change theme
      expect(themeStore.currentTheme).toBe('light')
    })
  })

  describe('Visual States', () => {
    it('should show hover effects', () => {
      const wrapper = mount(ThemeSelector)
      
      const themeCards = wrapper.findAll('.cursor-pointer.group')
      
      themeCards.forEach(card => {
        expect(card.classes()).toContain('hover:scale-105')
        expect(card.classes()).toContain('transition-all')
      })
    })

    it('should show different border styles for selected and unselected themes', async () => {
      const wrapper = mount(ThemeSelector)
      
      // Set light theme as selected
      themeStore.setTheme('light')
      await wrapper.vm.$nextTick()
      
      const themeCards = wrapper.findAll('.cursor-pointer.group')
      
      // Check that selected theme has special border
      const selectedCard = themeCards.find(card => 
        card.classes().includes('border-blue-500')
      )
      expect(selectedCard).toBeDefined()
    })
  })

  describe('Responsive Behavior', () => {
    it('should have responsive grid layout', () => {
      const wrapper = mount(ThemeSelector)
      
      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-3')
    })

    it('should have proper spacing and gaps', () => {
      const wrapper = mount(ThemeSelector)
      
      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('gap-4')
    })
  })
})