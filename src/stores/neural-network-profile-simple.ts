import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  NeuralNetworkProfile, 
  PortfolioItem, 
  ServiceItem, 
  ExperienceItem, 
  TestimonialItem,
  PublicLinkItem,
  ValidationResult 
} from '@/types/neural-network-profile-simple'
import { createEmptyProfile, validateStep, FORM_STEPS } from '@/types/neural-network-profile-simple'
import { portfoliosApi } from '@/services/portfoliosApiClient'
import { usePortfolioCatalogStore } from '@/stores/portfolio-catalog'
import type { Skill, Specialization, Service } from '@/types/portfolio'

export const useNeuralNetworkProfileStore = defineStore('neuralNetworkProfileSimple', () => {
  // Основное состояние
  const profile = ref<NeuralNetworkProfile | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  
  // UI состояние
  const currentStep = ref(1)
  const completedSteps = ref<Set<number>>(new Set())
  const isDirty = ref(false)
  
  // API данные (получаем из глобального каталога)
  const catalog = usePortfolioCatalogStore()
  const skills = computed<Skill[]>(() => catalog.skills)
  const specializations = computed<Specialization[]>(() => catalog.specializations)
  const services = computed<Service[]>(() => catalog.services)
  const portfolioDataLoading = computed<boolean>(() => catalog.isLoading)
  
  // Данные для выбора (загружаются из API)
  const availableSpecializations = ref<any[]>([])
  const availableSkills = ref<any[]>([])
  const availableServices = ref<any[]>([])
  const dataLoading = ref(false)

  // Вычисляемые свойства
  const completionPercentage = computed(() => {
    const totalSteps = FORM_STEPS.length
    return Math.round((completedSteps.value.size / totalSteps) * 100)
  })

  const canSubmit = computed(() => {
    const requiredSteps = FORM_STEPS.filter(step => step.required).map(step => step.id)
    return requiredSteps.every(stepId => completedSteps.value.has(stepId))
  })

  const nextIncompleteStep = computed(() => {
    for (const step of FORM_STEPS) {
      if (!completedSteps.value.has(step.id)) {
        return step.id
      }
    }
    return null
  })

  // Действия для работы с профилем
  const initializeProfile = async (userId: string, existingProfile?: NeuralNetworkProfile) => {
    isLoading.value = true
    try {
      // Загружаем данные из API
      await loadPortfolioData()
      
      if (existingProfile) {
        profile.value = existingProfile
        updateCompletedSteps()
      } else {
        // Пытаемся загрузить текущую анкету пользователя с сервера
        try {
          const serverProfile = await portfoliosApi.getMySimplifiedProfile()
          // Если сервер вернул профиль, используем его; иначе создаем пустой
          profile.value = serverProfile
          // Обновляем завершенные шаги на основе валидного профиля
          updateCompletedSteps()
        } catch (e) {
          console.warn('Falling back to empty profile due to API error', e)
          profile.value = createEmptyProfile(userId)
        }
      }
    } catch (error) {
      console.error('Error initializing profile:', error)
      // Загружаем заглушки как fallback
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Загрузка данных из API
  const loadPortfolioData = async () => {
    try {
      // Если не инициализировано — загрузим из каталога
      if (!catalog.isInitialized) {
        await catalog.initialize()
      }
      // Обновляем доступные данные для выбора из каталога
      availableSpecializations.value = catalog.specializations
      availableSkills.value = catalog.skills
      availableServices.value = catalog.services
    } catch (error) {
      console.error('Error ensuring portfolio catalog:', error)
    }
  }

  const updateProfile = (updates: Partial<NeuralNetworkProfile>) => {
    if (profile.value) {
      Object.assign(profile.value, updates)
      profile.value.updatedAt = new Date().toISOString()
      isDirty.value = true
    }
  }

  const saveProfile = async () => {
    if (!profile.value) return
    
    isSaving.value = true
    try {
      // Полное сохранение (пока оставим как заглушку или будущий PUT)
      console.log('Saving profile (full):', profile.value)
      isDirty.value = false
    } catch (error) {
      console.error('Error saving profile:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  // Частичное сохранение текущего шага (отправляем только измененные поля)
  const savePartial = async (partial: Partial<NeuralNetworkProfile>) => {
    isSaving.value = true
    try {
      const updated = await portfoliosApi.patchMyProfile(partial)
      // Обновляем профиль из ответа сервера и пересчитываем завершенные шаги
      profile.value = updated
      updateCompletedSteps()
      isDirty.value = false
    } catch (error) {
      console.error('Error saving partial profile:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  const submitProfile = async () => {
    if (!canSubmit.value) {
      throw new Error('Не все обязательные поля заполнены')
    }
    
    if (profile.value) {
      profile.value.status = 'draft'
      await saveProfile()
    }
  }

  // Действия для работы с шагами
  const setCurrentStep = (stepId: number) => {
    currentStep.value = stepId
  }

  const markStepCompleted = (stepId: number) => {
    completedSteps.value.add(stepId)
  }

  const markStepIncomplete = (stepId: number) => {
    completedSteps.value.delete(stepId)
  }

  const validateCurrentStep = (): ValidationResult => {
    if (!profile.value) {
      return { isValid: false, errors: ['Профиль не инициализирован'] }
    }
    return validateStep(currentStep.value, profile.value)
  }

  const updateCompletedSteps = () => {
    if (!profile.value) return
    
    completedSteps.value.clear()
    FORM_STEPS.forEach(step => {
      const validation = validateStep(step.id, profile.value!)
      if (validation.isValid) {
        completedSteps.value.add(step.id)
      }
    })
  }

  // Действия для работы с портфолио
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    if (!profile.value) return
    
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString()
    }
    
    updateProfile({
      portfolio: [...profile.value.portfolio, newItem]
    })
  }

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    if (!profile.value) return
    
    const updatedPortfolio = profile.value.portfolio.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
    
    updateProfile({ portfolio: updatedPortfolio })
  }

  const removePortfolioItem = (id: string) => {
    if (!profile.value) return
    
    const updatedPortfolio = profile.value.portfolio.filter(item => item.id !== id)
    updateProfile({ portfolio: updatedPortfolio })
  }

  // Действия для работы с услугами
  const addService = (service: Omit<ServiceItem, 'id'>) => {
    if (!profile.value) return
    
    const newService: ServiceItem = {
      ...service,
      id: Date.now().toString()
    }
    
    updateProfile({
      customServices: [...profile.value.customServices, newService]
    })
  }

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    if (!profile.value) return
    
    const updatedServices = profile.value.customServices.map(service =>
      service.id === id ? { ...service, ...updates } : service
    )
    
    updateProfile({ customServices: updatedServices })
  }

  const removeService = (id: string) => {
    if (!profile.value) return
    
    const updatedServices = profile.value.customServices.filter(service => service.id !== id)
    updateProfile({ customServices: updatedServices })
  }

  // Действия для работы с опытом
  const addExperience = (experience: Omit<ExperienceItem, 'id'>) => {
    if (!profile.value) return
    
    const newExperience: ExperienceItem = {
      ...experience,
      id: Date.now().toString()
    }
    
    updateProfile({
      experience: [...profile.value.experience, newExperience]
    })
  }

  const updateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    if (!profile.value) return
    
    const updatedExperience = profile.value.experience.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    )
    
    updateProfile({ experience: updatedExperience })
  }

  const removeExperience = (id: string) => {
    if (!profile.value) return
    
    const updatedExperience = profile.value.experience.filter(exp => exp.id !== id)
    updateProfile({ experience: updatedExperience })
  }

  // Действия для работы с отзывами
  const addTestimonial = (testimonial: Omit<TestimonialItem, 'id'>) => {
    if (!profile.value) return
    
    const newTestimonial: TestimonialItem = {
      ...testimonial,
      id: Date.now().toString()
    }
    
    updateProfile({
      testimonials: [...profile.value.testimonials, newTestimonial]
    })
  }

  const removeTestimonial = (id: string) => {
    if (!profile.value) return
    
    const updatedTestimonials = profile.value.testimonials.filter(testimonial => testimonial.id !== id)
    updateProfile({ testimonials: updatedTestimonials })
  }

  // Действия для работы с публичными ссылками
  const addPublicLink = (link: Omit<PublicLinkItem, 'id'>) => {
    if (!profile.value) return
    
    const newLink: PublicLinkItem = {
      ...link,
      id: Date.now().toString()
    }
    
    updateProfile({
      publicLinks: [...profile.value.publicLinks, newLink]
    })
  }

  const updatePublicLink = (id: string, updates: Partial<PublicLinkItem>) => {
    if (!profile.value) return
    
    const updatedLinks = profile.value.publicLinks.map(link =>
      link.id === id ? { ...link, ...updates } : link
    )
    
    updateProfile({ publicLinks: updatedLinks })
  }

  const removePublicLink = (id: string) => {
    if (!profile.value) return
    
    const updatedLinks = profile.value.publicLinks.filter(link => link.id !== id)
    updateProfile({ publicLinks: updatedLinks })
  }


  return {
    // State
    profile,
    isLoading,
    isSaving,
    currentStep,
    completedSteps,
    isDirty,
    
    // API data state
    skills,
    specializations,
    services,
    portfolioDataLoading,
    availableSpecializations,
    availableSkills,
    availableServices,
    dataLoading,
    
    // Computed
    completionPercentage,
    canSubmit,
    nextIncompleteStep,
    
    // Profile actions
    initializeProfile,
    updateProfile,
    saveProfile,
    savePartial,
    submitProfile,
    
    // API data
    loadPortfolioData,
    
    // Step actions
    setCurrentStep,
    markStepCompleted,
    markStepIncomplete,
    validateCurrentStep,
    updateCompletedSteps,
    
    // Portfolio actions
    addPortfolioItem,
    updatePortfolioItem,
    removePortfolioItem,
    
    // Service actions
    addService,
    updateService,
    removeService,
    
    // Experience actions
    addExperience,
    updateExperience,
    removeExperience,
    
    // Testimonial actions
    addTestimonial,
    removeTestimonial,
    
    // Public links actions
    addPublicLink,
    updatePublicLink,
    removePublicLink,
  }
})
