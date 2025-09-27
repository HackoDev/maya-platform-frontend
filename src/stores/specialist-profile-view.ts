import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ProfileViewData,
  ProfileSection,
} from '@/types/specialist-profile-view'

export const useSpecialistProfileViewStore = defineStore('specialistProfileView', () => {
  // State
  const currentProfile = ref<ProfileViewData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isModalOpen = ref(false)

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

  // Actions
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

    // Actions
    clearProfile,
    openModal,
    closeModal,
    updateSectionVisibility,
    getSectionData,

    // Helper methods
    shareProfile,
    copyProfileLink
  }
})