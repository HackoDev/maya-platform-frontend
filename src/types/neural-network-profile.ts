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
    neuralAssistants: boolean // Нейроассистенты (AI-боты)
    neuralFunnels: boolean // Нейроворонки (продажи + автоматизация)
    contentGeneration: boolean // Контент с помощью нейросетей
    visuals: boolean // Визуалы (обложки, графика, Reels)
    audioVideoProcessing: boolean // Обработка аудио и видео
    promptBases: boolean // Базы промптов
    chatbotSetup: boolean // Настройка чат-ботов
    neuralNetworkTraining: boolean // Обучение других нейросетям
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
    funnelAssembly: boolean // Собираю нейроворонки (от лида до оплаты)
    personalAIAssistants: boolean // Создаю персональных AI-ассистентов
    sellingTextsWithGPT: boolean // Пишу продающие тексты с ChatGPT
    visualGeneration: boolean // Генерирую визуалы в Midjourney/DALLE
    reelsContentAI: boolean // Настраиваю Reels-контент с помощью AI
    videoProcessing: boolean // Обрабатываю видео в нейросетях
    funnelAutomation: boolean // Автоматизирую воронки с GPT + Tilda/Telegram
    promptBases: boolean // Делаю базы промптов под задачи клиента
    trainingConsultations: boolean // Провожу обучение/консультации
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
  name: string
  basePrice: number
  customPrice?: number
  description?: string
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
    predefinedServices: {
      neuralAssistantTurnkey: ServiceOption // Нейроассистент под ключ — от 15 000 руб
      neuralSalesFunnel: ServiceOption // Нейроворонка для продаж — от 25 000 руб
      promptBase: ServiceOption // База промптов — от 3 000 руб
      trainingConsultation: ServiceOption // Обучение/консультация — от 2 000 руб
    }
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
export interface TestimonialEntry {
  id: string
  clientName: string
  clientPosition?: string
  testimonialText: string
  rating?: number
  projectType?: string
  date?: string
}

export interface TestimonialsBlock {
  title: 'Отзывы/рекомендации'
  description: 'Вы можете прикрепить ссылку на диск, сайт или другой ресурс с файлами'
  data: {
    textTestimonials: TestimonialEntry[] // Текстовые отзывы
    externalLinks: string[] // Ссылки на внешние ресурсы
    files: FileReference[] // Прикрепленные файлы
  }
  validation: {
    required: false
    maxTextTestimonials: 10
    maxExternalLinks: 5
    maxFiles: 20
  }
}

// Block 8: Contacts
export interface ContactsBlock {
  title: 'Как тебе можно написать?'
  description: 'Укажите удобные способы связи'
  data: {
    telegram: string // Telegram: @username
    email?: string // Почта
    website?: string // Сайт
    phone?: string // Телефон (опционально)
    whatsapp?: string // WhatsApp (опционально)
    discord?: string // Discord (опционально)
    linkedin?: string // LinkedIn (опционально)
  }
  validation: {
    required: true
    atLeastOne: ['telegram', 'email', 'website']
    emailFormat: true
    websiteFormat: true
    telegramFormat: true
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