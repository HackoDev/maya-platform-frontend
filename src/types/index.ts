// Global type definitions

export interface User {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  userType: 'specialist' | 'client'
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
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
  isMobileMenuOpen: boolean
  activeRoute: string
  navigationItems: NavigationItem[]
}

export interface NavigationStoreActions {
  toggleMobileMenu(): void
  closeMobileMenu(): void
  setActiveRoute(route: string): void
  getVisibleNavigationItems(): NavigationItem[]
}
