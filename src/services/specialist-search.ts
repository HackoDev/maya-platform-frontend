import type {
  SpecialistProfile,
  SkillOption,
  SearchFilters,
  SearchResults,
} from '@/types/specialist-search'

export class SpecialistSearchService {
  private fakeSpecialists: SpecialistProfile[] = [
    // First batch of specialists (page 1)
    {
      id: 'specialist-1',
      userId: 'user-1',
      displayName: 'Анна Иванова',
      superpower: 'Создаю AI-ассистентов для автоматизации бизнес-процессов и увеличения продаж',
      avatarUrl: undefined,
      specializations: ['Нейроассистенты (AI-боты)', 'Нейроворонки (продажи + автоматизация)'],
      abilities: ['Собираю нейроворонки (от лида до оплаты)', 'Создаю персональных AI-ассистентов'],
      services: [
        {
          name: 'Нейроассистент под ключ',
          price: 15000,
          priceType: 'fixed',
        },
        {
          name: 'Консультация по AI',
          price: 2000,
          priceType: 'hourly',
        },
      ],
      contacts: {
        telegram: '@anna_ai_expert',
        email: 'anna@example.com',
      },
      status: 'available',
      lastActive: '2024-01-15T10:30:00Z',
    },
    {
      id: 'specialist-2',
      userId: 'user-2',
      displayName: 'Максим Петров',
      superpower: 'Генерирую визуальный контент через нейросети и настраиваю Reels-автоматизацию',
      avatarUrl: undefined,
      specializations: ['Визуалы (обложки, графика, Reels)', 'Контент с помощью нейросетей'],
      abilities: ['Генерирую визуалы в Midjourney/DALLE', 'Настраиваю Reels-контент с помощью AI'],
      services: [
        {
          name: 'Генерация визуалов',
          price: 3000,
          priceType: 'project',
        },
        {
          name: 'Настройка Reels-контента',
          price: 8000,
          priceType: 'project',
        },
      ],
      contacts: {
        telegram: '@maxim_visuals',
        website: 'https://maxim-ai-visuals.com',
      },
      status: 'available',
      lastActive: '2024-01-15T09:15:00Z',
    },
    {
      id: 'specialist-3',
      userId: 'user-3',
      displayName: 'Екатерина Смирнова',
      superpower: 'Обучаю работе с нейросетями и создаю базы промптов под любые задачи',
      avatarUrl: undefined,
      specializations: ['Обучение других нейросетям', 'Базы промптов'],
      abilities: ['Провожу обучение/консультации', 'Делаю базы промптов под задачи клиента'],
      services: [
        {
          name: 'Индивидуальное обучение',
          price: 3000,
          priceType: 'hourly',
        },
        {
          name: 'База промптов',
          price: 'от 2000',
          priceType: 'negotiable',
        },
      ],
      contacts: {
        telegram: '@kate_ai_teacher',
        email: 'kate@ai-education.ru',
        website: 'https://ai-learning.ru',
      },
      status: 'busy',
      lastActive: '2024-01-15T11:45:00Z',
    },
    {
      id: 'specialist-4',
      userId: 'user-4',
      displayName: 'Дмитрий Козлов',
      superpower: 'Автоматизирую процессы с помощью нейросетей и создаю чат-боты для бизнеса',
      avatarUrl: undefined,
      specializations: ['Автоматизация', 'Нейроассистенты (AI-боты)'],
      abilities: ['Интегрирую нейросети в бизнес-процессы', 'Создаю чат-боты для клиентского сервиса'],
      services: [
        {
          name: 'Автоматизация бизнес-процессов',
          price: 20000,
          priceType: 'project',
        },
        {
          name: 'Чат-бот для сайта',
          price: 12000,
          priceType: 'fixed',
        },
      ],
      contacts: {
        telegram: '@dmitry_automation',
        email: 'dmitry@auto-solutions.ru',
      },
      rating: 4.7,
      reviewCount: 12,
      completedProjects: 28,
      responseTime: '< 3 часов',
      status: 'available',
      lastActive: '2024-01-15T08:20:00Z',
    },
    {
      id: 'specialist-5',
      userId: 'user-5',
      displayName: 'Ольга Николаева',
      superpower: 'Создаю интерактивный контент и визуалы с помощью AI для социальных сетей',
      avatarUrl: undefined,
      specializations: ['Контент с помощью нейросетей', 'Визуалы (обложки, графика, Reels)'],
      abilities: ['Создаю интерактивный контент для соцсетей', 'Генерирую визуалы и анимации'],
      services: [
        {
          name: 'Контент-план с визуалами',
          price: 7500,
          priceType: 'fixed',
        },
        {
          name: 'Создание визуалов',
          price: 1500,
          priceType: 'hourly',
        },
      ],
      contacts: {
        telegram: '@olga_content_ai',
        website: 'https://ai-content-studio.com',
      },
      status: 'available',
      lastActive: '2024-01-15T12:10:00Z',
    },
    // Additional specialists for pagination testing
    {
      id: 'specialist-6',
      userId: 'user-6',
      displayName: 'Сергей Волков',
      superpower: 'Настраиваю нейросети для интернет-магазинов и автоматизирую продажи',
      avatarUrl: undefined,
      specializations: ['Нейроворонки (продажи + автоматизация)', 'Обучение других нейросетям'],
      abilities: ['Настраиваю нейросети для e-commerce', 'Автоматизирую процессы продаж'],
      services: [
        {
          name: 'AI для интернет-магазина',
          price: 18000,
          priceType: 'fixed',
        },
      ],
      contacts: {
        telegram: '@sergey_ai_ecommerce',
        email: 'sergey@ai-ecommerce.ru',
      },
      status: 'available',
      lastActive: '2024-01-15T07:45:00Z',
    },
    {
      id: 'specialist-7',
      userId: 'user-7',
      displayName: 'Мария Лебедева',
      superpower: 'Обучаю команды работе с нейросетями и внедряю AI-инструменты в рабочие процессы',
      avatarUrl: undefined,
      specializations: ['Обучение других нейросетям', 'Автоматизация'],
      abilities: ['Провожу корпоративные тренинги по AI', 'Внедряю нейросети в команды'],
      services: [
        {
          name: 'Корпоративное обучение AI',
          price: 50000,
          priceType: 'project',
        },
        {
          name: 'Консультация по внедрению',
          price: 4000,
          priceType: 'hourly',
        },
      ],
      contacts: {
        telegram: '@maria_ai_training',
        email: 'maria@corporate-ai.ru',
        website: 'https://ai-corporate-training.com',
      },
      status: 'busy',
      lastActive: '2024-01-15T13:30:00Z',
    },
  ]

