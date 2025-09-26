import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { ThemeMode } from '@/types/theme'
import { THEME_CONFIG } from '@/types/theme'

/**
 * Theme management store using Pinia
 * Handles theme detection, persistence, and DOM class management
 */
export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<ThemeMode>(THEME_CONFIG.DEFAULT_THEME)
  const systemIsDark = ref<boolean>(false)

  // Computed
  const isDarkMode = computed<boolean>(() => {
    if (currentTheme.value === 'system') {
      return systemIsDark.value
    }
    return currentTheme.value === 'dark'
  })

  const isSystemPreference = computed<boolean>(() => {
    return currentTheme.value === 'system'
  })

  // MediaQuery listener for system theme changes
  let mediaQueryList: MediaQueryList | null = null

  /**
   * Detects the system's color scheme preference
   */
  const getSystemPreference = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(THEME_CONFIG.DARK_MEDIA_QUERY).matches
  }

  /**
   * Updates the system dark mode state
   */
  const updateSystemPreference = (): void => {
    systemIsDark.value = getSystemPreference()
  }

  /**
   * Sets up the media query listener for system theme changes
   */
  const setupSystemListener = (): void => {
    if (typeof window === 'undefined') return

    mediaQueryList = window.matchMedia(THEME_CONFIG.DARK_MEDIA_QUERY)
    
    // Update initial state
    updateSystemPreference()
    
    // Listen for changes
    const handleSystemChange = (e: MediaQueryListEvent) => {
      systemIsDark.value = e.matches
      if (currentTheme.value === 'system') {
        applyThemeToDOM()
      }
    }

    mediaQueryList.addEventListener('change', handleSystemChange)
  }

  /**
   * Removes the media query listener
   */
  const removeSystemListener = (): void => {
    if (mediaQueryList) {
      mediaQueryList.removeEventListener('change', updateSystemPreference)
    }
  }

  /**
   * Applies the current theme to the DOM
   */
  const applyThemeToDOM = (): void => {
    if (typeof document === 'undefined') return

    const htmlElement = document.documentElement
    
    // Удаляем все классы тем
    htmlElement.classList.remove(THEME_CONFIG.DARK_CLASS, 'light')
    
    if (isDarkMode.value) {
      htmlElement.classList.add(THEME_CONFIG.DARK_CLASS)
    } else {
      htmlElement.classList.add('light')
    }
  }

  /**
   * Saves the theme preference to localStorage
   */
  const saveThemePreference = (theme: ThemeMode): void => {
    if (typeof localStorage === 'undefined') return
    
    try {
      localStorage.setItem(THEME_CONFIG.STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }

  /**
   * Loads the theme preference from localStorage
   */
  const loadThemePreference = (): ThemeMode => {
    if (typeof localStorage === 'undefined') return THEME_CONFIG.DEFAULT_THEME
    
    try {
      const stored = localStorage.getItem(THEME_CONFIG.STORAGE_KEY)
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as ThemeMode
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error)
    }
    
    return THEME_CONFIG.DEFAULT_THEME
  }

  /**
   * Sets the current theme and applies it
   */
  const setTheme = (theme: ThemeMode): void => {
    currentTheme.value = theme
    saveThemePreference(theme)
    applyThemeToDOM()
  }

  /**
   * Toggles between light and dark themes (excludes system)
   */
  const toggleTheme = (): void => {
    if (currentTheme.value === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  /**
   * Cycles through all theme options
   */
  const cycleTheme = (): void => {
    switch (currentTheme.value) {
      case 'light':
        setTheme('dark')
        break
      case 'dark':
        setTheme('system')
        break
      case 'system':
        setTheme('light')
        break
    }
  }

  /**
   * Initializes the theme system
   */
  const initializeTheme = (): void => {
    // Set up system preference detection
    setupSystemListener()
    
    // Load stored preference or use default
    const storedTheme = loadThemePreference()
    currentTheme.value = storedTheme
    
    // Apply initial theme
    applyThemeToDOM()
  }

  /**
   * Initialize theme from user preferences
   * @param userTheme - User's preferred theme from backend
   */
  const initializeFromUserPreference = (userTheme?: string | null): void => {
    if (userTheme && ['light', 'dark', 'system'].includes(userTheme)) {
      // User has a valid theme preference
      setTheme(userTheme as ThemeMode)
    } else {
      // No valid user preference, use default dark theme
      setTheme(THEME_CONFIG.DEFAULT_THEME)
    }
  }

  /**
   * Cleanup function for when the store is no longer needed
   */
  const cleanup = (): void => {
    removeSystemListener()
  }

  // Public API
  return {
    // State
    currentTheme: readonly(currentTheme),
    isDarkMode,
    isSystemPreference,
    systemIsDark: readonly(systemIsDark),

    // Actions
    setTheme,
    toggleTheme,
    cycleTheme,
    initializeTheme,
    initializeFromUserPreference,
    cleanup,
    
    // Utilities
    getSystemPreference,
  }
})