import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SpecialistProfileViewData } from '@/types/specialist-profile-view-simple'
import { createTestProfileViewData, createEmptyProfileViewData, createPartialProfileViewData } from '@/utils/testProfileViewData'

export const useSpecialistProfileViewStore = defineStore('specialistProfileView', () => {
  // State
  const currentProfile = ref<SpecialistProfileViewData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isModalOpen = ref(false)

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
    specializations.forEach(id => {
      const name = getSpecializationName(id)
      if (name) {
        result.push(name)
      }
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
    
    // Add predefined skills
    skills.forEach(id => {
      const name = getSkillName(id)
      if (name) {
        result.push(name)
      }
    })
    
    // Add custom skills
    customSkills.forEach(name => {
      result.push(name)
    })
    
    return result
  })

  const displayServices = computed(() => {
    if (!currentProfile.value?.profileData.services) return []
    
    return currentProfile.value.profileData.services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      priceType: service.priceType,
      isCustom: false, // Add required field
      formattedPrice: formatPrice(typeof service.price === 'number' ? service.price : 0, service.priceType)
    }))
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
      tools: item.tools,
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
      tools: exp.tools || [], // Ensure tools is always an array
      duration: exp.duration,
      year: exp.year
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
    const contacts = currentProfile.value?.profileData.customContacts
    return {
      phone: contacts?.phone,
      telegram: contacts?.telegram,
      whatsapp: contacts?.whatsapp,
      email: undefined, // Not in simplified schema
      hasContacts: !!(contacts?.phone || contacts?.telegram || contacts?.whatsapp)
    }
  })

  // Actions
  const loadProfile = async (specialistId: string): Promise<void> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Load test data based on specialist ID
      switch (specialistId) {
        case 'test-1':
        case 'specialist-1':
          currentProfile.value = createTestProfileViewData()
          break
        case 'empty-1':
        case 'specialist-empty':
          currentProfile.value = createEmptyProfileViewData()
          break
        case 'partial-1':
        case 'specialist-partial':
          currentProfile.value = createPartialProfileViewData()
          break
        default:
          // Default to test profile
          currentProfile.value = createTestProfileViewData()
      }
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

  const loadTestData = async (type: 'empty' | 'partial' | 'full'): Promise<void> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      switch (type) {
        case 'empty':
          currentProfile.value = createEmptyProfileViewData()
          break
        case 'partial':
          currentProfile.value = createPartialProfileViewData()
          break
        case 'full':
          currentProfile.value = createTestProfileViewData()
          break
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки тестовых данных'
    } finally {
      isLoading.value = false
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
    loadTestData,
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