  private availableSkills: SkillOption[] = [
    // Specializations
    {
      key: 'neural-assistants',
      label: 'Нейроассистенты (AI-боты)',
      category: 'specialization',
      description: 'Создание AI-ботов и умных ассистентов',
    },
    {
      key: 'neural-funnels',
      label: 'Нейроворонки (продажи + автоматизация)',
      category: 'specialization',
      description: 'Автоматизация продаж с помощью AI',
    },
    {
      key: 'visuals-reels',
      label: 'Визуалы (обложки, графика, Reels)',
      category: 'specialization',
      description: 'Создание визуального контента',
    },
    {
      key: 'ai-content',
      label: 'Контент с помощью нейросетей',
      category: 'specialization',
      description: 'Генерация контента через AI',
    },
    {
      key: 'ai-education',
      label: 'Обучение других нейросетям',
      category: 'specialization',
      description: 'Обучение и консультации по AI',
    },
    {
      key: 'prompt-bases',
      label: 'Базы промптов',
      category: 'specialization',
      description: 'Создание библиотек промптов',
    },
    {
      key: 'automation',
      label: 'Автоматизация',
      category: 'specialization',
      description: 'Автоматизация бизнес-процессов',
    },

    // Abilities
    {
      key: 'build-funnels',
      label: 'Собираю нейроворонки (от лида до оплаты)',
      category: 'ability',
      description: 'Полный цикл автоматизации продаж',
    },
    {
      key: 'create-assistants',
      label: 'Создаю персональных AI-ассистентов',
      category: 'ability',
      description: 'Разработка персональных AI-помощников',
    },
    {
      key: 'generate-visuals',
      label: 'Генерирую визуалы в Midjourney/DALLE',
      category: 'ability',
      description: 'Создание изображений через AI',
    },
    {
      key: 'setup-reels',
      label: 'Настраиваю Reels-контент с помощью AI',
      category: 'ability',
      description: 'Автоматизация создания видеоконтента',
    },
    {
      key: 'conduct-training',
      label: 'Провожу обучение/консультации',
      category: 'ability',
      description: 'Обучение работе с нейросетями',
    },
    {
      key: 'create-prompt-bases',
      label: 'Делаю базы промптов под задачи клиента',
      category: 'ability',
      description: 'Кастомные библиотеки промптов',
    },
    {
      key: 'integrate-ai',
      label: 'Интегрирую нейросети в бизнес-процессы',
      category: 'ability',
      description: 'Внедрение AI в рабочие процессы',
    },
    {
      key: 'create-chatbots',
      label: 'Создаю чат-боты для клиентского сервиса',
      category: 'ability',
      description: 'Разработка чат-ботов',
    },
    {
      key: 'interactive-content',
      label: 'Создаю интерактивный контент для соцсетей',
      category: 'ability',
      description: 'Интерактивный контент для SMM',
    },
    {
      key: 'recommendation-systems',
      label: 'Создаю рекомендательные системы',
      category: 'ability',
      description: 'AI для персонализации',
    },
    {
      key: 'corporate-training',
      label: 'Провожу корпоративные тренинги по AI',
      category: 'ability',
      description: 'Обучение команд и компаний',
    },
  ]

