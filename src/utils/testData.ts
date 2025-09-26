import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

export const createTestProfile = (): NeuralNetworkProfile => {
  return {
    id: 'test-profile-1',
    userId: 'user-123',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Специализации
    specializations: [1, 3, 5], // AI, ChatGPT, Midjourney
    customSpecializations: ['Нейроассистенты для бизнеса', 'Автоматизация с помощью ИИ'],
    
    // Суперспособность
    superpower: 'Создаю нейроассистентов, которые увеличивают конверсию клиентов на 40% и автоматизируют 80% рутинных задач. Специализируюсь на интеграции ChatGPT с бизнес-процессами.',
    
    // Публичные ссылки
    publicLinks: [
      {
        id: 'link-1',
        title: 'Мой сайт',
        url: 'https://ai-specialist.ru'
      },
      {
        id: 'link-2',
        title: 'Telegram канал',
        url: 'https://t.me/ai_insights'
      },
      {
        id: 'link-3',
        title: 'GitHub',
        url: 'https://github.com/ai-specialist'
      },
      {
        id: 'link-4',
        title: 'LinkedIn',
        url: 'https://linkedin.com/in/ai-specialist'
      }
    ],
    
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
        tools: 'ChatGPT, Telegram Bot API, Make.com, AmoCRM'
      },
      {
        id: 'portfolio-2',
        title: 'Генератор контента для соцсетей',
        description: 'Система автоматического создания постов с изображениями',
        type: 'text',
        content: 'Создал систему, которая генерирует 50 постов в день с уникальными изображениями. Интеграция с Instagram API для автоматической публикации.',
        result: 'Сэкономили 20 часов в неделю на создании контента',
        tools: 'ChatGPT, Midjourney, Instagram API, Python'
      },
      {
        id: 'portfolio-3',
        title: 'Лендинг с нейроассистентом',
        description: 'Сайт с встроенным чат-ботом для консультаций',
        type: 'landing',
        content: 'https://ai-consulting.tilda.ws',
        result: 'Конверсия увеличилась с 2% до 8%',
        tools: 'Tilda, ChatGPT, JavaScript, Webhook'
      }
    ],
    
    // Услуги
    services: [],
    customServices: [
      {
        id: 'service-1',
        name: 'Создание нейроассистента',
        description: 'Разработаю чат-бота на базе ChatGPT для вашего бизнеса',
        price: '50000',
        priceType: 'fixed'
      },
      {
        id: 'service-2',
        name: 'Интеграция с CRM',
        description: 'Подключу нейроассистента к вашей CRM системе',
        price: '25000',
        priceType: 'fixed'
      },
      {
        id: 'service-3',
        name: 'Консультация по ИИ',
        description: 'Помогу внедрить ИИ в ваши бизнес-процессы',
        price: '5000',
        priceType: 'hourly'
      }
    ],
    serviceOptions: {},
    
    // Опыт работы
    experience: [
      {
        id: 'exp-1',
        client: 'ООО "Стоматология Плюс"',
        task: 'Создание нейроассистента для записи пациентов и консультаций',
        result: 'Увеличили количество записей на 40%, автоматизировали 80% обращений, сэкономили 15 часов в неделю',
        tools: 'ChatGPT, Telegram Bot API, Make.com',
        duration: '2 недели',
        year: '2024'
      },
      {
        id: 'exp-2',
        client: 'ИП Иванов (интернет-магазин)',
        task: 'Разработка системы генерации описаний товаров с помощью ИИ',
        result: 'Автоматизировали создание описаний для 1000+ товаров, увеличили конверсию на 25%',
        tools: 'ChatGPT, OpenAI API, Python, WooCommerce',
        duration: '1 месяц',
        year: '2024'
      },
      {
        id: 'exp-3',
        client: 'Агентство "Маркетинг Про"',
        task: 'Создание нейроассистента для генерации контента в соцсетях',
        result: 'Создали систему, которая генерирует 50 постов в день, сэкономили 20 часов в неделю',
        tools: 'ChatGPT, Midjourney, Instagram API, Python',
        duration: '3 недели',
        year: '2023'
      }
    ],
    
    // Отзывы
    testimonials: [
      {
        id: 'testimonial-1',
        url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Отзыв+1',
        title: 'Отзыв от стоматологии'
      },
      {
        id: 'testimonial-2',
        url: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Отзыв+2',
        title: 'Отзыв от интернет-магазина'
      },
      {
        id: 'testimonial-3',
        url: 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Отзыв+3',
        title: 'Отзыв от агентства'
      }
    ],
    
    // Контакты (будут загружены из профиля пользователя)
    customContacts: {
      phone: '+7 (999) 123-45-67',
      telegram: '@ai_specialist',
      whatsapp: '+7 (999) 123-45-67'
    }
  }
}

export const createEmptyProfile = (): NeuralNetworkProfile => {
  return {
    id: '',
    userId: '',
    status: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
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
  }
}

export const createPartialProfile = (): NeuralNetworkProfile => {
  return {
    id: 'partial-profile-1',
    userId: 'user-456',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Частично заполненные данные
    specializations: [1, 2], // AI, ChatGPT
    customSpecializations: ['Нейроассистенты'],
    superpower: 'Создаю нейроассистентов для бизнеса',
    publicLinks: [
      {
        id: 'link-1',
        title: 'Мой сайт',
        url: 'https://example.com'
      }
    ],
    skills: [1, 2], // ChatGPT, Midjourney
    customSkills: [],
    
    // Пустые секции
    portfolio: [],
    services: [],
    customServices: [],
    serviceOptions: {},
    experience: [],
    testimonials: []
  }
}

export const createArchivedProfile = (): NeuralNetworkProfile => {
  return {
    id: 'archived-profile-1',
    userId: 'user-789',
    status: 'archived',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Заполненные данные
    specializations: [1, 3, 5],
    customSpecializations: ['Старые технологии'],
    superpower: 'Работал с устаревшими системами',
    publicLinks: [],
    skills: [1, 2, 3],
    customSkills: ['Legacy системы'],
    
    // Пустые секции
    portfolio: [],
    services: [],
    customServices: [],
    serviceOptions: {},
    experience: [],
    testimonials: []
  }
}
