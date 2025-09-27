import type { PortfolioCase } from '@/types/specialist-profile-view'

// Extend the PortfolioCase type to include specialistId
interface PortfolioCaseWithSpecialist extends PortfolioCase {
  specialistId?: string
}

export class PortfolioService {
  // Get portfolio statistics (count of all portfolios)
  async getPortfolioStatistics(): Promise<number> {
    try {
      // In a real implementation, this would call an actual API
      // For now, we'll return mock data based on existing specialist profiles
      const mockPortfolios: PortfolioCaseWithSpecialist[] = [
        {
          id: 'portfolio-1',
          title: 'AI-ассистент для стоматологической клиники',
          description: 'Создал чат-бота для записи пациентов и консультаций. Сократил время обработки заявок на 70%.',
          type: 'bot',
          content: 'https://t.me/dental_ai_bot',
          result: 'Увеличение конверсии на 40%, автоматизация 90% запросов',
          tools: ['ChatGPT API', 'Telegram Bot API', 'Google Sheets'],
          createdAt: '2024-01-10T10:00:00Z',
          specialistId: 'specialist-1'
        },
        {
          id: 'portfolio-2',
          title: 'Нейроворонка для онлайн-школы',
          description: 'Полная автоматизация от лида до покупки курса с AI-подогревом клиентов.',
          type: 'landing',
          content: 'https://ai-school-demo.ru',
          result: 'ROI 300%, автоматический подогрев 1000+ лидов в месяц',
          tools: ['OpenAI API', 'Tilda', 'AmoCRM', 'Zapier'],
          createdAt: '2023-12-15T14:30:00Z',
          specialistId: 'specialist-1'
        },
        {
          id: 'portfolio-3',
          title: 'Персональный AI-консультант',
          description: 'Разработал AI-помощника для бизнес-консультанта, который отвечает на вопросы клиентов.',
          type: 'bot',
          content: 'Демо доступно по запросу',
          result: 'Экономия 20 часов в неделю, повышение качества консультаций',
          tools: ['GPT-4', 'Custom API', 'React'],
          createdAt: '2023-11-20T09:15:00Z',
          specialistId: 'specialist-1'
        },
        {
          id: 'portfolio-4',
          title: 'AI-аналитика для e-commerce',
          description: 'Создал систему предиктивной аналитики для интернет-магазина.',
          type: 'text',
          content: 'https://ecommerce-analytics-demo.ru',
          result: 'Увеличение среднего чека на 25%, снижение рекламных расходов на 30%',
          tools: ['Python', 'TensorFlow', 'PostgreSQL', 'Tableau'],
          createdAt: '2023-10-05T11:45:00Z',
          specialistId: 'specialist-2'
        },
        {
          id: 'portfolio-5',
          title: 'Генеративный AI для креативного агентства',
          description: 'Разработал систему автоматической генерации визуалов для рекламных кампаний.',
          type: 'visual',
          content: 'https://creative-ai-demo.ru',
          result: 'Сокращение времени на создание креативов на 60%, увеличение CTR на 45%',
          tools: ['Stable Diffusion', 'Midjourney API', 'Node.js', 'Vue.js'],
          createdAt: '2023-09-20T13:20:00Z',
          specialistId: 'specialist-2'
        },
        {
          id: 'portfolio-6',
          title: 'AI-система для HR-департамента',
          description: 'Создал систему автоматического отбора резюме и предварительного интервьюирования.',
          type: 'bot',
          content: 'https://hr-ai-demo.ru',
          result: 'Сокращение времени на подбор персонала на 50%, повышение качества найма на 35%',
          tools: ['Hugging Face', 'FastAPI', 'React', 'MongoDB'],
          createdAt: '2023-08-15T09:30:00Z',
          specialistId: 'specialist-3'
        },
        {
          id: 'portfolio-7',
          title: 'AI-ассистент для юридической фирмы',
          description: 'Разработал систему автоматического анализа контрактов и правовых документов.',
          type: 'text',
          content: 'https://legal-ai-demo.ru',
          result: 'Сокращение времени на анализ документов на 70%, снижение ошибок на 90%',
          tools: ['BERT', 'Python', 'Django', 'Elasticsearch'],
          createdAt: '2023-07-10T14:15:00Z',
          specialistId: 'specialist-3'
        }
      ]

      return mockPortfolios.length
    } catch (error) {
      console.error('Error fetching portfolio statistics:', error)
      throw error
    }
  }