  async searchSpecialists(filters: SearchFilters): Promise<SearchResults> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    let filteredSpecialists = [...this.fakeSpecialists]

    // Apply query filter
    if (filters.query?.trim()) {
      const query = filters.query.toLowerCase().trim()
      filteredSpecialists = filteredSpecialists.filter(
        specialist =>
          specialist.displayName.toLowerCase().includes(query) ||
          specialist.superpower.toLowerCase().includes(query) ||
          specialist.specializations.some(s => s.toLowerCase().includes(query)) ||
          specialist.abilities.some(a => a.toLowerCase().includes(query))
      )
    }

    // Apply skills filter
    if (filters.skills.length > 0) {
      filteredSpecialists = filteredSpecialists.filter(specialist => {
        // Map skills to specialization/ability labels for matching
        const specialistSkills = [
          ...specialist.specializations,
          ...specialist.abilities,
        ].map(skill => skill.toLowerCase())

        const filterSkills = filters.skills.map(skillKey => {
          const skill = this.availableSkills.find(s => s.key === skillKey)
          return skill ? skill.label.toLowerCase() : skillKey.toLowerCase()
        })

        return filterSkills.some(filterSkill =>
          specialistSkills.some(specialistSkill => specialistSkill.includes(filterSkill))
        )
      })
    }

    // Calculate pagination
    const page = filters.page || 1
    const limit = filters.limit || 5
    const total = filteredSpecialists.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const specialists = filteredSpecialists.slice(startIndex, endIndex)
    const hasMore = page < totalPages

    // Calculate facets for future use
    const facets = {
      skills: this.calculateSkillFacets(filteredSpecialists),
      specializations: this.calculateSpecializationFacets(filteredSpecialists),
    }

    return {
      specialists,
      total,
      currentPage: page,
      totalPages,
      hasMore,
      facets,
    }
  }

  async getAvailableSkills(): Promise<SkillOption[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.availableSkills]
  }

  private calculateSkillFacets(specialists: SpecialistProfile[]): { key: string; count: number }[] {
    const skillCounts: Record<string, number> = {}

    specialists.forEach(specialist => {
      [...specialist.specializations, ...specialist.abilities].forEach(skill => {
        const skillOption = this.availableSkills.find(s => s.label === skill)
        if (skillOption) {
          skillCounts[skillOption.key] = (skillCounts[skillOption.key] || 0) + 1
        }
      })
    })

    return Object.entries(skillCounts)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
  }

  private calculateSpecializationFacets(
    specialists: SpecialistProfile[]
  ): { key: string; count: number }[] {
    const specializationCounts: Record<string, number> = {}

    specialists.forEach(specialist => {
      specialist.specializations.forEach(specialization => {
        const skillOption = this.availableSkills.find(
          s => s.label === specialization && s.category === 'specialization'
        )
        if (skillOption) {
          specializationCounts[skillOption.key] =
            (specializationCounts[skillOption.key] || 0) + 1
        }
      })
    })

    return Object.entries(specializationCounts)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
  }
}