// Global type definitions
import type { Ref } from 'vue'

export interface User {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  role?: 'admin' | 'user' | 'moderator'  // Optional for backward compatibility
  userType: string
  isActive: boolean
  isOpenToOffers?: boolean  // New field for "Open to Offers" flag
  generalConsentAccepted?: boolean  // General personal data processing consent flag
  portfolioStatus?: 'published' | 'draft' | 'archived' | null // Backend-driven portfolio status
  uiTheme?: string | null  // User's preferred UI theme
  // Contact information
  phone: string | null
  whatsapp: string | null
  telegram: string | null
  lastLoginAt: string
  createdAt: string
  updatedAt?: string  // Optional for backward compatibility
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Navigation interfaces
export interface NavigationItem {
  id: string
  label: string
  route: string
  icon?: string
  badge?: string
  requiresAuth: boolean
  visible: boolean
  userType?: string
}

// User Profile interfaces
export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  userType: 'specialist' | 'client'
  role: 'admin' | 'user' | 'moderator'
  isActive: boolean
  isOpenToOffers?: boolean  // New field for "Open to Offers" flag
  uiTheme?: string | null  // User's preferred UI theme
  // Contact information
  phone?: string
  whatsapp?: string
  telegram?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// Navigation props
export interface TopNavbarProps {
  serviceName?: string
  logoUrl?: string
  theme?: 'light' | 'dark'
}

// Store interfaces
export interface NavigationStoreState {
  isMobileMenuOpen: Ref<boolean>
  activeRoute: Ref<string>
  navigationItems: Ref<NavigationItem[]>
}

export interface NavigationStoreActions {
  toggleMobileMenu(): void
  closeMobileMenu(): void
  setActiveRoute(route: string): void
  getVisibleNavigationItems(): NavigationItem[]
  updateActiveRoute(): void
}

// Export support types
export * from './support'

// Export neural network profile types
export * from './neural-network-profile'

// Export specialist search types
export * from './specialist-search'