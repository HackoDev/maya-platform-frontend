// Neural Network Profile Types
export interface FileReference {
  url: string
  filename: string
  size: number
  mimeType: string
}

export interface ValidationError {
  blockId: string
  fieldId: string
  errorMessage: string
  errorType: 'required' | 'format' | 'length' | 'custom'
}

export interface ProfileMetadata {
  completionPercentage: number
  lastModifiedBlock: string
  validationErrors: ValidationError[]
  isDraft: boolean
  submissionAttempts: number
  moderationNotes?: string[]
}

// Block 1: Specializations
export interface SpecializationBlock {
  title: 'Я специализируюсь на:'
  description: 'Выберите области вашей экспертизы'
  data: {
    selectedSpecializationIds: number[] // IDs of selected specializations from API
    customSpecializations?: string[] // Дополнительные специализации
  }
  validation: {
    required: true
    minSelected: 1
    maxSelected: 8
  }
}

// Block 2: Superpower
export interface SuperpowerBlock {
  title: 'Коротко о себе (до 200 символов)'
  description: 'Твоя суперспособность или фишка'
  placeholder: 'Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте.'
  data: {
    text: string
  }
  validation: {
    required: true
    minLength: 10
    maxLength: 200
    characterCount: true
  }
}

// Block 3: Abilities
export interface AbilitiesBlock {
  title: 'Что ты умеешь?'
  description: 'Отметь то, что делаешь, чтобы клиенту было понятно'
  data: {
    selectedSkillIds: number[] // IDs of selected skills from API
    customAbilities?: string[] // Дополнительные навыки
  }
  validation: {
    required: true
    minSelected: 1
  }
}

// Block 4: Portfolio
export interface PortfolioCase {
  id: string
  title: string // Кейс #1, Кейс #2, etc.
  description: string // Описание кейса
  type: 'text' | 'link' | 'visual' | 'bot' | 'landing'
  content: string | FileReference // Текст, ссылка или файл
  result?: string // Результат работы
  tools?: string[] // Использованные инструменты
  createdAt: string
}

export interface PortfolioBlock {
  title: 'Примеры работ / портфолио'
  description: 'Залей ссылки или прикрепи визуалы'
  data: PortfolioCase[]
  validation: {
    required: false
    maxItems: 10
  }
}

// Block 5: Services and Pricing
export interface ServiceOption {
  selected: boolean
  customPrice?: number
  customDescription?: string
}

export interface CustomService {
  id: string
  name: string
  description: string
  price: number | string // Может быть "по договоренности"
  priceType: 'fixed' | 'hourly' | 'project' | 'negotiable'
}

export interface ServicesBlock {
  title: 'Твои услуги и цены'
  description: 'Можно выбрать или вписать свои'
  data: {
    selectedServiceIds: number[] // IDs of selected services from API
    serviceOptions: Record<number, ServiceOption> // Custom options for selected services
    customServices: CustomService[] // Дополнительные услуги
  }
  validation: {
    required: false
  }
}

// Block 6: Work Experience
export interface ExperienceEntry {
  id: string
  client: string // Клиент
  task: string // Что делал
  tools: string[] // Инструменты
  result: string // Результат
  duration?: string // Длительность проекта
  year?: string // Год выполнения
}

export interface ExperienceBlock {
  title: 'С кем работал и что делал?'
  description: 'Опиши свой опыт работы с клиентами'
  data: ExperienceEntry[]
  validation: {
    required: false
    maxItems: 20
  }
}

// Block 7: Testimonials
export interface TestimonialPhoto {
  id: string
  url: string
  title: string
}

export interface TestimonialsBlock {
  title: 'Отзывы/рекомендации'
  description: 'Загрузите скриншоты отзывов клиентов'
  data: {
    photos: TestimonialPhoto[] // Фотографии отзывов
  }
  validation: {
    required: false
    maxPhotos: 20
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    maxFileSize: 5242880 // 5MB
  }
}

