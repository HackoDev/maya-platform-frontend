import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ProfileViewData,
  ProfileSection,
  SpecialistProfileViewStore as StoreInterface
} from '@/types/specialist-profile-view'
import { SpecialistProfileViewService } from '@/services/specialist-profile-view'

export const useSpecialistProfileViewStore = defineStore('specialistProfileView', () => {
  // State
  const currentProfile = ref<ProfileViewData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isModalOpen = ref(false)

  // Service instance
  const profileService = new SpecialistProfileViewService()

  // Profile sections configuration
  const defaultSections: ProfileSection[] = [
    {
      id: 'overview',
      title: 'Обзор',
      component: 'ProfileOverview',
      visible: true,
      order: 1,
      required: true
    },
    {
      id: 'specializations',
      title: 'Специализации',
      component: 'SpecializationsSection',
      visible: true,
      order: 2,
      required: true
    },
    {
      id: 'abilities',
      title: 'Навыки и умения',
      component: 'AbilitiesSection',
      visible: true,
      order: 3,
      required: true
    },
    {
      id: 'services',
      title: 'Услуги и цены',
      component: 'ServicesSection',
      visible: true,
      order: 4,
      required: true
    },
    {
      id: 'portfolio',
      title: 'Портфолио',
      component: 'PortfolioSection',
      visible: true,
      order: 5,
      required: false
    },
    {
      id: 'experience',
      title: 'Опыт работы',
      component: 'ExperienceSection',
      visible: true,
      order: 6,
      required: false
    },
    {
      id: 'testimonials',
      title: 'Отзывы',
      component: 'TestimonialsSection',
      visible: true,
      order: 7,
      required: false
    },
    {
      id: 'contacts',
      title: 'Контакты',
      component: 'ContactSection',
      visible: true,
      order: 8,
      required: true
    }
  ]

  // Getters
  const isProfileLoaded = computed(() => {
    return currentProfile.value !== null
  })

  const profileSections = computed(() => {
    if (!currentProfile.value) {
      return defaultSections.filter(section => section.required)
    }

    return defaultSections
      .filter(section => {
        if (!section.visible) return false
        
        // Hide sections that have no data (for optional sections)
        if (!section.required) {
          switch (section.id) {
            case 'portfolio':
              return currentProfile.value?.detailedInfo.portfolio.length > 0
            case 'experience':
              return currentProfile.value?.detailedInfo.experience.length > 0
            case 'testimonials':
              return currentProfile.value?.detailedInfo.testimonials.totalCount > 0
            default:
              return true
          }
        }
        
        return true
      })
      .sort((a, b) => a.order - b.order)
  })

  const hasPortfolio = computed(() => {
    return currentProfile.value?.detailedInfo.portfolio.length > 0
  })

  const hasExperience = computed(() => {
    return currentProfile.value?.detailedInfo.experience.length > 0
  })

  const hasTestimonials = computed(() => {
    return currentProfile.value?.detailedInfo.testimonials.totalCount > 0
  })

  const averageRating = computed(() => {
    return currentProfile.value?.detailedInfo.testimonials.averageRating
  })

  const isProfileApproved = computed(() => {
    return currentProfile.value?.metadata.moderationStatus === 'approved'
  })

  const profileCompletionPercentage = computed(() => {
    return currentProfile.value?.metadata.completionPercentage || 0
  })

  // Actions
  const loadProfile = async (id: string): Promise<void> => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const profileData = await profileService.getProfileById(id)
      currentProfile.value = profileData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки профиля'
      currentProfile.value = null
    } finally {
      isLoading.value = false
    }
  }

  const clearProfile = (): void => {
    currentProfile.value = null
    error.value = null
    isLoading.value = false
  }

  const openModal = (): void => {
    isModalOpen.value = true
    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
  }

  const closeModal = (): void => {
    isModalOpen.value = false
    // Restore body scroll when modal is closed
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto'
    }
  }

  const refreshProfile = async (): Promise<void> => {
    if (currentProfile.value) {
      await loadProfile(currentProfile.value.basicInfo.id)
    }
  }

  const updateSectionVisibility = (sectionId: string, visible: boolean): void => {
    const section = defaultSections.find(s => s.id === sectionId)
    if (section) {
      section.visible = visible
    }
  }

  const getSectionData = (sectionId: string) => {
    if (!currentProfile.value) return null

    switch (sectionId) {
      case 'overview':
        return {
          basicInfo: currentProfile.value.basicInfo,
          specializations: currentProfile.value.detailedInfo.specializations,
          abilities: currentProfile.value.detailedInfo.abilities,
          services: currentProfile.value.detailedInfo.services
        }
      case 'specializations':
        return {
          specializations: currentProfile.value.detailedInfo.specializations,
          abilities: currentProfile.value.detailedInfo.abilities
        }
      case 'abilities':
        return {
          abilities: currentProfile.value.detailedInfo.abilities
        }
      case 'services':
        return {
          services: currentProfile.value.detailedInfo.services,
          specialistName: currentProfile.value.basicInfo.displayName,
          contacts: currentProfile.value.detailedInfo.contacts
        }
      case 'portfolio':
        return {
          portfolio: currentProfile.value.detailedInfo.portfolio,
          specialistName: currentProfile.value.basicInfo.displayName
        }
      case 'experience':
        return {
          experience: currentProfile.value.detailedInfo.experience
        }
      case 'testimonials':
        return {
          testimonials: currentProfile.value.detailedInfo.testimonials
        }
      case 'contacts':
        return {
          contacts: currentProfile.value.detailedInfo.contacts,
          specialistName: currentProfile.value.basicInfo.displayName,
          basicInfo: currentProfile.value.basicInfo
        }
      default:
        return null
    }
  }

  // Helper methods for contact actions
  const initiateContact = (method: 'telegram' | 'email' | 'website' | 'phone' | 'whatsapp'): void => {
    if (!currentProfile.value) return

    const contacts = currentProfile.value.detailedInfo.contacts
    const contact = contacts[method]

    if (!contact) return

    let url = ''
    switch (method) {
      case 'telegram':
        url = contact.startsWith('@') ? `https://t.me/${contact.slice(1)}` : `https://t.me/${contact}`
        break
      case 'email':
        url = `mailto:${contact}?subject=Запрос по услугам от ${currentProfile.value.basicInfo.displayName}`
        break
      case 'website':
        url = contact.startsWith('http') ? contact : `https://${contact}`
        break
      case 'phone':
        url = `tel:${contact}`
        break
      case 'whatsapp':
        const cleanPhone = contact.replace(/\D/g, '')
        url = `https://wa.me/${cleanPhone}?text=Здравствуйте! Интересуют ваши услуги`
        break
    }

    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const shareProfile = async (): Promise<void> => {
    if (!currentProfile.value) return

    const shareData = {
      title: `Профиль специалиста: ${currentProfile.value.basicInfo.displayName}`,
      text: currentProfile.value.basicInfo.superpower,
      url: typeof window !== 'undefined' ? window.location.href : ''
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // Fallback to clipboard
        await copyProfileLink()
      }
    } else {
      await copyProfileLink()
    }
  }

  const copyProfileLink = async (): Promise<void> => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        // You might want to show a toast notification here
      } catch (err) {
        console.error('Failed to copy profile link:', err)
      }
    }
  }

  return {
    // State
    currentProfile,
    isLoading,
    error,
    isModalOpen,

    // Getters
    isProfileLoaded,
    profileSections,
    hasPortfolio,
    hasExperience,
    hasTestimonials,
    averageRating,
    isProfileApproved,
    profileCompletionPercentage,

    // Actions
    loadProfile,
    clearProfile,
    openModal,
    closeModal,
    refreshProfile,
    updateSectionVisibility,
    getSectionData,

    // Helper methods
    initiateContact,
    shareProfile,
    copyProfileLink
  }
})