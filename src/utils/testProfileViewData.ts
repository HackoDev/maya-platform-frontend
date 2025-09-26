import type { SpecialistProfileViewData } from '@/types/specialist-profile-view-simple'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

// Mock data for specializations and skills
const MOCK_SPECIALIZATIONS = [
  { id: 1, name: 'Искусственный интеллект' },
  { id: 2, name: 'ChatGPT' },
  { id: 3, name: 'Midjourney' },
  { id: 4, name: 'DALL-E' },
  { id: 5, name: 'Stable Diffusion' },
  { id: 6, name: 'Claude' },
  { id: 7, name: 'Gemini' },
  { id: 8, name: 'Perplexity' }
]

const MOCK_SKILLS = [
  { id: 1, name: 'ChatGPT', tools: ['OpenAI API', 'GPT-4', 'GPT-3.5'] },
  { id: 2, name: 'Midjourney', tools: ['Discord', 'Midjourney API', 'Prompt Engineering'] },
  { id: 3, name: 'DALL-E', tools: ['OpenAI API', 'DALL-E 3', 'Image Generation'] },
  { id: 4, name: 'Stable Diffusion', tools: ['Automatic1111', 'ComfyUI', 'ControlNet'] },
  { id: 5, name: 'Claude', tools: ['Anthropic API', 'Claude 3', 'Context Management'] },
  { id: 6, name: 'Gemini', tools: ['Google AI API', 'Gemini Pro', 'Multimodal AI'] }
]

export const createTestProfileViewData = (): SpecialistProfileViewData => {
  const profileData: NeuralNetworkProfile = {
    id: 'test-profile-1',
    userId: 'user-123',
    status: 'approved',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    
    // Специализации
    specializations: [1, 3, 5], // AI, ChatGPT, Midjourney
    customSpecializations: ['Нейроассистенты для бизнеса', 'Автоматизация с помощью ИИ'],
    
    // Суперспособность
    superpower: 'Создаю нейроассистентов, которые увеличивают конверсию клиентов на 40% и автоматизируют 80% рутинных задач. Специализируюсь на интеграции ChatGPT с бизнес-процессами.',
    
    // Навыки
    skills: [1, 2, 4, 6], // ChatGPT, Midjourney, DALL-E, Stable Diffusion
    customSkills: ['Интеграция с Telegram Bot API', 'Настройка webhook-ов'],
    
    // Портфолио
    portfolio: [
      {
        id: 'portfolio-1',
        title: 'Нейроассистент для стоматологии',
        description: 'Создал чат-бота для записи пациентов с интеграцией в CRM систему',
        type: 'bot',
        content: 'https://t.me/dentist_assistant_bot',
        result: 'Увеличили количество записей на 40%, автоматизировали 80% обращений',
        tools: ['ChatGPT', 'Telegram Bot API', 'Make.com', 'AmoCRM']
      },
      {
        id: 'portfolio-2',
        title: 'Генератор контента для соцсетей',
        description: 'Система автоматического создания постов с изображениями',
        type: 'text',
        content: 'Создал систему, которая генерирует 50 постов в день с уникальными изображениями. Интеграция с Instagram API для автоматической публикации.',
        result: 'Сэкономили 20 часов в неделю на создании контента',
        tools: ['ChatGPT', 'Midjourney', 'Instagram API', 'Python']
      },
      {
        id: 'portfolio-3',
        title: 'Лендинг с нейроассистентом',
        description: 'Сайт с встроенным чат-ботом для консультаций',
        type: 'landing',
        content: 'https://ai-consulting.tilda.ws',
        result: 'Конверсия увеличилась с 2% до 8%',
        tools: ['Tilda', 'ChatGPT', 'JavaScript', 'Webhook']
      }
    ],
    
    // Услуги
    services: [
      {
        id: 'service-1',
        name: 'Создание нейроассистента',
        description: 'Разработаю чат-бота на базе ChatGPT для вашего бизнеса',
        price: 50000,
        priceType: 'fixed'
      },
      {
        id: 'service-2',
        name: 'Интеграция с CRM',
        description: 'Подключу нейроассистента к вашей CRM системе',
        price: 25000,
        priceType: 'fixed'
      },
      {
        id: 'service-3',
        name: 'Консультация по ИИ',
        description: 'Помогу внедрить ИИ в ваши бизнес-процессы',
        price: 5000,
        priceType: 'hourly'
      }
    ],
    
    // Опыт работы
    experience: [
      {
        id: 'exp-1',
        client: 'ООО "Стоматология Плюс"',
        task: 'Создание нейроассистента для записи пациентов и консультаций',
        result: 'Увеличили количество записей на 40%, автоматизировали 80% обращений, сэкономили 15 часов в неделю',
        tools: ['ChatGPT', 'Telegram Bot API', 'Make.com'],
        duration: '2 недели',
        year: '2024'
      },
      {
        id: 'exp-2',
        client: 'ИП Иванов (интернет-магазин)',
        task: 'Разработка системы генерации описаний товаров с помощью ИИ',
        result: 'Автоматизировали создание описаний для 1000+ товаров, увеличили конверсию на 25%',
        tools: ['ChatGPT', 'OpenAI API', 'Python', 'WooCommerce'],
        duration: '1 месяц',
        year: '2024'
      },
      {
        id: 'exp-3',
        client: 'Агентство "Маркетинг Про"',
        task: 'Создание нейроассистента для генерации контента в соцсетях',
        result: 'Создали систему, которая генерирует 50 постов в день, сэкономили 20 часов в неделю',
        tools: ['ChatGPT', 'Midjourney', 'Instagram API', 'Python'],
        duration: '3 недели',
        year: '2023'
      }
    ],
    
    // Отзывы
    testimonials: [
      {
        id: 'testimonial-1',
        url: 'http://localhost:3000/media/avatars/6_sqbpiz1.png',
        title: 'Отзыв от стоматологии'
      },
      {
        id: 'testimonial-2',
        url: 'http://localhost:3000/media/avatars/6_sqbpiz1.png',
        title: 'Отзыв от интернет-магазина'
      },
      {
        id: 'testimonial-3',
        url: 'http://localhost:3000/media/avatars/6_sqbpiz1.png',
        title: 'Отзыв от агентства'
      }
    ],
    
    // Контакты
    customContacts: {
      phone: '+7 (999) 123-45-67',
      telegram: '@ai_specialist',
      whatsapp: '+7 (999) 123-45-67'
    }
  }

  return {
    basicInfo: {
      id: 'specialist-1',
      userId: 'user-123',
      displayName: 'Алексей Петров',
      superpower: profileData.superpower,
      avatarUrl: 'http://localhost:3000/media/avatars/6_sqbpiz1.png',
      status: 'available',
      isOpenToOffers: true,
      lastActive: '2024-01-20T15:30:00Z'
    },
    profileData,
    metadata: {
      profileCompleted: true,
      completionPercentage: 95,
      moderationStatus: 'approved',
      lastUpdated: '2024-01-20T15:30:00Z',
      viewCount: 1247,
      rating: 4.8
    }
  }
}