// Block 8: Contacts
export interface ContactsBlock {
  title: 'Как тебе можно написать?'
  description: 'Контактная информация из настроек профиля'
  data: {
    // Contacts are now read-only and pulled from user profile
    useUserContacts: true
    // Optional: allow overriding specific contacts for the profile
    overrideContacts?: {
      phone?: string
      telegram?: string
      whatsapp?: string
      instagram?: string
    }
  }
  validation: {
    required: true
    // Validation now checks if user has at least one contact method
    hasAtLeastOneContact: true
  }
}

// Main Profile Schema
export interface NeuralNetworkProfileSchema {
  id: string
  userId: string
  profileType: 'neural-network'
  version: string
  metadata: ProfileMetadata

  // Block 1: Who are you?
  specializations: SpecializationBlock

  // Block 2: Brief about yourself
  superpower: SuperpowerBlock

  // Block 3: What can you do?
  abilities: AbilitiesBlock

  // Block 4: Portfolio examples
  portfolio: PortfolioBlock

  // Block 5: Services and pricing
  services: ServicesBlock

  // Block 6: Work experience
  experience: ExperienceBlock

  // Block 7: Testimonials
  testimonials: TestimonialsBlock

  // Block 8: Contact information  
  contacts: ContactsBlock

  // System fields
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  profileCompleted: boolean
  createdAt: string
  updatedAt: string
}

// Form State Management
export interface NeuralNetworkFormState {
  // Form data
  specializations: SpecializationBlock['data']
  superpower: string
  abilities: AbilitiesBlock['data']
  portfolio: PortfolioCase[]
  services: ServicesBlock['data']
  experience: ExperienceEntry[]
  testimonials: TestimonialsBlock['data']
  contacts: ContactsBlock['data']

  // Form state
  currentBlock: number
  completedBlocks: Set<number>
  validationErrors: Record<string, string[]>
  isDirty: boolean
  autoSaveEnabled: boolean
  lastAutoSave?: string
}

// API Integration Types
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings?: string[]
}

export interface NeuralNetworkProfileAPI {
  // Profile CRUD operations
  createProfile(data: NeuralNetworkProfileSchema): Promise<import('../types').ApiResponse<string>>
  updateProfile(id: string, data: Partial<NeuralNetworkProfileSchema>): Promise<import('../types').ApiResponse<void>>
  getProfile(id: string): Promise<import('../types').ApiResponse<NeuralNetworkProfileSchema>>
  deleteProfile(id: string): Promise<import('../types').ApiResponse<void>>

  // Draft management
  saveDraft(data: Partial<NeuralNetworkProfileSchema>): Promise<import('../types').ApiResponse<void>>
  loadDraft(userId: string): Promise<import('../types').ApiResponse<Partial<NeuralNetworkProfileSchema>>>

  // File operations
  uploadPortfolioFile(file: File): Promise<import('../types').ApiResponse<FileReference>>
  uploadTestimonialFile(file: File): Promise<import('../types').ApiResponse<FileReference>>
  deleteFile(fileUrl: string): Promise<import('../types').ApiResponse<void>>

  // Validation
  validateProfile(data: NeuralNetworkProfileSchema): Promise<import('../types').ApiResponse<ValidationResult>>

  // Submission
  submitForReview(id: string): Promise<import('../types').ApiResponse<void>>
}

// Store Interface
export interface NeuralNetworkProfileStore {
  // State
  currentProfile: NeuralNetworkProfileSchema | null
  formState: NeuralNetworkFormState
  validationErrors: ValidationError[]
  isLoading: boolean
  isSaving: boolean

  // Actions
  initializeForm(existingProfile?: NeuralNetworkProfileSchema): void
  updateFormField(blockId: string, fieldId: string, value: any): void
  validateBlock(blockId: string): ValidationError[]
  validateCompleteForm(): ValidationError[]
  saveProfile(): Promise<void>
  saveDraft(): Promise<void>
  submitProfile(): Promise<void>
  resetForm(): void

  // Getters
  getCompletionPercentage(): number
  getNextIncompleteBlock(): number | null
  getBlockValidationStatus(blockId: string): boolean
  canSubmitProfile(): boolean
}