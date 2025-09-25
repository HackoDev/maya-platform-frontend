// Specialist Profile View Types for Simplified Schema

import type { NeuralNetworkProfile } from './neural-network-profile-simple'

// Combined profile data for the view page using simplified schema
export interface SpecialistProfileViewData {
  // Basic information
  basicInfo: {
    id: string
    userId: string
    displayName: string
    superpower: string
    avatarUrl?: string
    status: 'available' | 'busy' | 'unavailable'
    isOpenToOffers?: boolean
    lastActive: string
  }

  // Profile data from simplified NeuralNetworkProfile
  profileData: NeuralNetworkProfile

  // View metadata
  metadata: {
    profileCompleted: boolean
    completionPercentage: number
    moderationStatus: 'draft' | 'pending' | 'approved' | 'rejected'
    lastUpdated: string
    viewCount?: number
    rating?: number
  }
}

// Props for the profile view page
export interface SpecialistProfileViewPageProps {
  specialistId?: string
  modalMode?: boolean
}

// Display helpers for the simplified schema
export interface DisplaySpecialization {
  id: number
  name: string
  isCustom: boolean
}

export interface DisplaySkill {
  id: number
  name: string
  tools: string[]
  isCustom: boolean
}

export interface DisplayService {
  id: string
  name: string
  description: string
  price: number
  priceType: 'fixed' | 'hourly' | 'project' | 'negotiable'
  formattedPrice: string
}

export interface DisplayPortfolioItem {
  id: string
  title: string
  description: string
  type: 'text' | 'link' | 'image' | 'bot' | 'landing'
  content: string
  result: string
  tools: string[]
  typeLabel: string
  typeIcon: string
}

export interface DisplayExperienceItem {
  id: string
  client: string
  task: string
  result: string
  tools: string[]
  duration: string
  year: string
}

export interface DisplayTestimonialItem {
  id: string
  url: string
  title: string
}

export interface DisplayContactInfo {
  phone?: string
  telegram?: string
  whatsapp?: string
  email?: string
  hasContacts: boolean
}

// Store state interface
export interface SpecialistProfileViewState {
  currentProfile: SpecialistProfileViewData | null
  isLoading: boolean
  error: string | null
  isModalOpen: boolean
}

// Store actions interface
export interface SpecialistProfileViewActions {
  loadProfile: (specialistId: string) => Promise<void>
  clearProfile: () => void
  openModal: () => void
  closeModal: () => void
  shareProfile: () => void
  copyProfileLink: () => void
  retryLoading: () => Promise<void>
}

// Computed properties interface
export interface SpecialistProfileViewComputed {
  hasPortfolio: boolean
  hasExperience: boolean
  hasTestimonials: boolean
  hasServices: boolean
  hasContacts: boolean
  completionPercentage: number
  isProfileComplete: boolean
  formattedLastActive: string
  displaySpecializations: DisplaySpecialization[]
  displaySkills: DisplaySkill[]
  displayServices: DisplayService[]
  displayPortfolio: DisplayPortfolioItem[]
  displayExperience: DisplayExperienceItem[]
  displayTestimonials: DisplayTestimonialItem[]
  displayContacts: DisplayContactInfo
}