  // Get random portfolios
  async getRandomPortfolios(count: number = 5): Promise<PortfolioCase[]> {
    try {
      // In a real implementation, this would call an actual API
      // For now, we'll return mock data based on existing specialist profiles
      const mockPortfolios: PortfolioCaseWithSpecialist[] = [
        {
          id: 'portfolio-1',
          title: 'AI-ассистент для стоматологической клиники',
          description: 'Создал чат-бота для записи пациентов и консультаций. Сократил время обработки заявок на 70%.',
          type: 'bot',
          content: 'https://t.me/dental_ai_bot',
          result: 'Увеличение конверсии на 40%, автоматизация 90% запросов',
          tools: ['ChatGPT API', 'Telegram Bot API', 'Google Sheets'],
          createdAt: '2024-01-10T10:00:00Z',
          specialistId: 'specialist-1'
        },
        {
          id: 'portfolio-2',
          title: 'Нейроворонка для онлайн-школы',
          description: 'Полная автоматизация от лида до покупки курса с AI-подогревом клиентов.',
          type: 'landing',
          content: 'https://ai-school-demo.ru',
          result: 'ROI 300%, автоматический подогрев 1000+ лидов в месяц',
          tools: ['OpenAI API', 'Tilda', 'AmoCRM', 'Zapier'],
          createdAt: '2023-12-15T14:30:00Z',
          specialistId: 'specialist-1'
        },
        {
          id: 'portfolio-3',
          title: 'Персональный AI-консультант',
          description: 'Разработал AI-помощника для бизнес-консультанта, который отвечает на вопросы клиентов.',
          type: 'bot',
          content: 'Демо доступно по запросу',
          result: 'Экономия 20 часов в неделю, повышение качества консультаций',
          tools: ['GPT-4', 'Custom API', 'React'],
          createdAt: '2023-11-20T09:15:00Z',
          specialistId: 'specialist-1'
        },
        {
          id: 'portfolio-4',
          title: 'AI-аналитика для e-commerce',
          description: 'Создал систему предиктивной аналитики для интернет-магазина.',
          type: 'text',
          content: 'https://ecommerce-analytics-demo.ru',
          result: 'Увеличение среднего чека на 25%, снижение рекламных расходов на 30%',
          tools: ['Python', 'TensorFlow', 'PostgreSQL', 'Tableau'],
          createdAt: '2023-10-05T11:45:00Z',
          specialistId: 'specialist-2'
        },
        {
          id: 'portfolio-5',
          title: 'Генеративный AI для креативного агентства',
          description: 'Разработал систему автоматической генерации визуалов для рекламных кампаний.',
          type: 'visual',
          content: 'https://creative-ai-demo.ru',
          result: 'Сокращение времени на создание креативов на 60%, увеличение CTR на 45%',
          tools: ['Stable Diffusion', 'Midjourney API', 'Node.js', 'Vue.js'],
          createdAt: '2023-09-20T13:20:00Z',
          specialistId: 'specialist-2'
        },
        {
          id: 'portfolio-6',
          title: 'AI-система для HR-департамента',
          description: 'Создал систему автоматического отбора резюме и предварительного интервьюирования.',
          type: 'bot',
          content: 'https://hr-ai-demo.ru',
          result: 'Сокращение времени на подбор персонала на 50%, повышение качества найма на 35%',
          tools: ['Hugging Face', 'FastAPI', 'React', 'MongoDB'],
          createdAt: '2023-08-15T09:30:00Z',
          specialistId: 'specialist-3'
        },
        {
          id: 'portfolio-7',
          title: 'AI-ассистент для юридической фирмы',
          description: 'Разработал систему автоматического анализа контрактов и правовых документов.',
          type: 'text',
          content: 'https://legal-ai-demo.ru',
          result: 'Сокращение времени на анализ документов на 70%, снижение ошибок на 90%',
          tools: ['BERT', 'Python', 'Django', 'Elasticsearch'],
          createdAt: '2023-07-10T14:15:00Z',
          specialistId: 'specialist-3'
        }
      ]

      // Shuffle array and take first 'count' items
      const shuffled = [...mockPortfolios].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    } catch (error) {
      console.error('Error fetching random portfolios:', error)
      throw error
    }
  }
}