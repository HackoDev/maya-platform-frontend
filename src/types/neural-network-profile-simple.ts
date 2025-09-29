import type { ServiceOption } from "./neural-network-profile"
import type { Skill, Specialization } from "./portfolio"

// Упрощенные типы для профиля нейросетевого специалиста
export interface NeuralNetworkProfile {
  id: string
  userId: string
  status: 'draft' | 'published' | 'archived' | null
  createdAt: string
  updatedAt: string
  readyForReview?: boolean
  
  // Данные пользователя
  user?: {
    id: number
    email: string
    firstName: string
    lastName: string
    avatar?: string
    phone?: string
    telegram?: string
    whatsapp?: string
    isOpenToOffers?: boolean
    generalConsentAccepted?: boolean
  }
  
  // Основные данные профиля
  specializations: Specialization[] // ID специализаций
  customSpecializations: string[] // Дополнительные специализации
  superpower: string // Описание суперспособности
  publicLinks: PublicLinkItem[] // Публичные ссылки на сервисы, сайты и т.п.
  
  skills: Skill[] // ID навыков
  customSkills: string[] // Дополнительные навыки
  
  portfolio: PortfolioItem[]
  services: ServiceItem[] // Полные данные услуг (может быть массивом ID или объектов)
  customServices: ServiceItem[] // Дополнительные услуги
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
  tools?: string
}

export interface ServiceItem {
  id: string | number
  name: string
  description: string
  price: string
  priceType?: 'fixed' | 'hourly' | 'project' | 'negotiable' // Опционально, так как может отсутствовать в данных с сервера
}

export interface ExperienceItem {
  id: string
  client: string
  task: string
  result: string
  tools?: string
  year?: string
  duration?: string
}

export interface TestimonialItem {
  id: string
  url: string
  title: string
}

export interface PublicLinkItem {
  id: string
  title: string
  url: string
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
  { id: 4, title: 'Портфолио', required: true },
  { id: 5, title: 'Услуги', required: true },
  { id: 6, title: 'Опыт', required: true },
  { id: 7, title: 'Отзывы', required: true },
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
    
    case 4: // Портфолио
      const totalPortfolio = profile.portfolio.length
      if (totalPortfolio === 0) {
        errors.push('Добавьте хотя бы один проект')
      }
      break
    
    case 5: // Услуги
      const totalServices = profile.services.length + profile.customServices.length
      if (totalServices === 0) {
        errors.push('Добавьте хотя бы одну услугу')
      }
      break
    
    case 6: // Опыт
      const totalExperience = profile.experience.length
      if (totalExperience === 0) {
        errors.push('Добавьте хотя бы один опыт')
      }
      break
    
    case 7: // Отзывы
      const totalTestimonials = profile.testimonials.length
      if (totalTestimonials === 0) {
        errors.push('Добавьте хотя бы один отзыв')
      }
      break
      
    case 8: // Контакты
      // Проверяем, есть ли хотя бы один контакт у пользователя
      // Это будет проверяться в компоненте ContactsStep
      const totalContacts = [
        profile.customContacts?.phone,
        profile.customContacts?.telegram,
        profile.customContacts?.whatsapp,
      ].filter(Boolean).length;
      if (totalContacts === 0) {
        errors.push('Укажите хотя бы один способ связи')
      }
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
  status: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  readyForReview: false,
  specializations: [],
  customSpecializations: [],
  superpower: '',
  publicLinks: [],
  skills: [],
  customSkills: [],
  portfolio: [],
  services: [],
  customServices: [],
  serviceOptions: {},
  experience: [],
  testimonials: [],
  customContacts: undefined
})
