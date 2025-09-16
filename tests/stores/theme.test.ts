import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { THEME_CONFIG } from '@/types/theme'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock document
const documentMock = {
  documentElement: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
    },
  },
}

describe('Theme Store', () => {
  let themeStore: ReturnType<typeof useThemeStore>

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock global objects
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    
    Object.defineProperty(global, 'window', {
      value: {
        matchMedia: matchMediaMock,
      },
      writable: true,
    })
    
    Object.defineProperty(global, 'document', {
      value: documentMock,
      writable: true,
    })

    // Create fresh pinia instance
    setActivePinia(createPinia())
    themeStore = useThemeStore()
  })

  afterEach(() => {
    themeStore.cleanup()
  })

  describe('Initial State', () => {
    it('should have correct default state', () => {
      expect(themeStore.currentTheme).toBe('system')
      expect(themeStore.isSystemPreference).toBe(true)
    })
  })

  describe('Theme Detection', () => {
    it('should detect light system preference', () => {
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })

      const isSystemDark = themeStore.getSystemPreference()
      expect(isSystemDark).toBe(false)
    })

    it('should detect dark system preference', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })

      const isSystemDark = themeStore.getSystemPreference()
      expect(isSystemDark).toBe(true)
    })
  })

  describe('Theme Setting', () => {
    it('should set light theme', () => {
      themeStore.setTheme('light')
      
      expect(themeStore.currentTheme).toBe('light')
      expect(themeStore.isDarkMode).toBe(false)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        THEME_CONFIG.STORAGE_KEY,
        'light'
      )
      expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith(
        THEME_CONFIG.DARK_CLASS
      )
    })

    it('should set dark theme', () => {
      themeStore.setTheme('dark')
      
      expect(themeStore.currentTheme).toBe('dark')
      expect(themeStore.isDarkMode).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        THEME_CONFIG.STORAGE_KEY,
        'dark'
      )
      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith(
        THEME_CONFIG.DARK_CLASS
      )
    })

    it('should set system theme', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })

      themeStore.initializeTheme()
      themeStore.setTheme('system')
      
      expect(themeStore.currentTheme).toBe('system')
      expect(themeStore.isSystemPreference).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        THEME_CONFIG.STORAGE_KEY,
        'system'
      )
    })
  })

  describe('Theme Toggling', () => {
    it('should toggle from light to dark', () => {
      themeStore.setTheme('light')
      themeStore.toggleTheme()
      
      expect(themeStore.currentTheme).toBe('dark')
      expect(themeStore.isDarkMode).toBe(true)
    })

    it('should toggle from dark to light', () => {
      themeStore.setTheme('dark')
      themeStore.toggleTheme()
      
      expect(themeStore.currentTheme).toBe('light')
      expect(themeStore.isDarkMode).toBe(false)
    })

    it('should cycle through all themes', () => {
      themeStore.setTheme('light')
      themeStore.cycleTheme()
      expect(themeStore.currentTheme).toBe('dark')
      
      themeStore.cycleTheme()
      expect(themeStore.currentTheme).toBe('system')
      
      themeStore.cycleTheme()
      expect(themeStore.currentTheme).toBe('light')
    })
  })

  describe('Persistence', () => {
    it('should load theme from localStorage on initialization', () => {
      localStorageMock.getItem.mockReturnValue('dark')
      
      themeStore.initializeTheme()
      
      expect(themeStore.currentTheme).toBe('dark')
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        THEME_CONFIG.STORAGE_KEY
      )
    })

    it('should handle invalid localStorage values', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme')
      
      themeStore.initializeTheme()
      
      expect(themeStore.currentTheme).toBe(THEME_CONFIG.DEFAULT_THEME)
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      themeStore.initializeTheme()
      
      expect(themeStore.currentTheme).toBe(THEME_CONFIG.DEFAULT_THEME)
    })

    it('should save theme preference on change', () => {
      themeStore.setTheme('dark')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        THEME_CONFIG.STORAGE_KEY,
        'dark'
      )
    })
  })

  describe('System Theme Changes', () => {
    it('should update theme when system preference changes and using system theme', () => {
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

    it('should not update theme when not using system preference', () => {
      const addEventListener = vi.fn()
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener: vi.fn(),
      })

      themeStore.setTheme('light')
      themeStore.initializeTheme()

      // Simulate system theme change
      const changeHandler = addEventListener.mock.calls[0][1]
      changeHandler({ matches: true })

      expect(themeStore.isDarkMode).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should calculate isDarkMode correctly for light theme', () => {
      themeStore.setTheme('light')
      expect(themeStore.isDarkMode).toBe(false)
    })

    it('should calculate isDarkMode correctly for dark theme', () => {
      themeStore.setTheme('dark')
      expect(themeStore.isDarkMode).toBe(true)
    })

    it('should calculate isDarkMode correctly for system theme with light preference', () => {
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })

      themeStore.initializeTheme()
      themeStore.setTheme('system')
      expect(themeStore.isDarkMode).toBe(false)
    })

    it('should calculate isDarkMode correctly for system theme with dark preference', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })

      themeStore.initializeTheme()
      themeStore.setTheme('system')
      expect(themeStore.isDarkMode).toBe(true)
    })

    it('should calculate isSystemPreference correctly', () => {
      themeStore.setTheme('light')
      expect(themeStore.isSystemPreference).toBe(false)

      themeStore.setTheme('dark')
      expect(themeStore.isSystemPreference).toBe(false)

      themeStore.setTheme('system')
      expect(themeStore.isSystemPreference).toBe(true)
    })
  })

  describe('DOM Manipulation', () => {
    it('should add dark class when in dark mode', () => {
      themeStore.setTheme('dark')
      
      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith(
        THEME_CONFIG.DARK_CLASS
      )
    })

    it('should remove dark class when in light mode', () => {
      themeStore.setTheme('light')
      
      expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith(
        THEME_CONFIG.DARK_CLASS
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined window gracefully', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      })

      expect(() => themeStore.initializeTheme()).not.toThrow()
    })

    it('should handle undefined document gracefully', () => {
      Object.defineProperty(global, 'document', {
        value: undefined,
        writable: true,
      })

      expect(() => themeStore.setTheme('dark')).not.toThrow()
    })

    it('should handle undefined localStorage gracefully', () => {
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true,
      })

      expect(() => themeStore.setTheme('dark')).not.toThrow()
    })
  })
})