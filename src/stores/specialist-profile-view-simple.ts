import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SpecialistProfileViewData } from '@/types/specialist-profile-view-simple'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'
import { portfoliosApi } from '@/services/portfoliosApiClient'

export const useSpecialistProfileViewStore = defineStore('specialistProfileView', () => {
  // State
  const currentProfile = ref<SpecialistProfileViewData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isModalOpen = ref(false)

  /**
   * Convert API NeuralNetworkProfile to SpecialistProfileViewData
   */
  const convertApiProfileToViewData = (apiProfile: NeuralNetworkProfile): SpecialistProfileViewData => {
    // Формируем имя из данных пользователя
    const displayName = apiProfile.user 
      ? `${apiProfile.user.firstName} ${apiProfile.user.lastName}`.trim()
      : `Специалист ${apiProfile.id}`

    return {
      basicInfo: {
        id: apiProfile.id,
        userId: apiProfile.userId.toString(),
        displayName,
        superpower: apiProfile.superpower || 'Специалист по нейросетям',
        avatarUrl: apiProfile.user?.avatar, // Используем аватар из данных пользователя
        status: 'available',
        isOpenToOffers: apiProfile.user?.isOpenToOffers ?? false,
        generalConsentAccepted: apiProfile.user?.generalConsentAccepted ?? false,
        lastActive: apiProfile.updatedAt || apiProfile.createdAt,
      },
      profileData: apiProfile,
      metadata: {
        profileCompleted: true, // Assume completed if we have data
        completionPercentage: calculateCompletionPercentage(apiProfile),
        moderationStatus: 'approved',
        lastUpdated: apiProfile.updatedAt || apiProfile.createdAt,
        viewCount: 0,
        rating: undefined,
      },
    }
  }

  /**
   * Calculate profile completion percentage
   */
  const calculateCompletionPercentage = (profile: NeuralNetworkProfile): number => {
    let completed = 0
    let total = 0

    // Check each field
    const fields = [
      profile.superpower,
      profile.specializations?.length > 0,
      profile.skills?.length > 0,
      profile.services?.length > 0,
      profile.portfolio?.length > 0,
      profile.experience?.length > 0,
      profile.testimonials?.length > 0,
      profile.customContacts?.phone || profile.customContacts?.telegram || profile.customContacts?.whatsapp,
    ]

    fields.forEach(field => {
      total++
      if (field) completed++
    })

    return Math.round((completed / total) * 100)
  }


  // Computed properties
  const hasPortfolio = computed(() => {
    return currentProfile.value?.profileData.portfolio && currentProfile.value.profileData.portfolio.length > 0
  })

  const hasExperience = computed(() => {
    return currentProfile.value?.profileData.experience && currentProfile.value.profileData.experience.length > 0
  })

  const hasTestimonials = computed(() => {
    return currentProfile.value?.profileData.testimonials && currentProfile.value.profileData.testimonials.length > 0
  })

  const hasServices = computed(() => {
    return currentProfile.value?.profileData.services && currentProfile.value.profileData.services.length > 0
  })

  const hasContacts = computed(() => {
    const contacts = currentProfile.value?.profileData.customContacts
    return !!(contacts?.phone || contacts?.telegram || contacts?.whatsapp)
  })

  const completionPercentage = computed(() => {
    return currentProfile.value?.metadata.completionPercentage || 0
  })

  const isProfileComplete = computed(() => {
    return currentProfile.value?.metadata.profileCompleted || false
  })

  const formattedLastActive = computed(() => {
    if (!currentProfile.value?.basicInfo.lastActive) return 'Неизвестно'
    
    const date = new Date(currentProfile.value.basicInfo.lastActive)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Только что'
    if (diffInHours < 24) return `${diffInHours} ч. назад`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} дн. назад`
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  })

  // Display helpers
  const displaySpecializations = computed(() => {
    if (!currentProfile.value) return []
    
    const { specializations, customSpecializations } = currentProfile.value.profileData
    const result: string[] = []
    
    // Add predefined specializations
    specializations.forEach(item => {
      result.push(item.name)
    })
    
    // Add custom specializations
    customSpecializations.forEach(name => {
      result.push(name)
    })
    
    return result
  })

  const displaySkills = computed(() => {
    if (!currentProfile.value) return []
    
    const { skills, customSkills } = currentProfile.value.profileData
    const result: string[] = []
    console.log('skills', skills)
    console.log('customSkills', customSkills)
    
    // Add predefined skills
    skills.forEach(skill => {
      result.push(skill.name)
    })
    
    // Add custom skills
    customSkills.forEach(name => {
      result.push(name)
    })
    
    return result
  })

  const displayServices = computed(() => {
    if (!currentProfile.value?.profileData) return []
    
    const result: any[] = []
    const profileData = currentProfile.value.profileData
    
    // Add custom services
    if (profileData.customServices) {
      profileData.customServices.forEach(service => {
        result.push({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price || 0,
          priceType: service.priceType || 'fixed',
          isCustom: true,
          formattedPrice: formatPrice(service.price || '0', service.priceType || 'fixed')
        })
      })
    }
    
    // Add services from services array (now contains full service objects)
    if (profileData.services) {
      profileData.services.forEach(service => {
        const serviceId = service.id.toString()
        const serviceOption = profileData.serviceOptions?.[serviceId]
        
        // Use custom price and description from serviceOptions if available
        const price = serviceOption?.customPrice || service.price
        const description = serviceOption?.customDescription || service.description
        
        result.push({
          id: service.id,
          name: service.name,
          description,
          price: price.toString() || 0,
          priceType: service.priceType || 'fixed',
          isCustom: false,
          formattedPrice: formatPrice(price.toString() || '0', service.priceType || 'fixed')
        })
      })
    }
    
    return result
  })

  const displayPortfolio = computed(() => {
    if (!currentProfile.value?.profileData.portfolio) return []
    
    return currentProfile.value.profileData.portfolio.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: (item.type === 'image' ? 'visual' : item.type) as 'text' | 'link' | 'bot' | 'landing' | 'visual',
      content: item.content,
      result: item.result,
      tools: item.tools ? [item.tools] : [], // Convert string to array
      createdAt: new Date().toISOString(), // Add required field
      typeLabel: getPortfolioTypeLabel(item.type),
      typeIcon: getPortfolioTypeIcon(item.type)
    }))
  })

  const displayExperience = computed(() => {
    if (!currentProfile.value?.profileData.experience) return []
    
    return currentProfile.value.profileData.experience.map(exp => ({
      id: exp.id,
      client: exp.client,
      task: exp.task,
      result: exp.result,
      tools: exp.tools ? [exp.tools] : [], // Convert string to array
      duration: exp.duration || '',
      year: exp.year || ''
    }))
  })

  const displayTestimonials = computed(() => {
    if (!currentProfile.value?.profileData.testimonials) {
      return {
        photos: [],
        totalCount: 0
      }
    }
    
    const photos = currentProfile.value.profileData.testimonials.map(testimonial => ({
      id: testimonial.id,
      url: testimonial.url,
      title: testimonial.title
    }))
    
    return {
      photos,
      totalCount: photos.length
    }
  })

  const displayContacts = computed(() => {
    const profileData = currentProfile.value?.profileData
    const userContacts = profileData?.user
    const customContacts = profileData?.customContacts
    
    return {
      phone: customContacts?.phone || userContacts?.phone,
      telegram: customContacts?.telegram || userContacts?.telegram,
      whatsapp: customContacts?.whatsapp || userContacts?.whatsapp,
      email: userContacts?.email, // Теперь доступен из данных пользователя
      hasContacts: !!(customContacts?.phone || customContacts?.telegram || customContacts?.whatsapp || 
                     userContacts?.phone || userContacts?.telegram || userContacts?.whatsapp || userContacts?.email)
    }
  })

  // Actions
  const loadProfile = async (specialistId: string): Promise<void> => {
    isLoading.value = true
    error.value = null
    
    try {
      const apiProfile = await portfoliosApi.getSpecialistById(specialistId)
      currentProfile.value = convertApiProfileToViewData(apiProfile)
      console.log('currentProfile', currentProfile.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки профиля'
    } finally {
      isLoading.value = false
    }
  }

  const clearProfile = (): void => {
    currentProfile.value = null
    error.value = null
  }

  const openModal = (): void => {
    isModalOpen.value = true
  }

  const closeModal = (): void => {
    isModalOpen.value = false
  }

  const shareProfile = (): void => {
    if (navigator.share && currentProfile.value) {
      navigator.share({
        title: `Профиль специалиста: ${currentProfile.value.basicInfo.displayName}`,
        text: currentProfile.value.basicInfo.superpower,
        url: window.location.href
      }).catch(console.error)
    } else {
      // Fallback to copying link
      copyProfileLink()
    }
  }

  const copyProfileLink = (): void => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          // You could show a toast notification here
          console.log('Ссылка скопирована в буфер обмена')
        })
        .catch(console.error)
    }
  }


  const retryLoading = async (): Promise<void> => {
    if (currentProfile.value?.basicInfo.id) {
      await loadProfile(currentProfile.value.basicInfo.id)
    }
  }

  return {
    // State
    currentProfile,
    isLoading,
    error,
    isModalOpen,
    
    // Computed
    hasPortfolio,
    hasExperience,
    hasTestimonials,
    hasServices,
    hasContacts,
    completionPercentage,
    isProfileComplete,
    formattedLastActive,
    displaySpecializations,
    displaySkills,
    displayServices,
    displayPortfolio,
    displayExperience,
    displayTestimonials,
    displayContacts,
    
    // Actions
    loadProfile,
    clearProfile,
    openModal,
    closeModal,
    shareProfile,
    copyProfileLink,
    retryLoading
  }
})

// Helper functions (imported from testProfileViewData)
import { 
  formatPrice, 
  getSpecializationName, 
  getSkillName, 
  getPortfolioTypeLabel, 
  getPortfolioTypeIcon 
} from '@/utils/testProfileViewData'
