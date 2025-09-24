import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type {
  NeuralNetworkProfileSchema,
  NeuralNetworkFormState,
  ValidationError
} from '@/types/neural-network-profile'
import { portfoliosApi } from '@/services/portfoliosApiClient'
import type { Skill, Specialization, Service } from '@/types/portfolio'

export const useNeuralNetworkProfileStore = defineStore('neuralNetworkProfile', () => {
  // State
  const currentProfile = ref<NeuralNetworkProfileSchema | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const validationErrors = ref<ValidationError[]>([])

  // Portfolio data from API
  const skills = ref<Skill[]>([])
  const specializations = ref<Specialization[]>([])
  const services = ref<Service[]>([])
  const portfolioDataLoading = ref(false)

  // Form state
  const formState = reactive<NeuralNetworkFormState>({
    // Form data
    specializations: {
      selectedSpecializationIds: [],
      customSpecializations: []
    },
    superpower: '',
    abilities: {
      selectedSkillIds: [],
      customAbilities: []
    },
    portfolio: [],
    services: {
      selectedServiceIds: [],
      serviceOptions: {},
      customServices: []
    },
    experience: [],
    testimonials: {
      photos: []
    },
    contacts: {
      phone: '',
      telegram: undefined,
      whatsapp: undefined,
      instagram: undefined
    },

    // Form state
    currentBlock: 1,
    completedBlocks: new Set<number>(),
    validationErrors: {},
    isDirty: false,
    autoSaveEnabled: true,
    lastAutoSave: undefined
  })

  // Getters
  const getCompletionPercentage = computed(() => {
    const totalBlocks = 8
    const completedCount = formState.completedBlocks.size
    return Math.round((completedCount / totalBlocks) * 100)
  })

  const getNextIncompleteBlock = computed(() => {
    for (let i = 1; i <= 8; i++) {
      if (!formState.completedBlocks.has(i)) {
        return i
      }
    }
    return null
  })

  const canSubmitProfile = computed(() => {
    // Check if all required blocks are completed
    const requiredBlocks = [1, 2, 3, 8] // Specializations, Superpower, Abilities, Contacts
    return requiredBlocks.every(blockId => formState.completedBlocks.has(blockId))
  })

  // Portfolio data loading
  const loadPortfolioData = async () => {
    portfolioDataLoading.value = true
    try {
      const [skillsResponse, specializationsResponse, servicesResponse] = await Promise.all([
        portfoliosApi.getSkills({ limit: 100 }),
        portfoliosApi.getSpecializations({ limit: 100 }),
        portfoliosApi.getServices({ limit: 100 })
      ])
      
      skills.value = skillsResponse.skills
      specializations.value = specializationsResponse.specializations
      services.value = servicesResponse.services
    } catch (error) {
      console.error('Error loading portfolio data:', error)
      // Set empty arrays as fallback
      skills.value = []
      specializations.value = []
      services.value = []
    } finally {
      portfolioDataLoading.value = false
    }
  }

  // Helper functions for form field updates
  const updateSpecializationSelection = (specializationId: number, selected: boolean) => {
    if (selected) {
      if (!formState.specializations.selectedSpecializationIds.includes(specializationId)) {
        formState.specializations.selectedSpecializationIds.push(specializationId)
      }
    } else {
      const index = formState.specializations.selectedSpecializationIds.indexOf(specializationId)
      if (index > -1) {
        formState.specializations.selectedSpecializationIds.splice(index, 1)
      }
    }
    formState.isDirty = true
  }

  const updateSkillSelection = (skillId: number, selected: boolean) => {
    if (selected) {
      if (!formState.abilities.selectedSkillIds.includes(skillId)) {
        formState.abilities.selectedSkillIds.push(skillId)
      }
    } else {
      const index = formState.abilities.selectedSkillIds.indexOf(skillId)
      if (index > -1) {
        formState.abilities.selectedSkillIds.splice(index, 1)
      }
    }
    formState.isDirty = true
  }

  const updateServiceSelection = (serviceId: number, selected: boolean) => {
    if (selected) {
      if (!formState.services.selectedServiceIds.includes(serviceId)) {
        formState.services.selectedServiceIds.push(serviceId)
        // Initialize service options
        formState.services.serviceOptions[serviceId] = {
          selected: true,
          customPrice: undefined,
          customDescription: undefined
        }
      }
    } else {
      const index = formState.services.selectedServiceIds.indexOf(serviceId)
      if (index > -1) {
        formState.services.selectedServiceIds.splice(index, 1)
        // Remove service options
        delete formState.services.serviceOptions[serviceId]
      }
    }
    formState.isDirty = true
  }

  const updateServiceOption = (serviceId: number, option: 'customPrice' | 'customDescription', value: any) => {
    if (formState.services.serviceOptions[serviceId]) {
      formState.services.serviceOptions[serviceId][option] = value
      formState.isDirty = true
    }
  }

  // Actions
  const initializeForm = async (existingProfile?: NeuralNetworkProfileSchema) => {
    // Load portfolio data first
    await loadPortfolioData()
    
    if (existingProfile) {
      currentProfile.value = existingProfile
      // Populate form state from existing profile
      populateFormFromProfile(existingProfile)
    } else {
      // Create a mock profile for demonstration
      createMockProfile()
      resetForm()
    }
  }

  const createMockProfile = () => {
    // Create a mock profile with partial completion and pending status
    currentProfile.value = {
      id: 'mock-profile-id',
      userId: 'current-user-id',
      profileType: 'neural-network',
      version: '1.0',
      status: 'pending', // This will show "На модерации" status
      profileCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        completionPercentage: 65,
        lastModifiedBlock: '3',
        validationErrors: [],
        isDraft: false,
        submissionAttempts: 1
      },
      specializations: {
        title: 'Я специализируюсь на:',
        description: 'Выберите области вашей экспертизы',
        data: {
          selectedSpecializationIds: [1, 2, 6], // Mock selected specializations
          customSpecializations: []
        },
        validation: {
          required: true,
          minSelected: 1,
          maxSelected: 8
        }
      },
      superpower: {
        title: 'Коротко о себе (до 200 символов)',
        description: 'Твоя суперспособность или фишка',
        placeholder: 'Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте.',
        data: {
          text: 'Создаю AI-ассистентов для автоматизации бизнес-процессов'
        },
        validation: {
          required: true,
          minLength: 10,
          maxLength: 200,
          characterCount: true
        }
      },
      abilities: {
        title: 'Что ты умеешь?',
        description: 'Отметь то, что делаешь, чтобы клиенту было понятно',
        data: {
          selectedSkillIds: [1, 2, 7, 8], // Mock selected skills
          customAbilities: []
        },
        validation: {
          required: true,
          minSelected: 1
        }
      },
      portfolio: {
        title: 'Примеры работ / портфолио',
        description: 'Залей ссылки или прикрепи визуалы',
        data: [],
        validation: {
          required: false,
          maxItems: 10
        }
      },
      services: {
        title: 'Твои услуги и цены',
        description: 'Можно выбрать или вписать свои',
        data: {
          selectedServiceIds: [1, 2], // Mock selected services
          serviceOptions: {
            1: { selected: true, customPrice: 15000, customDescription: 'Полная настройка AI-ассистента для вашего бизнеса' },
            2: { selected: true, customPrice: 25000, customDescription: 'Автоматизированная воронка продаж с AI-компонентами' }
          },
          customServices: []
        },
        validation: {
          required: false
        }
      },
      experience: {
        title: 'С кем работал и что делал?',
        description: 'Опиши свой опыт работы с клиентами',
        data: [],
        validation: {
          required: false,
          maxItems: 20
        }
      },
      testimonials: {
        title: 'Отзывы/рекомендации',
        description: 'Загрузите скриншоты отзывов клиентов',
        data: {
          photos: []
        },
        validation: {
          required: false,
          maxPhotos: 20,
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maxFileSize: 5242880 // 5MB
        }
      },
      contacts: {
        title: 'Как тебе можно написать?',
        description: 'Укажите удобные способы связи',
        data: {
          phone: '',
          telegram: undefined,
          whatsapp: undefined,
          instagram: undefined
        },
        validation: {
          required: true,
          atLeastOne: ['phone'],
          telegramFormat: true,
          instagramFormat: true
        }
      }
    }

    // Set up completion status based on mock data
    formState.completedBlocks.add(1) // Specializations completed
    formState.completedBlocks.add(2) // Superpower completed
    formState.completedBlocks.add(3) // Abilities completed
    // Blocks 4-8 are not completed in this mock
  }

  const populateFormFromProfile = (profile: NeuralNetworkProfileSchema) => {
    formState.specializations = profile.specializations.data
    formState.superpower = profile.superpower.data.text
    formState.abilities = profile.abilities.data
    formState.portfolio = profile.portfolio.data
    formState.services = profile.services.data
    formState.experience = profile.experience.data
    formState.testimonials = profile.testimonials.data
    formState.contacts = profile.contacts.data

    // Update completion status
    updateCompletionStatus()
  }

  const updateFormField = (blockId: string, fieldId: string, value: any) => {
    formState.isDirty = true
    
    switch (blockId) {
      case 'specializations':
        if (fieldId === 'customSpecializations') {
          formState.specializations.customSpecializations = value
        } else if (fieldId === 'selectedSpecializationIds') {
          formState.specializations.selectedSpecializationIds = value
        }
        break
      case 'superpower':
        formState.superpower = value
        break
      case 'abilities':
        if (fieldId === 'customAbilities') {
          formState.abilities.customAbilities = value
        } else if (fieldId === 'selectedSkillIds') {
          formState.abilities.selectedSkillIds = value
        }
        break
      case 'portfolio':
        formState.portfolio = value
        break
      case 'services':
        if (fieldId === 'customServices') {
          formState.services.customServices = value
        } else if (fieldId === 'selectedServiceIds') {
          formState.services.selectedServiceIds = value
        } else if (fieldId.startsWith('serviceOptions.')) {
          const serviceId = parseInt(fieldId.substring(15)) // length of 'serviceOptions.'
          if (formState.services.serviceOptions[serviceId]) {
            formState.services.serviceOptions[serviceId] = value
          }
        }
        break
      case 'experience':
        formState.experience = value
        break
      case 'testimonials':
        if (fieldId === 'photos') {
          formState.testimonials.photos = value
        }
        break
      case 'contacts':
        (formState.contacts as any)[fieldId] = value
        break
    }

    // Clear validation errors for this field
    if (formState.validationErrors[blockId]) {
      delete (formState.validationErrors[blockId] as any)[fieldId]
      if (Object.keys(formState.validationErrors[blockId]).length === 0) {
        delete formState.validationErrors[blockId]
      }
    }

    // Auto-save if enabled
    if (formState.autoSaveEnabled) {
      debouncedAutoSave()
    }
  }

  const validateBlock = (blockId: string): ValidationError[] => {
    const errors: ValidationError[] = []
    const blockNum = parseInt(blockId)

    switch (blockNum) {
      case 1: // Specializations
        errors.push(...validateSpecializations())
        break
      case 2: // Superpower
        errors.push(...validateSuperpower())
        break
      case 3: // Abilities
        errors.push(...validateAbilities())
        break
      case 4: // Portfolio - optional
        break
      case 5: // Services - optional
        break
      case 6: // Experience - optional
        break
      case 7: // Testimonials - optional
        break
      case 8: // Contacts
        errors.push(...validateContacts())
        break
    }

    // Update completion status
    if (errors.length === 0) {
      formState.completedBlocks.add(blockNum)
    } else {
      formState.completedBlocks.delete(blockNum)
    }

    return errors
  }

  const validateSpecializations = (): ValidationError[] => {
    const errors: ValidationError[] = []
    const data = formState.specializations
    
    const selectedCount = data.selectedSpecializationIds.length

    if (selectedCount === 0) {
      errors.push({
        blockId: '1',
        fieldId: 'specializations',
        errorMessage: 'Выберите хотя бы одну специализацию',
        errorType: 'required'
      })
    }

    return errors
  }

  const validateSuperpower = (): ValidationError[] => {
    const errors: ValidationError[] = []
    const text = formState.superpower

    if (!text || text.trim().length === 0) {
      errors.push({
        blockId: '2',
        fieldId: 'superpower',
        errorMessage: 'Поле обязательно для заполнения',
        errorType: 'required'
      })
    } else if (text.length < 10) {
      errors.push({
        blockId: '2',
        fieldId: 'superpower',
        errorMessage: 'Минимум 10 символов',
        errorType: 'length'
      })
    } else if (text.length > 200) {
      errors.push({
        blockId: '2',
        fieldId: 'superpower',
        errorMessage: 'Максимум 200 символов',
        errorType: 'length'
      })
    }

    return errors
  }

  const validateAbilities = (): ValidationError[] => {
    const errors: ValidationError[] = []
    const data = formState.abilities
    
    const selectedCount = data.selectedSkillIds.length

    if (selectedCount === 0) {
      errors.push({
        blockId: '3',
        fieldId: 'abilities',
        errorMessage: 'Выберите хотя бы один навык',
        errorType: 'required'
      })
    }

    return errors
  }

  const validateContacts = (): ValidationError[] => {
    const errors: ValidationError[] = []
    const data = formState.contacts

    // Phone is required as primary contact
    const hasPhone = !!data.phone && data.phone.trim().length > 0
    
    if (!hasPhone) {
      errors.push({
        blockId: '8',
        fieldId: 'contacts',
        errorMessage: 'Укажите номер телефона',
        errorType: 'required'
      })
    }
    // Email and website removed from model

    // Validate telegram format
    if (data.telegram && !isValidTelegram(data.telegram)) {
      errors.push({
        blockId: '8',
        fieldId: 'telegram',
        errorMessage: 'Telegram должен начинаться с @',
        errorType: 'format'
      })
    }

    // Validate instagram format
    if (data.instagram && !isValidInstagram(data.instagram)) {
      errors.push({
        blockId: '8',
        fieldId: 'instagram',
        errorMessage: 'Instagram должен быть @username или URL',
        errorType: 'format'
      })
    }

    return errors
  }

  const validateCompleteForm = (): ValidationError[] => {
    const allErrors: ValidationError[] = []
    
    for (let i = 1; i <= 8; i++) {
      const blockErrors = validateBlock(i.toString())
      allErrors.push(...blockErrors)
    }

    validationErrors.value = allErrors
    return allErrors
  }

  const updateCompletionStatus = () => {
    // Validate each block and update completion status
    for (let i = 1; i <= 8; i++) {
      validateBlock(i.toString())
    }
  }

  const resetForm = () => {
    currentProfile.value = null
    formState.specializations = {
      selectedSpecializationIds: [],
      customSpecializations: []
    }
    formState.superpower = ''
    formState.abilities = {
      selectedSkillIds: [],
      customAbilities: []
    }
    formState.portfolio = []
    formState.services = {
      selectedServiceIds: [],
      serviceOptions: {},
      customServices: []
    }
    formState.experience = []
    formState.testimonials = {
      photos: []
    }
    formState.contacts = {
      phone: '',
      telegram: undefined,
      whatsapp: undefined,
      instagram: undefined
    }
    formState.currentBlock = 1
    formState.completedBlocks.clear()
    formState.validationErrors = {}
    formState.isDirty = false
    formState.lastAutoSave = undefined
    validationErrors.value = []
  }

  const getBlockValidationStatus = (blockId: string): boolean => {
    const blockNum = parseInt(blockId)
    return formState.completedBlocks.has(blockNum)
  }

  // Auto-save functionality
  let autoSaveTimeout: number | null = null
  
  const debouncedAutoSave = () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }
    autoSaveTimeout = setTimeout(async () => {
      await saveDraft()
    }, 2000) // Save after 2 seconds of inactivity
  }

  const saveProfile = async (): Promise<void> => {
    isSaving.value = true
    try {
      // TODO: Implement API call to save profile
      console.log('Saving profile...', formState)
      formState.isDirty = false
    } catch (error) {
      console.error('Error saving profile:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  const saveDraft = async (): Promise<void> => {
    if (!formState.isDirty) return
    
    try {
      // TODO: Implement API call to save draft
      console.log('Auto-saving draft...', formState)
      formState.lastAutoSave = new Date().toISOString()
      formState.isDirty = false
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }

  const submitProfile = async (): Promise<void> => {
    const errors = validateCompleteForm()
    if (errors.length > 0) {
      throw new Error('Форма содержит ошибки. Проверьте все обязательные поля.')
    }

    isSaving.value = true
    try {
      // TODO: Implement API call to submit profile for review
      console.log('Submitting profile for review...', formState)
      formState.isDirty = false
    } catch (error) {
      console.error('Error submitting profile:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  // Utility functions

  const isValidTelegram = (telegram: string): boolean => {
    return telegram.startsWith('@') && telegram.length > 1
  }

  const isValidInstagram = (instagram: string): boolean => {
    // Accept @username format or full Instagram URL
    const usernameRegex = /^@[a-zA-Z0-9._]{1,30}$/
    const urlRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/
    return usernameRegex.test(instagram) || urlRegex.test(instagram)
  }

  return {
    // State
    currentProfile,
    formState,
    validationErrors,
    isLoading,
    isSaving,
    
    // Portfolio data
    skills,
    specializations,
    services,
    portfolioDataLoading,

    // Getters
    getCompletionPercentage,
    getNextIncompleteBlock,
    canSubmitProfile,

    // Actions
    initializeForm,
    updateFormField,
    validateBlock,
    validateCompleteForm,
    saveProfile,
    saveDraft,
    submitProfile,
    resetForm,
    getBlockValidationStatus,
    
    // Portfolio data actions
    loadPortfolioData,
    updateSpecializationSelection,
    updateSkillSelection,
    updateServiceSelection,
    updateServiceOption
  }
})