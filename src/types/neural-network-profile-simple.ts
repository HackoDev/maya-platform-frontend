import type { ServiceOption } from "./neural-network-profile"

// Упрощенные типы для профиля нейросетевого специалиста
export interface NeuralNetworkProfile {
  id: string
  userId: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  
  // Основные данные профиля
  specializations: number[] // ID специализаций
  customSpecializations: string[] // Дополнительные специализации
  superpower: string // Описание суперспособности
  
  skills: number[] // ID навыков
  customSkills: string[] // Дополнительные навыки
  
  portfolio: PortfolioItem[]
  services: ServiceItem[]
  serviceOptions: Record<string, ServiceOption>
  experience: ExperienceItem[]
  testimonials: TestimonialItem[]
  
  // Контакты (опционально, если отличается от пользователя)
  customContacts?: {
    phone?: string
    telegram?: string
    whatsapp?: string
  }
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  type: 'text' | 'link' | 'image' | 'bot' | 'landing'
  content: string // URL или текст
  result?: string
  tools?: string[]
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  price: string
  priceType: 'fixed' | 'hourly' | 'project' | 'negotiable'
}

export interface ExperienceItem {
  id: string
  client: string
  task: string
  result: string
  tools?: string[]
  year?: string
  duration?: string
}

export interface TestimonialItem {
  id: string
  url: string
  title: string
}

// Типы для UI состояния
export interface FormStep {
  id: number
  title: string
  required: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Константы для шагов анкеты
export const FORM_STEPS: FormStep[] = [
  { id: 1, title: 'Кто ты?', required: true },
  { id: 2, title: 'О себе', required: true },
  { id: 3, title: 'Навыки', required: true },
  { id: 4, title: 'Портфолио', required: false },
  { id: 5, title: 'Услуги', required: false },
  { id: 6, title: 'Опыт', required: false },
  { id: 7, title: 'Отзывы', required: false },
  { id: 8, title: 'Контакты', required: true }
]

// Функции валидации для каждого шага
export const validateStep = (stepId: number, profile: NeuralNetworkProfile): ValidationResult => {
  const errors: string[] = []
  
  switch (stepId) {
    case 1: // Специализации
      const totalSpecializations = profile.specializations.length + profile.customSpecializations.length
      if (totalSpecializations === 0) {
        errors.push('Выберите хотя бы одну специализацию')
      }
      break
      
    case 2: // Суперспособность
      if (!profile.superpower || profile.superpower.trim().length < 10) {
        errors.push('Минимум 10 символов')
      }
      if (profile.superpower.length > 200) {
        errors.push('Максимум 200 символов')
      }
      break
      
    case 3: // Навыки
      const totalSkills = profile.skills.length + profile.customSkills.length
      if (totalSkills === 0) {
        errors.push('Выберите хотя бы один навык')
      }
      break
      
    case 8: // Контакты
      // Проверяем, есть ли хотя бы один контакт у пользователя
      // Это будет проверяться в компоненте ContactsStep
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Функция для создания пустого профиля
export const createEmptyProfile = (userId: string): NeuralNetworkProfile => ({
  id: '',
  userId,
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  specializations: [],
  customSpecializations: [],
  superpower: '',
  skills: [],
  customSkills: [],
  portfolio: [],
  services: [],
  experience: [],
  testimonials: []
})
