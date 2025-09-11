import type {
  ProfileViewData,
  ServiceDetails,
  PortfolioCase,
  ExperienceEntry,
  TestimonialData,
  ContactInfo,
  SpecialistProfileViewAPI
} from '@/types/specialist-profile-view'
import type { SpecialistProfile } from '@/types/specialist-search'
import type { NeuralNetworkProfileSchema, FileReference } from '@/types/neural-network-profile'

export class SpecialistProfileViewService implements SpecialistProfileViewAPI {
  // Mock detailed profile data for demonstration
  private mockDetailedProfiles: Record<string, NeuralNetworkProfileSchema> = {
    'specialist-1': {
      id: 'specialist-1',
      userId: 'user-1',
      profileType: 'neural-network',
      version: '1.0',
      metadata: {
        completionPercentage: 95,
        lastModifiedBlock: 'contacts',
        validationErrors: [],
        isDraft: false,
        submissionAttempts: 1,
        moderationNotes: ['Профиль одобрен']
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
          promptBases: false,
          chatbotSetup: true,
          neuralNetworkTraining: false,
          customSpecializations: ['CRM-интеграции']
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
          text: 'Создаю AI-ассистентов для автоматизации бизнес-процессов и увеличения продаж. Более 50 успешных проектов за 2 года.'
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
          sellingTextsWithGPT: true,
          visualGeneration: false,
          reelsContentAI: false,
          videoProcessing: false,
          funnelAutomation: true,
          promptBases: true,
          trainingConsultations: true,
          customAbilities: ['Интеграция с CRM-системами', 'Настройка webhook']
        },
        validation: {
          required: true,
          minSelected: 1
        }
      },
      portfolio: {
        title: 'Примеры работ / портфолио',
        description: 'Залей ссылки или прикрепи визуалы',
        data: [
          {
            id: 'portfolio-1',
            title: 'AI-ассистент для стоматологической клиники',
            description: 'Создал чат-бота для записи пациентов и консультаций. Сократил время обработки заявок на 70%.',
            type: 'bot',
            content: 'https://t.me/dental_ai_bot',
            result: 'Увеличение конверсии на 40%, автоматизация 90% запросов',
            tools: ['ChatGPT API', 'Telegram Bot API', 'Google Sheets'],
            createdAt: '2024-01-10T10:00:00Z'
          },
          {
            id: 'portfolio-2',
            title: 'Нейроворонка для онлайн-школы',
            description: 'Полная автоматизация от лида до покупки курса с AI-подогревом клиентов.',
            type: 'landing',
            content: 'https://ai-school-demo.ru',
            result: 'ROI 300%, автоматический подогрев 1000+ лидов в месяц',
            tools: ['OpenAI API', 'Tilda', 'AmoCRM', 'Zapier'],
            createdAt: '2023-12-15T14:30:00Z'
          },
          {
            id: 'portfolio-3',
            title: 'Персональный AI-консультант',
            description: 'Разработал AI-помощника для бизнес-консультанта, который отвечает на вопросы клиентов.',
            type: 'bot',
            content: 'Демо доступно по запросу',
            result: 'Экономия 20 часов в неделю, повышение качества консультаций',
            tools: ['GPT-4', 'Custom API', 'React'],
            createdAt: '2023-11-20T09:15:00Z'
          }
        ],
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
              selected: true,
              name: 'Нейроассистент под ключ',
              basePrice: 15000,
              customPrice: 18000,
              description: 'Полная разработка и настройка AI-ассистента для вашего бизнеса'
            },
            neuralSalesFunnel: {
              selected: true,
              name: 'Нейроворонка для продаж',
              basePrice: 25000,
              customPrice: 30000,
              description: 'Автоматизированная воронка продаж с AI-подогревом'
            },
            promptBase: {
              selected: true,
              name: 'База промптов',
              basePrice: 3000,
              customPrice: 5000,
              description: 'Готовые промпты для вашей ниши'
            },
            trainingConsultation: {
              selected: true,
              name: 'Обучение/консультация',
              basePrice: 2000,
              customPrice: 2500,
              description: 'Персональное обучение работе с AI'
            }
          },
          customServices: [
            {
              id: 'custom-1',
              name: 'CRM интеграция',
              description: 'Интеграция AI-ассистента с вашей CRM-системой',
              price: 12000,
              priceType: 'fixed'
            },
            {
              id: 'custom-2',
              name: 'Техническая поддержка',
              description: 'Месячная поддержка и обновления AI-системы',
              price: 5000,
              priceType: 'fixed'
            }
          ]
        },
        validation: {
          required: false
        }
      },
      experience: {
        title: 'С кем работал и что делал?',
        description: 'Опиши свой опыт работы с клиентами',
        data: [
          {
            id: 'exp-1',
            client: 'Стоматологическая клиника "Белый зуб"',
            task: 'Создание AI-ассистента для записи пациентов и предварительных консультаций',
            tools: ['ChatGPT-4', 'Telegram Bot API', 'Google Calendar API'],
            result: 'Автоматизация 85% запросов, увеличение записей на 30%',
            duration: '2 месяца',
            year: '2024'
          },
          {
            id: 'exp-2',
            client: 'Онлайн-школа английского языка "FluentAI"',
            task: 'Разработка нейроворонки для автоматизации продаж курсов',
            tools: ['OpenAI API', 'Tilda', 'AmoCRM', 'Zapier'],
            result: 'ROI 300%, конверсия в покупку увеличилась с 2% до 8%',
            duration: '3 месяца',
            year: '2023'
          },
          {
            id: 'exp-3',
            client: 'IT-консалтинговая компания "TechSolutions"',
            task: 'Создание персонального AI-консультанта для предварительной оценки проектов',
            tools: ['GPT-4', 'Custom API', 'React', 'Node.js'],
            result: 'Сокращение времени на первичную консультацию на 60%',
            duration: '1.5 месяца',
            year: '2023'
          }
        ],
        validation: {
          required: false,
          maxItems: 20
        }
      },
      testimonials: {
        title: 'Отзывы/рекомендации',
        description: 'Вы можете прикрепить ссылку на диск, сайт или другой ресурс с файлами',
        data: {
          textTestimonials: [
            {
              id: 'test-1',
              clientName: 'Иван Петров',
              clientPosition: 'Основатель компании "Digital Future"',
              testimonialText: 'Анна создала для нас AI-ассистента, который полностью изменил наш подход к работе с клиентами. Увеличили конверсию на 45% и сэкономили 20 часов в неделю команды.',
              projectType: 'Нейроассистент для поддержки клиентов',
              date: '2024-01-10'
            },
            {
              id: 'test-2',
              clientName: 'Алексей Сидоров',
              clientPosition: 'Директор по маркетингу "TechFlow"',
              testimonialText: 'Благодаря внедрению нейроворонки, автоматизированной Анной, наши продажи выросли на 60% за 3 месяца. Профессионализм и качество работы на высшем уровне.',
              rating: 5,
              projectType: 'Нейроворонка продаж',
              date: '2023-12-20'
            },
            {
              id: 'test-3',
              clientName: 'Елена Смирнова',
              clientPosition: 'CEO TechSolutions',
              testimonialText: 'Профессиональный подход, качественная работа, отличный результат. AI-консультант экономит нам много времени каждый день.',
              rating: 5,
              projectType: 'AI-консультант',
              date: '2023-11-25'
            }
          ],
          externalLinks: [
            'https://drive.google.com/testimonials-anna',
            'https://reviews.yandex.ru/anna-ai-expert'
          ],
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
          telegram: '@anna_ai_expert',
          email: 'anna@example.com',
          website: 'https://anna-ai-solutions.ru',
          phone: '+7 (999) 123-45-67',
          whatsapp: '+7 (999) 123-45-67'
        },
        validation: {
          required: true,
          atLeastOne: ['telegram', 'email', 'website'],
          emailFormat: true,
          websiteFormat: true,
          telegramFormat: true
        }
      },
      status: 'approved',
      profileCompleted: true,
      createdAt: '2023-10-01T10:00:00Z',
      updatedAt: '2024-01-15T12:30:00Z'
    }
  }

  // Reference to existing specialist search service for basic data
  async getBasicProfile(id: string): Promise<SpecialistProfile> {
    // In a real implementation, this would call the existing specialist search service
    // For now, we'll mock this based on the existing fake data structure
    const basicProfiles: Record<string, SpecialistProfile> = {
      'specialist-1': {
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
      }
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const profile = basicProfiles[id]
    if (!profile) {
      throw new Error(`Specialist with id ${id} not found`)
    }

    return profile
  }

  async getDetailedProfile(id: string): Promise<NeuralNetworkProfileSchema> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700))

    const profile = this.mockDetailedProfiles[id]
    if (!profile) {
      throw new Error(`Detailed profile for specialist ${id} not found`)
    }

    return profile
  }

  async getProfileById(id: string): Promise<ProfileViewData> {
    try {
      // Fetch both basic and detailed profiles in parallel
      const [basicProfile, detailedProfile] = await Promise.all([
        this.getBasicProfile(id),
        this.getDetailedProfile(id)
      ])

      // Transform detailed services
      const services: ServiceDetails[] = [
        ...Object.entries(detailedProfile.services.data.predefinedServices)
          .filter(([_, service]) => service.selected)
          .map(([key, service]) => ({
            name: service.name,
            description: service.description,
            price: service.customPrice || service.basePrice,
            priceType: 'fixed' as const,
            category: 'predefined',
            isCustom: false
          })),
        ...detailedProfile.services.data.customServices.map(service => ({
          name: service.name,
          description: service.description,
          price: service.price,
          priceType: service.priceType,
          category: 'custom',
          isCustom: true
        }))
      ]

      // Transform testimonials
      const testimonials: TestimonialData = {
        textTestimonials: detailedProfile.testimonials.data.textTestimonials,
        externalLinks: detailedProfile.testimonials.data.externalLinks,
        files: detailedProfile.testimonials.data.files,
        averageRating: detailedProfile.testimonials.data.textTestimonials.length > 0
          ? detailedProfile.testimonials.data.textTestimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / detailedProfile.testimonials.data.textTestimonials.length
          : undefined,
        totalCount: detailedProfile.testimonials.data.textTestimonials.length + detailedProfile.testimonials.data.externalLinks.length + detailedProfile.testimonials.data.files.length
      }

      // Transform contacts
      const contacts: ContactInfo = {
        telegram: detailedProfile.contacts.data.telegram,
        email: detailedProfile.contacts.data.email,
        website: detailedProfile.contacts.data.website,
        phone: detailedProfile.contacts.data.phone,
        whatsapp: detailedProfile.contacts.data.whatsapp,
        discord: detailedProfile.contacts.data.discord,
        linkedin: detailedProfile.contacts.data.linkedin,
        preferredContact: detailedProfile.contacts.data.telegram ? 'telegram' : 'email',
        availability: basicProfile.status
      }

      // Create the combined profile data
      const profileViewData: ProfileViewData = {
        basicInfo: {
          id: basicProfile.id,
          userId: basicProfile.userId,
          displayName: basicProfile.displayName,
          superpower: basicProfile.superpower,
          avatarUrl: basicProfile.avatarUrl,
          status: basicProfile.status,
          lastActive: basicProfile.lastActive
        },
        detailedInfo: {
          specializations: this.extractSpecializations(detailedProfile),
          abilities: this.extractAbilities(detailedProfile),
          services,
          portfolio: detailedProfile.portfolio.data,
          experience: detailedProfile.experience.data,
          testimonials,
          contacts
        },
        metadata: {
          profileCompleted: detailedProfile.profileCompleted,
          completionPercentage: detailedProfile.metadata.completionPercentage,
          moderationStatus: detailedProfile.status,
          lastUpdated: detailedProfile.updatedAt
        }
      }

      return profileViewData
    } catch (error) {
      throw new Error(`Failed to load profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private extractSpecializations(profile: NeuralNetworkProfileSchema): string[] {
    const specializations: string[] = []
    const data = profile.specializations.data

    if (data.neuralAssistants) specializations.push('Нейроассистенты (AI-боты)')
    if (data.neuralFunnels) specializations.push('Нейроворонки (продажи + автоматизация)')
    if (data.contentGeneration) specializations.push('Контент с помощью нейросетей')
    if (data.visuals) specializations.push('Визуалы (обложки, графика, Reels)')
    if (data.audioVideoProcessing) specializations.push('Обработка аудио и видео')
    if (data.promptBases) specializations.push('Базы промптов')
    if (data.chatbotSetup) specializations.push('Настройка чат-ботов')
    if (data.neuralNetworkTraining) specializations.push('Обучение других нейросетям')

    if (data.customSpecializations) {
      specializations.push(...data.customSpecializations)
    }

    return specializations
  }

  private extractAbilities(profile: NeuralNetworkProfileSchema): string[] {
    const abilities: string[] = []
    const data = profile.abilities.data

    if (data.funnelAssembly) abilities.push('Собираю нейроворонки (от лида до оплаты)')
    if (data.personalAIAssistants) abilities.push('Создаю персональных AI-ассистентов')
    if (data.sellingTextsWithGPT) abilities.push('Пишу продающие тексты с ChatGPT')
    if (data.visualGeneration) abilities.push('Генерирую визуалы в Midjourney/DALLE')
    if (data.reelsContentAI) abilities.push('Настраиваю Reels-контент с помощью AI')
    if (data.videoProcessing) abilities.push('Обрабатываю видео в нейросетях')
    if (data.funnelAutomation) abilities.push('Автоматизирую воронки с GPT + Tilda/Telegram')
    if (data.promptBases) abilities.push('Делаю базы промптов под задачи клиента')
    if (data.trainingConsultations) abilities.push('Провожу обучение/консультации')

    if (data.customAbilities) {
      abilities.push(...data.customAbilities)
    }

    return abilities
  }
}
