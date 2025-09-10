import type { FAQ, SupportTicket, SupportMessage } from '@/types'

// Mock FAQ data
export const mockFAQData: FAQ[] = [
  {
    id: '1',
    question: 'Как создать аккаунт на платформе?',
    answer: 'Для создания аккаунта нажмите на кнопку "Регистрация" в правом верхнем углу страницы. Заполните все обязательные поля: имя, email и пароль. После отправки формы на ваш email придет письмо с подтверждением. Перейдите по ссылке в письме для активации аккаунта.',
    category: 'general',
    priority: 1,
    isPopular: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    question: 'Как восстановить пароль?',
    answer: 'На странице входа нажмите "Забыли пароль?", введите ваш email и нажмите "Отправить". Проверьте почту (включая папку Спам) и перейдите по ссылке в письме. Следуйте инструкциям для создания нового пароля.',
    category: 'account',
    priority: 2,
    isPopular: true,
    createdAt: '2024-01-16T11:30:00Z',
    updatedAt: '2024-01-16T11:30:00Z',
  },
  {
    id: '3',
    question: 'Почему не загружаются данные на странице?',
    answer: 'Если данные не загружаются, попробуйте: 1) Обновить страницу (Ctrl+F5), 2) Очистить кеш браузера, 3) Проверить интернет-соединение, 4) Попробовать другой браузер. Если проблема сохраняется, обратитесь в техподдержку.',
    category: 'technical',
    priority: 3,
    isPopular: true,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    question: 'Как изменить данные профиля?',
    answer: 'Перейдите в раздел "Профиль" через меню пользователя в правом верхнем углу. Нажмите "Редактировать профиль", внесите необходимые изменения и сохраните. Некоторые изменения могут потребовать подтверждения по email.',
    category: 'account',
    priority: 4,
    isPopular: false,
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
  {
    id: '5',
    question: 'Как настроить уведомления?',
    answer: 'В настройках профиля найдите раздел "Уведомления". Выберите типы уведомлений, которые хотите получать: email, SMS или push-уведомления. Настройте частоту и тематику уведомлений согласно вашим предпочтениям.',
    category: 'general',
    priority: 5,
    isPopular: false,
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
  },
  {
    id: '6',
    question: 'Проблемы с оплатой подписки',
    answer: 'При проблемах с оплатой проверьте: 1) Достаточность средств на карте, 2) Корректность введенных данных карты, 3) Не заблокирована ли карта для онлайн-платежей. Обратитесь к банку или в нашу поддержку для решения проблемы.',
    category: 'billing',
    priority: 6,
    isPopular: true,
    createdAt: '2024-01-20T12:30:00Z',
    updatedAt: '2024-01-20T12:30:00Z',
  },
  {
    id: '7',
    question: 'Как удалить аккаунт?',
    answer: 'Для удаления аккаунта обратитесь в службу поддержки через форму обратной связи. Укажите причину удаления. Обратите внимание: после удаления все данные будут безвозвратно утеряны.',
    category: 'account',
    priority: 7,
    isPopular: false,
    createdAt: '2024-01-21T10:10:00Z',
    updatedAt: '2024-01-21T10:10:00Z',
  },
  {
    id: '8',
    question: 'Как связаться с поддержкой?',
    answer: 'Вы можете связаться с нами несколькими способами: 1) Через форму на этой странице, 2) По email: support@maya-platform.com, 3) По телефону: +7 (495) 123-45-67 (рабочие дни с 9:00 до 18:00). Мы отвечаем в течение 24 часов.',
    category: 'general',
    priority: 8,
    isPopular: true,
    createdAt: '2024-01-22T08:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z',
  },
]

// Mock support tickets data
export const mockSupportTicketsData: SupportTicket[] = [
  {
    id: 'ticket-1',
    message: 'Не могу войти в свой аккаунт, постоянно выдает ошибку "Неверный пароль"',
    status: 'resolved',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
    resolvedAt: '2024-01-21T09:15:00Z',
    assignedTo: 'Анна Смирнова',
    hasUnreadMessages: false,
    messages: [
      {
        id: 'msg-1',
        ticketId: 'ticket-1',
        message: 'Не могу войти в свой аккаунт, постоянно выдает ошибку "Неверный пароль"',
        isFromSupport: false,
        createdAt: '2024-01-20T14:30:00Z',
        author: {
          role: 'user',
        },
      },
      {
        id: 'msg-2',
        ticketId: 'ticket-1',
        message: 'Здравствуйте! Попробуйте сбросить пароль через форму восстановления на странице входа. Если проблема сохранится, сообщите нам.',
        isFromSupport: true,
        createdAt: '2024-01-20T15:45:00Z',
        author: {
          role: 'support',
        },
      },
      {
        id: 'msg-3',
        ticketId: 'ticket-1',
        message: 'Спасибо, получилось! Проблема была в том, что caps lock был включен.',
        isFromSupport: false,
        createdAt: '2024-01-21T09:15:00Z',
        author: {
          role: 'user',
        },
      },
    ],
  },
  {
    id: 'ticket-2',
    message: 'На странице профиля не сохраняются изменения. Нажимаю "Сохранить", но данные остаются старыми.',
    status: 'in-progress',
    createdAt: '2024-01-22T11:20:00Z',
    updatedAt: '2024-01-22T16:30:00Z',
    assignedTo: 'Михаил Козлов',
    hasUnreadMessages: true,
    messages: [
      {
        id: 'msg-4',
        ticketId: 'ticket-2',
        message: 'На странице профиля не сохраняются изменения. Нажимаю "Сохранить", но данные остаются старыми.',
        isFromSupport: false,
        createdAt: '2024-01-22T11:20:00Z',
        author: {
          role: 'user',
        },
      },
      {
        id: 'msg-5',
        ticketId: 'ticket-2',
        message: 'Здравствуйте! Мы получили ваше обращение. Наша техническая команда уже работает над решением этой проблемы. Ожидаемое время решения - 24 часа.',
        isFromSupport: true,
        createdAt: '2024-01-22T16:30:00Z',
        author: {
          role: 'support',
        },
      },
    ],
  },
  {
    id: 'ticket-3',
    message: 'Хотел бы предложить добавить функцию экспорта данных в Excel формате',
    status: 'open',
    createdAt: '2024-01-23T09:45:00Z',
    updatedAt: '2024-01-23T09:45:00Z',
    hasUnreadMessages: false,
    messages: [
      {
        id: 'msg-6',
        ticketId: 'ticket-3',
        message: 'Хотел бы предложить добавить функцию экспорта данных в Excel формате',
        isFromSupport: false,
        createdAt: '2024-01-23T09:45:00Z',
        author: {
          role: 'user',
        },
      },
    ],
  },
  {
    id: 'ticket-4',
    message: 'Получаю ошибку 500 при попытке загрузить файл размером больше 10МБ',
    status: 'resolved',
    createdAt: '2024-01-19T13:15:00Z',
    updatedAt: '2024-01-20T10:20:00Z',
    resolvedAt: '2024-01-20T10:20:00Z',
    assignedTo: 'Елена Сидорова',
    hasUnreadMessages: false,
    messages: [
      {
        id: 'msg-7',
        ticketId: 'ticket-4',
        message: 'Получаю ошибку 500 при попытке загрузить файл размером больше 10МБ',
        isFromSupport: false,
        createdAt: '2024-01-19T13:15:00Z',
        author: {
          role: 'user',
        },
      },
      {
        id: 'msg-8',
        ticketId: 'ticket-4',
        message: 'Проблема была связана с ограничениями сервера. Мы увеличили лимит до 50МБ. Попробуйте загрузить файл еще раз.',
        isFromSupport: true,
        createdAt: '2024-01-20T10:20:00Z',
        author: {
          role: 'support',
        },
      },
    ],
  },
  {
    id: 'ticket-5',
    message: 'Не приходят email уведомления, хотя в настройках они включены',
    status: 'closed',
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-19T11:30:00Z',
    resolvedAt: '2024-01-19T11:30:00Z',
    assignedTo: 'Анна Смирнова',
    hasUnreadMessages: false,
    messages: [
      {
        id: 'msg-9',
        ticketId: 'ticket-5',
        message: 'Не приходят email уведомления, хотя в настройках они включены',
        isFromSupport: false,
        createdAt: '2024-01-18T16:00:00Z',
        author: {
          role: 'user',
        },
      },
      {
        id: 'msg-10',
        ticketId: 'ticket-5',
        message: 'Проверьте папку "Спам" в вашей почте. Также добавьте наш адрес noreply@maya-platform.com в список доверенных отправителей.',
        isFromSupport: true,
        createdAt: '2024-01-19T11:30:00Z',
        author: {
          role: 'support',
        },
      },
    ],
  },
  {
    id: 'ticket-6',
    message: 'Предлагаю добавить темную тему оформления',
    status: 'open',
    createdAt: '2024-01-24T12:00:00Z',
    updatedAt: '2024-01-24T12:00:00Z',
    hasUnreadMessages: false,
    messages: [
      {
        id: 'msg-11',
        ticketId: 'ticket-6',
        message: 'Предлагаю добавить темную тему оформления для более комфортной работы в вечернее время',
        isFromSupport: false,
        createdAt: '2024-01-24T12:00:00Z',
        author: {
          role: 'user',
        },
      },
    ],
  },
]

// Mock API functions
export const mockApiFAQs = async (): Promise<FAQ[]> => {
  await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
  return mockFAQData
}

export const mockApiSupportTickets = async (): Promise<SupportTicket[]> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  return mockSupportTicketsData.slice(0, 5) // Return last 5 tickets
}

export const mockApiSubmitTicket = async (message: string): Promise<SupportTicket> => {
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  const newTicket: SupportTicket = {
    id: `ticket-${Date.now()}`,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasUnreadMessages: false,
    messages: [
      {
        id: `msg-${Date.now()}`,
        ticketId: `ticket-${Date.now()}`,
        message,
        isFromSupport: false,
        createdAt: new Date().toISOString(),
        author: {
          role: 'user',
        },
      },
    ],
  }
  
  // Add to mock data for persistence during session
  mockSupportTicketsData.unshift(newTicket)
  
  return newTicket
}

// Filter FAQs by category
export const getFAQsByCategory = (category?: string): FAQ[] => {
  if (!category) return mockFAQData
  return mockFAQData.filter(faq => faq.category === category)
}

// Search FAQs
export const searchFAQs = (query: string): FAQ[] => {
  if (!query.trim()) return mockFAQData
  
  const searchTerm = query.toLowerCase()
  return mockFAQData.filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm)
  )
}

// Get popular FAQs
export const getPopularFAQs = (): FAQ[] => {
  return mockFAQData.filter(faq => faq.isPopular).sort((a, b) => a.priority - b.priority)
}