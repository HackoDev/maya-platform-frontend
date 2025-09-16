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
  isOpenToOffers?: boolean  // New field for "Open to Offers" flag
  // Contact information
  phone?: string
  whatsapp?: string
  telegram?: string
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
  isOpenToOffers?: boolean  // New field for "Open to Offers" flag
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

// Support module interfaces
export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'technical' | 'billing' | 'account'
  priority: number
  isPopular: boolean
  createdAt: string
  updatedAt: string
}

// Simplified FAQ interface for redesigned components
export interface SimplifiedFAQ {
  id: string
  question: string
  answer: string
  priority: number
  isPopular?: boolean  // Optional, for internal sorting only
}

export interface SupportMessage {
  id: string
  ticketId: string
  message: string
  isFromSupport: boolean
  createdAt: string
  author: {
    role: 'user' | 'support' | 'admin'
  }
}

export interface SupportTicket {
  id: string
  message: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  assignedTo?: string
  hasUnreadMessages: boolean
  messages: SupportMessage[]
}

export interface SupportFormData {
  message: string
}

// Support store interfaces
export interface SupportStoreState {
  faqs: FAQ[]
  supportTickets: SupportTicket[]
  currentTicket: SupportTicket | null
  expandedFAQs: Set<string>
  loading: {
    faqs: boolean
    tickets: boolean
    submission: boolean
    ticket: boolean
    messageSubmission: boolean
    resolution: boolean
  }
  error: string | null
}

export interface SupportStoreActions {
  fetchFAQs(): Promise<void>
  fetchSupportTickets(): Promise<void>
  submitSupportRequest(message: string): Promise<void>
  toggleFAQ(faqId: string): void
  clearErrors(): void
  setCurrentTicket(ticket: SupportTicket | null): void
  
  // New actions
  fetchTicket(ticketId: string): Promise<void>
  addMessage(ticketId: string, message: string): Promise<SupportMessage>
  resolveTicket(ticketId: string): Promise<SupportTicket>
}

// Export neural network profile types
export * from './neural-network-profile'

// Export specialist search types
export * from './specialist-search'