export const createEmptyProfileViewData = (): SpecialistProfileViewData => {
  const profileData: NeuralNetworkProfile = {
    id: 'empty-profile-1',
    userId: 'user-456',
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
  }

  return {
    basicInfo: {
      id: 'specialist-empty',
      userId: 'user-456',
      displayName: 'Новый специалист',
      superpower: '',
      status: 'unavailable',
      isOpenToOffers: false,
      lastActive: new Date().toISOString()
    },
    profileData,
    metadata: {
      profileCompleted: false,
      completionPercentage: 15,
      moderationStatus: 'draft',
      lastUpdated: new Date().toISOString(),
      viewCount: 0,
      rating: 0
    }
  }
}

export const createPartialProfileViewData = (): SpecialistProfileViewData => {
  const profileData: NeuralNetworkProfile = {
    id: 'partial-profile-1',
    userId: 'user-789',
    status: 'pending',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    
    // Частично заполненные данные
    specializations: [1, 2], // AI, ChatGPT
    customSpecializations: ['Нейроассистенты'],
    superpower: 'Создаю нейроассистентов для бизнеса',
    skills: [1, 2], // ChatGPT, Midjourney
    customSkills: [],
    
    // Пустые секции
    portfolio: [],
    services: [],
    experience: [],
    testimonials: []
  }

  return {
    basicInfo: {
      id: 'specialist-partial',
      userId: 'user-789',
      displayName: 'Мария Сидорова',
      superpower: profileData.superpower,
      avatarUrl: 'https://via.placeholder.com/150x150/059669/FFFFFF?text=МС',
      status: 'busy',
      isOpenToOffers: true,
      lastActive: '2024-01-18T12:00:00Z'
    },
    profileData,
    metadata: {
      profileCompleted: false,
      completionPercentage: 45,
      moderationStatus: 'pending',
      lastUpdated: '2024-01-18T12:00:00Z',
      viewCount: 23,
      rating: 4.2
    }
  }
}

// Helper functions for display formatting
export const formatPrice = (price: string, priceType: string): string => {
  switch (priceType) {
    case 'fixed':
      return `${price} ₽`
    case 'hourly':
      return `${price} ₽/час`
    case 'project':
      return `${price} ₽/проект`
    case 'negotiable':
      return 'По договоренности'
    default:
      return `${price} ₽`
  }
}

export const getSpecializationName = (id: number): string => {
  const spec = MOCK_SPECIALIZATIONS.find(s => s.id === id)
  return spec ? spec.name : `Специализация ${id}`
}

export const getSkillName = (id: number): string => {
  const skill = MOCK_SKILLS.find(s => s.id === id)
  return skill ? skill.name : `Навык ${id}`
}

export const getSkillTools = (id: number): string[] => {
  const skill = MOCK_SKILLS.find(s => s.id === id)
  return skill ? skill.tools : []
}

export const getPortfolioTypeLabel = (type: string): string => {
  switch (type) {
    case 'text': return 'Текстовое описание'
    case 'link': return 'Ссылка на проект'
    case 'image': return 'Изображение/Скриншот'
    case 'bot': return 'Ссылка на бота'
    case 'landing': return 'Ссылка на лендинг'
    default: return 'Контент'
  }
}

export const getPortfolioTypeIcon = (type: string): string => {
  switch (type) {
    case 'text': return '📝'
    case 'link': return '🔗'
    case 'image': return '🖼️'
    case 'bot': return '🤖'
    case 'landing': return '🌐'
    default: return '📄'
  }
}
