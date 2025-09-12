// Specialist Profile View Types and Interfaces

import type { SpecialistProfile } from './specialist-search'
import type { NeuralNetworkProfileSchema } from './neural-network-profile'

// Combined profile data for the view page
export interface ProfileViewData {
  // Basic information from SpecialistProfile
  basicInfo: {
    id: string
    userId: string
    displayName: string
    superpower: string
    avatarUrl?: string
    status: 'available' | 'busy' | 'unavailable'
    isOpenToOffers?: boolean  // New field for "Open to Offers" flag
    lastActive: string
  }

  // Detailed information from NeuralNetworkProfileSchema
  detailedInfo: {
    specializations: string[]
    abilities: string[]
    services: ServiceDetails[]
    portfolio: PortfolioCase[]
    experience: ExperienceEntry[]
    testimonials: TestimonialData
    contacts: ContactInfo
  }

  // View metadata
  metadata: {
    profileCompleted: boolean
    completionPercentage: number
    moderationStatus: 'draft' | 'pending' | 'approved' | 'rejected'
    lastUpdated: string
  }
}

// Service details for display
export interface ServiceDetails {
  name: string
  description?: string
  price: number | string
  priceType: 'fixed' | 'hourly' | 'project' | 'negotiable'
  category?: string
  isCustom: boolean
}

// Portfolio case display
export interface PortfolioCase {
  id: string
  title: string
  description: string
  type: 'text' | 'link' | 'visual' | 'bot' | 'landing'
  content: string | FileReference
  result?: string
  tools?: string[]
  createdAt: string
  thumbnailUrl?: string
}

// Experience entry display
export interface ExperienceEntry {
  id: string
  client: string
  task: string
  tools: string[]
  result: string
  duration?: string
  year?: string
  projectType?: string
}

// Testimonial data for display
export interface TestimonialData {
  textTestimonials: TestimonialEntry[]
  externalLinks: string[]
  files: FileReference[]
  averageRating?: number
  totalCount: number
}

// Individual testimonial entry
export interface TestimonialEntry {
  id: string
  clientName: string
  clientPosition?: string
  testimonialText: string
  rating?: number
  projectType?: string
  date?: string
  verified?: boolean
}

// File reference for attachments
export interface FileReference {
  url: string
  filename: string
  size: number
  mimeType: string
  thumbnailUrl?: string
}

// Contact information display
export interface ContactInfo {
  telegram?: string
  email?: string
  website?: string
  phone?: string
  whatsapp?: string
  discord?: string
  linkedin?: string
  preferredContact?: string
  responseTime?: string
  availability?: string
}

// Profile sections configuration
export interface ProfileSection {
  id: string
  title: string
  component: string
  visible: boolean
  order: number
  required: boolean
}

// Props for main profile view page
export interface SpecialistProfileViewPageProps {
  specialistId: string
  modalMode?: boolean
}

// Props for profile header component
export interface ProfileHeaderProps {
  basicInfo: ProfileViewData['basicInfo']
  contacts: ContactInfo
}

// Props for profile overview component
export interface ProfileOverviewProps {
  basicInfo: ProfileViewData['basicInfo']
  specializations: string[]
  abilities: string[]
  services: ServiceDetails[]
}

// Props for specializations section
export interface SpecializationsSectionProps {
  specializations: string[]
  abilities: string[]
}

// Props for abilities section
export interface AbilitiesSectionProps {
  abilities: string[]
}

// Props for services section
export interface ServicesSectionProps {
  services: ServiceDetails[]
  specialistName: string
  contacts: ContactInfo
}

// Props for portfolio section
export interface PortfolioSectionProps {
  portfolio: PortfolioCase[]
  specialistName: string
}

// Props for experience section
export interface ExperienceSectionProps {
  experience: ExperienceEntry[]
}

// Props for testimonials section
export interface TestimonialsSectionProps {
  testimonials: TestimonialData
}

// Props for contact section
export interface ContactSectionProps {
  contacts: ContactInfo
  specialistName: string
  basicInfo: ProfileViewData['basicInfo']
}

// Props for service card component
export interface ServiceCardProps {
  service: ServiceDetails
  specialistName: string
  onContact: (service: ServiceDetails) => void
}

// Props for portfolio card component
export interface PortfolioCardProps {
  portfolioCase: PortfolioCase
  onView: (portfolioCase: PortfolioCase) => void
}

// Props for experience card component
export interface ExperienceCardProps {
  experience: ExperienceEntry
}

// Props for testimonial card component
export interface TestimonialCardProps {
  testimonial: TestimonialEntry
}

// Store state interface
export interface SpecialistProfileViewStore {
  // State
  currentProfile: ProfileViewData | null
  isLoading: boolean
  error: string | null
  
  // Modal state
  isModalOpen: boolean
  
  // Actions
  loadProfile: (id: string) => Promise<void>
  clearProfile: () => void
  openModal: () => void
  closeModal: () => void
  
  // Getters
  isProfileLoaded: boolean
  profileSections: ProfileSection[]
}

// API service interface
export interface SpecialistProfileViewAPI {
  getProfileById(id: string): Promise<ProfileViewData>
  getBasicProfile(id: string): Promise<SpecialistProfile>
  getDetailedProfile(id: string): Promise<NeuralNetworkProfileSchema>
}

// View configuration
export interface ProfileViewConfig {
  sections: ProfileSection[]
  layout: 'single-column' | 'two-column'
  showContactActions: boolean
  showBackNavigation: boolean
  enableModal: boolean
}

// Navigation context
export interface ProfileViewNavigation {
  from?: 'search' | 'direct' | 'modal'
  returnTo?: string
  searchFilters?: Record<string, any>
}

// Modal configuration
export interface ModalConfig {
  backdrop: 'blur' | 'dark' | 'transparent'
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable: boolean
  scrollable: boolean
}

// Theme configuration
export interface ProfileViewTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  gradients: {
    header: string
    cards: string
  }
}

// Responsive breakpoints
export interface ResponsiveConfig {
  mobile: string
  tablet: string
  desktop: string
  largeDesktop: string
}