{
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
        description: 'Загрузите скриншоты отзывов клиентов',
        data: {
          photos: []
        },
        validation: {
          required: false,
          maxPhotos: 20,
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maxFileSize: 5242880 // 5MB
        }
      },
      contacts: {
        title: 'Как тебе можно написать?',
        description: 'Укажите удобные способы связи',
        data: {
          phone: '',
          telegram: undefined,
          whatsapp: undefined,
          instagram: undefined
        },
        validation: {
          required: true,
          atLeastOne: ['phone'],
          telegramFormat: true,
          instagramFormat: true
        }
      }
    }