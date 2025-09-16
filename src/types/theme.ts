/**
 * Theme management types and interfaces
 */

/**
 * Available theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Theme state interface for the store
 */
export interface ThemeState {
  /** Current selected theme mode */
  currentTheme: ThemeMode
  /** Whether dark mode is currently active */
  isDarkMode: boolean
}

/**
 * Theme option for UI components
 */
export interface ThemeOption {
  /** Theme mode value */
  value: ThemeMode
  /** Display label for the option */
  label: string
  /** Icon name or component for the option */
  icon: string
}

/**
 * Props for ThemeToggle component
 */
export interface ThemeToggleProps {
  /** Visual variant of the theme toggle */
  variant?: 'button' | 'dropdown' | 'switch'
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg'
  /** Whether to show text labels */
  showLabel?: boolean
  /** Position of dropdown (when applicable) */
  position?: 'left' | 'right'
}

/**
 * Theme configuration constants
 */
export const THEME_CONFIG = {
  /** LocalStorage key for theme preference */
  STORAGE_KEY: 'maya-platform-theme',
  /** CSS class applied to document for dark mode */
  DARK_CLASS: 'dark',
  /** Media query for system dark mode preference */
  DARK_MEDIA_QUERY: '(prefers-color-scheme: dark)',
  /** Default theme when no preference is stored */
  DEFAULT_THEME: 'dark' as ThemeMode,
} as const

/**
 * Theme options for UI components
 */
export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: 'sun',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: 'moon',
  },
  {
    value: 'system',
    label: 'System',
    icon: 'computer',
  },
] as const