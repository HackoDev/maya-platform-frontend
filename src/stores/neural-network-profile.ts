import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type {
  NeuralNetworkProfileSchema,
  NeuralNetworkFormState,
  ValidationError,
  SpecializationBlock,
  AbilitiesBlock,
  PortfolioCase,
  ServicesBlock,
  ExperienceEntry,
  TestimonialsBlock,
  ContactsBlock
} from '@/types/neural-network-profile'

export const useNeuralNetworkProfileStore = defineStore('neuralNetworkProfile', () => {
  // State
  const currentProfile = ref<NeuralNetworkProfileSchema | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const validationErrors = ref<ValidationError[]>([])

  // Form state
  const formState = reactive<NeuralNetworkFormState>({
    // Form data
    specializations: {
      neuralAssistants: false,
      neuralFunnels: false,
      contentGeneration: false,
      visuals: false,
      audioVideoProcessing: false,
      promptBases: false,
      chatbotSetup: false,
      neuralNetworkTraining: false,
      customSpecializations: []
    },
    superpower: '',
    abilities: {
      funnelAssembly: false,
      personalAIAssistants: false,
      sellingTextsWithGPT: false,
      visualGeneration: false,
      reelsContentAI: false,
      videoProcessing: false,
      funnelAutomation: false,
      promptBases: false,
      trainingConsultations: false,
      customAbilities: []
    },
    portfolio: [],
    services: {
      predefinedServices: {
        neuralAssistantTurnkey: {
          selected: false,
          name: 'Нейроассистент под ключ',
          basePrice: 15000,
          description: 'Полная настройка AI-ассистента для вашего бизнеса'
        },
        neuralSalesFunnel: {
          selected: false,
          name: 'Нейроворонка для продаж',
          basePrice: 25000,
          description: 'Автоматизированная воронка продаж с AI-компонентами'
        },
        promptBase: {
          selected: false,
          name: 'База промптов',
          basePrice: 3000,
          description: 'Коллекция готовых промптов под ваши задачи'
        },
        trainingConsultation: {
          selected: false,
          name: 'Обучение/консультация',
          basePrice: 2000,
          description: 'Персональное обучение работе с нейросетями'
        }
      },
      customServices: []
    },
    experience: [],
    testimonials: {
      textTestimonials: [],
      externalLinks: [],
      files: []
    },
    contacts: {
      telegram: '',
      email: undefined,
      website: undefined,
      phone: undefined,
      whatsapp: undefined,
      discord: undefined,
      linkedin: undefined
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

  // Actions
  const initializeForm = (existingProfile?: NeuralNetworkProfileSchema) => {
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
          neuralAssistants: true,
          neuralFunnels: true,
          contentGeneration: false,
          visuals: false,
          audioVideoProcessing: false,
          promptBases: true,
          chatbotSetup: false,
          neuralNetworkTraining: false,
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
          funnelAssembly: true,
          personalAIAssistants: true,
          sellingTextsWithGPT: false,
          visualGeneration: false,
          reelsContentAI: false,
          videoProcessing: false,
          funnelAutomation: true,
          promptBases: true,
          trainingConsultations: false,
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
          predefinedServices: {
            neuralAssistantTurnkey: {
              selected: false,
              name: 'Нейроассистент под ключ',
              basePrice: 15000,
              description: 'Полная настройка AI-ассистента для вашего бизнеса'
            },
            neuralSalesFunnel: {
              selected: false,
              name: 'Нейроворонка для продаж',
              basePrice: 25000,
              description: 'Автоматизированная воронка продаж с AI-компонентами'
            },
            promptBase: {
              selected: false,
              name: 'База промптов',
              basePrice: 3000,
              description: 'Коллекция готовых промптов под ваши задачи'
            },
            trainingConsultation: {
              selected: false,
              name: 'Обучение/консультация',
              basePrice: 2000,
              description: 'Персональное обучение работе с нейросетями'
            }
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
        description: 'Вы можете прикрепить ссылку на диск, сайт или другой ресурс с файлами',
        data: {
          textTestimonials: [],
          externalLinks: [],
          files: []
        },
        validation: {
          required: false,
          maxTextTestimonials: 10,
          maxExternalLinks: 5,
          maxFiles: 20
        }
      },
      contacts: {
        title: 'Как тебе можно написать?',
        description: 'Укажите удобные способы связи',
        data: {
          telegram: '',
          email: undefined,
          website: undefined,
          phone: undefined,
          whatsapp: undefined,
          discord: undefined,
          linkedin: undefined
        },
        validation: {
          required: true,
          atLeastOne: ['telegram', 'email', 'website'],
          emailFormat: true,
          websiteFormat: true,
          telegramFormat: true
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
        } else {
          ;(formState.specializations as any)[fieldId] = value
        }
        break
      case 'superpower':
        formState.superpower = value
        break
      case 'abilities':
        if (fieldId === 'customAbilities') {
          formState.abilities.customAbilities = value
        } else {
          ;(formState.abilities as any)[fieldId] = value
        }
        break
      case 'portfolio':
        formState.portfolio = value
        break
      case 'services':
        if (fieldId === 'customServices') {
          formState.services.customServices = value
        } else if (fieldId.startsWith('predefinedServices.')) {
          const serviceKey = fieldId.replace('predefinedServices.', '')
          ;(formState.services.predefinedServices as any)[serviceKey] = value
        }
        break
      case 'experience':
        formState.experience = value
        break
      case 'testimonials':
        if (fieldId === 'textTestimonials') {
          formState.testimonials.textTestimonials = value
        } else if (fieldId === 'externalLinks') {
          formState.testimonials.externalLinks = value
        } else if (fieldId === 'files') {
          formState.testimonials.files = value
        }
        break
      case 'contacts':
        ;(formState.contacts as any)[fieldId] = value
        break
    }

    // Clear validation errors for this field
    if (formState.validationErrors[blockId]) {
      delete formState.validationErrors[blockId][fieldId]
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
    
    const selectedCount = Object.values(data).filter(value => 
      typeof value === 'boolean' && value
    ).length

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
    
    const selectedCount = Object.values(data).filter(value => 
      typeof value === 'boolean' && value
    ).length

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

    // At least one contact method required
    const hasAtLeastOne = data.telegram || data.email || data.website
    
    if (!hasAtLeastOne) {
      errors.push({
        blockId: '8',
        fieldId: 'contacts',
        errorMessage: 'Укажите хотя бы один способ связи (Telegram, Email или Сайт)',
        errorType: 'required'
      })
    }

    // Validate email format
    if (data.email && !isValidEmail(data.email)) {
      errors.push({
        blockId: '8',
        fieldId: 'email',
        errorMessage: 'Некорректный формат email',
        errorType: 'format'
      })
    }

    // Validate website format
    if (data.website && !isValidUrl(data.website)) {
      errors.push({
        blockId: '8',
        fieldId: 'website',
        errorMessage: 'Некорректный формат URL',
        errorType: 'format'
      })
    }

    // Validate telegram format
    if (data.telegram && !isValidTelegram(data.telegram)) {
      errors.push({
        blockId: '8',
        fieldId: 'telegram',
        errorMessage: 'Telegram должен начинаться с @',
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
      neuralAssistants: false,
      neuralFunnels: false,
      contentGeneration: false,
      visuals: false,
      audioVideoProcessing: false,
      promptBases: false,
      chatbotSetup: false,
      neuralNetworkTraining: false,
      customSpecializations: []
    }
    formState.superpower = ''
    formState.abilities = {
      funnelAssembly: false,
      personalAIAssistants: false,
      sellingTextsWithGPT: false,
      visualGeneration: false,
      reelsContentAI: false,
      videoProcessing: false,
      funnelAutomation: false,
      promptBases: false,
      trainingConsultations: false,
      customAbilities: []
    }
    formState.portfolio = []
    formState.services.customServices = []
    formState.experience = []
    formState.testimonials = {
      textTestimonials: [],
      externalLinks: [],
      files: []
    }
    formState.contacts = {
      telegram: '',
      email: undefined,
      website: undefined,
      phone: undefined,
      whatsapp: undefined,
      discord: undefined,
      linkedin: undefined
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
  let autoSaveTimeout: NodeJS.Timeout | null = null
  
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
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidTelegram = (telegram: string): boolean => {
    return telegram.startsWith('@') && telegram.length > 1
  }

  return {
    // State
    currentProfile,
    formState,
    validationErrors,
    isLoading,
    isSaving,

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
    getBlockValidationStatus
  }
})