import type { Vacancy, VacancyPaginationResponse, VacancySearchFilters } from '@/types/vacancy'
import { useApi } from '@/composables/useApi'
import { useUserStore } from '@/stores/user'

export class VacancyService {
  private api = useApi()
  private userStore = useUserStore()

  // Get vacancy statistics
  async getVacancyStatistics(): Promise<number> {
    try {
      // Generate 20 realistic mock vacancies
      const mockVacancies: Vacancy[] = [
        {
          id: 'vacancy-1',
          title: 'Senior Data Scientist',
          description: 'Ищем опытного Data Scientist для работы над проектами в области предиктивной аналитики. Необходим опыт с Python, TensorFlow, и большими данными.',
          status: 'published',
          createdAt: '2023-05-15T10:30:00Z',
          updatedAt: '2023-05-20T14:45:00Z',
          clientId: 'client-1',
          clientName: 'TechCorp Solutions',
          clientPhone: '+7 (495) 123-45-67'
        },
        {
          id: 'vacancy-2',
          title: 'Machine Learning Engineer',
          description: 'Требуется ML инженер для разработки рекомендательных систем. Опыт работы с PyTorch, Scikit-learn и обработкой естественного языка.',
          status: 'published',
          createdAt: '2023-06-01T09:15:00Z',
          updatedAt: '2023-06-01T09:15:00Z',
          clientId: 'client-2',
          clientName: 'DataDriven Inc',
          clientPhone: '+7 (495) 234-56-78'
        },
        {
          id: 'vacancy-3',
          title: 'Computer Vision Specialist',
          description: 'Ищем специалиста по компьютерному зрению для разработки алгоритмов распознавания образов. Необходим опыт с OpenCV и нейронными сетями.',
          status: 'published',
          createdAt: '2023-04-10T11:20:00Z',
          updatedAt: '2023-05-25T16:30:00Z',
          clientId: 'client-3',
          clientName: 'VisionTech LLC',
          clientPhone: '+7 (495) 345-67-89'
        },
        {
          id: 'vacancy-4',
          title: 'NLP Engineer',
          description: 'Требуется инженер по обработке естественного языка для разработки чат-ботов. Опыт с BERT, GPT и языковыми моделями.',
          status: 'published',
          createdAt: '2023-07-12T14:20:00Z',
          updatedAt: '2023-07-12T14:20:00Z',
          clientId: 'client-4',
          clientName: 'LanguageAI Systems',
          clientPhone: '+7 (495) 456-78-90'
        },
        {
          id: 'vacancy-5',
          title: 'Deep Learning Researcher',
          description: 'Ищем исследователя в области глубокого обучения для работы над инновационными проектами. Публикации в топовых конференциях приветствуются.',
          status: 'published',
          createdAt: '2023-08-05T09:45:00Z',
          updatedAt: '2023-08-05T09:45:00Z',
          clientId: 'client-5',
          clientName: 'ResearchLabs Ltd',
          clientPhone: '+7 (495) 567-89-01'
        },
        {
          id: 'vacancy-6',
          title: 'AI Product Manager',
          description: 'Требуется менеджер продукта в сфере ИИ для управления разработкой AI-решений. Опыт в области машинного обучения и управления командами.',
          status: 'published',
          createdAt: '2023-09-10T11:30:00Z',
          updatedAt: '2023-09-10T11:30:00Z',
          clientId: 'client-6',
          clientName: 'InnovateAI Co',
          clientPhone: '+7 (495) 678-90-12'
        },
        {
          id: 'vacancy-7',
          title: 'Reinforcement Learning Engineer',
          description: 'Ищем инженера по обучению с подкреплением для разработки автономных систем. Опыт с RLlib, Stable Baselines и симуляциями.',
          status: 'published',
          createdAt: '2023-10-15T13:15:00Z',
          updatedAt: '2023-10-15T13:15:00Z',
          clientId: 'client-7',
          clientName: 'AutonomousTech',
          clientPhone: '+7 (495) 789-01-23'
        },
        {
          id: 'vacancy-8',
          title: 'MLOps Engineer',
          description: 'Требуется MLOps инженер для автоматизации процессов развертывания моделей. Опыт с Docker, Kubernetes и CI/CD пайплайнами.',
          status: 'published',
          createdAt: '2023-11-20T15:45:00Z',
          updatedAt: '2023-11-20T15:45:00Z',
          clientId: 'client-8',
          clientName: 'DevOpsAI Solutions',
          clientPhone: '+7 (495) 890-12-34'
        },
        {
          id: 'vacancy-9',
          title: 'AI Ethics Specialist',
          description: 'Ищем специалиста по этике ИИ для обеспечения ответственной разработки алгоритмов. Опыт в области регулирования ИИ и философии.',
          status: 'published',
          createdAt: '2023-12-05T10:20:00Z',
          updatedAt: '2023-12-05T10:20:00Z',
          clientId: 'client-9',
          clientName: 'EthicsAI Group',
          clientPhone: '+7 (495) 901-23-45'
        },
        {
          id: 'vacancy-10',
          title: 'Quantum Computing Researcher',
          description: 'Требуется исследователь в области квантовых вычислений для разработки алгоритмов. Опыт с Qiskit, Cirq и квантовой физикой.',
          status: 'published',
          createdAt: '2024-01-12T14:30:00Z',
          updatedAt: '2024-01-12T14:30:00Z',
          clientId: 'client-10',
          clientName: 'QuantumTech Labs',
          clientPhone: '+7 (495) 012-34-56'
        },
        {
          id: 'vacancy-11',
          title: 'Robotics AI Engineer',
          description: 'Ищем инженера по ИИ для разработки алгоритмов управления роботами. Опыт с ROS, компьютерным зрением и сенсорами.',
          status: 'published',
          createdAt: '2024-02-18T16:45:00Z',
          updatedAt: '2024-02-18T16:45:00Z',
          clientId: 'client-11',
          clientName: 'RoboticsAI Inc',
          clientPhone: '+7 (495) 123-45-68'
        },
        {
          id: 'vacancy-12',
          title: 'AI Security Specialist',
          description: 'Требуется специалист по безопасности ИИ для защиты моделей от атак. Опыт в области adversarial ML и кибербезопасности.',
          status: 'published',
          createdAt: '2024-03-22T09:15:00Z',
          updatedAt: '2024-03-22T09:15:00Z',
          clientId: 'client-12',
          clientName: 'SecureAI Systems',
          clientPhone: '+7 (495) 234-56-79'
        },
        {
          id: 'vacancy-13',
          title: 'AI Hardware Engineer',
          description: 'Ищем инженера по аппаратному обеспечению для разработки специализированных чипов для ИИ. Опыт с FPGA и ASIC.',
          status: 'published',
          createdAt: '2024-04-30T11:30:00Z',
          updatedAt: '2024-04-30T11:30:00Z',
          clientId: 'client-13',
          clientName: 'HardwareAI Corp',
          clientPhone: '+7 (495) 345-67-90'
        },
        {
          id: 'vacancy-14',
          title: 'AI for Healthcare Specialist',
          description: 'Требуется специалист по ИИ в здравоохранении для разработки диагностических систем. Опыт с медицинскими данными и регулированием.',
          status: 'published',
          createdAt: '2024-05-15T13:45:00Z',
          updatedAt: '2024-05-15T13:45:00Z',
          clientId: 'client-14',
          clientName: 'HealthAI Solutions',
          clientPhone: '+7 (495) 456-78-91'
        },
        {
          id: 'vacancy-15',
          title: 'AI for Finance Engineer',
          description: 'Ищем инженера по ИИ для финансового сектора. Опыт с алгоритмической торговлей и риск-менеджментом.',
          status: 'published',
          createdAt: '2024-06-20T15:20:00Z',
          updatedAt: '2024-06-20T15:20:00Z',
          clientId: 'client-15',
          clientName: 'FinTechAI Ltd',
          clientPhone: '+7 (495) 567-89-02'
        },
        {
          id: 'vacancy-16',
          title: 'AI for Autonomous Vehicles',
          description: 'Требуется специалист по ИИ для автономных транспортных средств. Опыт с LiDAR, картографией и планированием маршрутов.',
          status: 'published',
          createdAt: '2024-07-25T10:45:00Z',
          updatedAt: '2024-07-25T10:45:00Z',
          clientId: 'client-16',
          clientName: 'AutoAI Technologies',
          clientPhone: '+7 (495) 678-90-13'
        },
        {
          id: 'vacancy-17',
          title: 'AI for Climate Modeling',
          description: 'Ищем специалиста по ИИ для климатических моделей. Опыт с большими научными данными и экологическим моделированием.',
          status: 'published',
          createdAt: '2024-08-30T12:30:00Z',
          updatedAt: '2024-08-30T12:30:00Z',
          clientId: 'client-17',
          clientName: 'ClimateAI Research',
          clientPhone: '+7 (495) 789-01-24'
        },
        {
          id: 'vacancy-18',
          title: 'AI for Education Developer',
          description: 'Требуется разработчик ИИ для образовательных технологий. Опыт с адаптивным обучением и педагогическими подходами.',
          status: 'published',
          createdAt: '2024-09-10T14:15:00Z',
          updatedAt: '2024-09-10T14:15:00Z',
          clientId: 'client-18',
          clientName: 'EduAI Platform',
          clientPhone: '+7 (495) 890-12-35'
        },
        {
          id: 'vacancy-19',
          title: 'AI for Gaming Specialist',
          description: 'Ищем специалиста по ИИ для игровой индустрии. Опыт с NPC поведением и процедурной генерацией контента.',
          status: 'published',
          createdAt: '2024-10-05T16:20:00Z',
          updatedAt: '2024-10-05T16:20:00Z',
          clientId: 'client-19',
          clientName: 'GameAI Studios',
          clientPhone: '+7 (495) 901-23-46'
        },
        {
          id: 'vacancy-20',
          title: 'AI for Agriculture Engineer',
          description: 'Требуется инженер по ИИ для сельскохозяйственных технологий. Опыт с дронами, спутниковыми данными и precision farming.',
          status: 'published',
          createdAt: '2024-11-12T09:30:00Z',
          updatedAt: '2024-11-12T09:30:00Z',
          clientId: 'client-20',
          clientName: 'AgriAI Solutions',
          clientPhone: '+7 (495) 012-34-57'
        }
      ]

      // Count published vacancies
      const publishedVacancies = mockVacancies.filter(vacancy => vacancy.status === 'published')
      return publishedVacancies.length
    } catch (error) {
      console.error('Error fetching vacancy statistics:', error)
      throw error
    }
  }

  // Get random published vacancies
  async getRandomPublishedVacancies(count: number = 5): Promise<Vacancy[]> {
    try {
      // Generate 20 realistic mock vacancies
      const mockVacancies: Vacancy[] = [
        {
          id: 'vacancy-1',
          title: 'Senior Data Scientist',
          description: 'Ищем опытного Data Scientist для работы над проектами в области предиктивной аналитики. Необходим опыт с Python, TensorFlow, и большими данными.',
          status: 'published',
          createdAt: '2023-05-15T10:30:00Z',
          updatedAt: '2023-05-20T14:45:00Z',
          clientId: 'client-1',
          clientName: 'TechCorp Solutions',
          clientPhone: '+7 (495) 123-45-67'
        },
        {
          id: 'vacancy-2',
          title: 'Machine Learning Engineer',
          description: 'Требуется ML инженер для разработки рекомендательных систем. Опыт работы с PyTorch, Scikit-learn и обработкой естественного языка.',
          status: 'published',
          createdAt: '2023-06-01T09:15:00Z',
          updatedAt: '2023-06-01T09:15:00Z',
          clientId: 'client-2',
          clientName: 'DataDriven Inc',
          clientPhone: '+7 (495) 234-56-78'
        },
        {
          id: 'vacancy-3',
          title: 'Computer Vision Specialist',
          description: 'Ищем специалиста по компьютерному зрению для разработки алгоритмов распознавания образов. Необходим опыт с OpenCV и нейронными сетями.',
          status: 'published',
          createdAt: '2023-04-10T11:20:00Z',
          updatedAt: '2023-05-25T16:30:00Z',
          clientId: 'client-3',
          clientName: 'VisionTech LLC',
          clientPhone: '+7 (495) 345-67-89'
        },
        {
          id: 'vacancy-4',
          title: 'NLP Engineer',
          description: 'Требуется инженер по обработке естественного языка для разработки чат-ботов. Опыт с BERT, GPT и языковыми моделями.',
          status: 'published',
          createdAt: '2023-07-12T14:20:00Z',
          updatedAt: '2023-07-12T14:20:00Z',
          clientId: 'client-4',
          clientName: 'LanguageAI Systems',
          clientPhone: '+7 (495) 456-78-90'
        },
        {
          id: 'vacancy-5',
          title: 'Deep Learning Researcher',
          description: 'Ищем исследователя в области глубокого обучения для работы над инновационными проектами. Публикации в топовых конференциях приветствуются.',
          status: 'published',
          createdAt: '2023-08-05T09:45:00Z',
          updatedAt: '2023-08-05T09:45:00Z',
          clientId: 'client-5',
          clientName: 'ResearchLabs Ltd',
          clientPhone: '+7 (495) 567-89-01'
        },
        {
          id: 'vacancy-6',
          title: 'AI Product Manager',
          description: 'Требуется менеджер продукта в сфере ИИ для управления разработкой AI-решений. Опыт в области машинного обучения и управления командами.',
          status: 'published',
          createdAt: '2023-09-10T11:30:00Z',
          updatedAt: '2023-09-10T11:30:00Z',
          clientId: 'client-6',
          clientName: 'InnovateAI Co',
          clientPhone: '+7 (495) 678-90-12'
        },
        {
          id: 'vacancy-7',
          title: 'Reinforcement Learning Engineer',
          description: 'Ищем инженера по обучению с подкреплением для разработки автономных систем. Опыт с RLlib, Stable Baselines и симуляциями.',
          status: 'published',
          createdAt: '2023-10-15T13:15:00Z',
          updatedAt: '2023-10-15T13:15:00Z',
          clientId: 'client-7',
          clientName: 'AutonomousTech',
          clientPhone: '+7 (495) 789-01-23'
        },
        {
          id: 'vacancy-8',
          title: 'MLOps Engineer',
          description: 'Требуется MLOps инженер для автоматизации процессов развертывания моделей. Опыт с Docker, Kubernetes и CI/CD пайплайнами.',
          status: 'published',
          createdAt: '2023-11-20T15:45:00Z',
          updatedAt: '2023-11-20T15:45:00Z',
          clientId: 'client-8',
          clientName: 'DevOpsAI Solutions',
          clientPhone: '+7 (495) 890-12-34'
        },
        {
          id: 'vacancy-9',
          title: 'AI Ethics Specialist',
          description: 'Ищем специалиста по этике ИИ для обеспечения ответственной разработки алгоритмов. Опыт в области регулирования ИИ и философии.',
          status: 'published',
          createdAt: '2023-12-05T10:20:00Z',
          updatedAt: '2023-12-05T10:20:00Z',
          clientId: 'client-9',
          clientName: 'EthicsAI Group',
          clientPhone: '+7 (495) 901-23-45'
        },
        {
          id: 'vacancy-10',
          title: 'Quantum Computing Researcher',
          description: 'Требуется исследователь в области квантовых вычислений для разработки алгоритмов. Опыт с Qiskit, Cirq и квантовой физикой.',
          status: 'published',
          createdAt: '2024-01-12T14:30:00Z',
          updatedAt: '2024-01-12T14:30:00Z',
          clientId: 'client-10',
          clientName: 'QuantumTech Labs',
          clientPhone: '+7 (495) 012-34-56'
        },
        {
          id: 'vacancy-11',
          title: 'Robotics AI Engineer',
          description: 'Ищем инженера по ИИ для разработки алгоритмов управления роботами. Опыт с ROS, компьютерным зрением и сенсорами.',
          status: 'published',
          createdAt: '2024-02-18T16:45:00Z',
          updatedAt: '2024-02-18T16:45:00Z',
          clientId: 'client-11',
          clientName: 'RoboticsAI Inc',
          clientPhone: '+7 (495) 123-45-68'
        },
        {
          id: 'vacancy-12',
          title: 'AI Security Specialist',
          description: 'Требуется специалист по безопасности ИИ для защиты моделей от атак. Опыт в области adversarial ML и кибербезопасности.',
          status: 'published',
          createdAt: '2024-03-22T09:15:00Z',
          updatedAt: '2024-03-22T09:15:00Z',
          clientId: 'client-12',
          clientName: 'SecureAI Systems',
          clientPhone: '+7 (495) 234-56-79'
        },
        {
          id: 'vacancy-13',
          title: 'AI Hardware Engineer',
          description: 'Ищем инженера по аппаратному обеспечению для разработки специализированных чипов для ИИ. Опыт с FPGA и ASIC.',
          status: 'published',
          createdAt: '2024-04-30T11:30:00Z',
          updatedAt: '2024-04-30T11:30:00Z',
          clientId: 'client-13',
          clientName: 'HardwareAI Corp',
          clientPhone: '+7 (495) 345-67-90'
        },
        {
          id: 'vacancy-14',
          title: 'AI for Healthcare Specialist',
          description: 'Требуется специалист по ИИ в здравоохранении для разработки диагностических систем. Опыт с медицинскими данными и регулированием.',
          status: 'published',
          createdAt: '2024-05-15T13:45:00Z',
          updatedAt: '2024-05-15T13:45:00Z',
          clientId: 'client-14',
          clientName: 'HealthAI Solutions',
          clientPhone: '+7 (495) 456-78-91'
        },
        {
          id: 'vacancy-15',
          title: 'AI for Finance Engineer',
          description: 'Ищем инженера по ИИ для финансового сектора. Опыт с алгоритмической торговлей и риск-менеджментом.',
          status: 'published',
          createdAt: '2024-06-20T15:20:00Z',
          updatedAt: '2024-06-20T15:20:00Z',
          clientId: 'client-15',
          clientName: 'FinTechAI Ltd',
          clientPhone: '+7 (495) 567-89-02'
        },
        {
          id: 'vacancy-16',
          title: 'AI for Autonomous Vehicles',
          description: 'Требуется специалист по ИИ для автономных транспортных средств. Опыт с LiDAR, картографией и планированием маршрутов.',
          status: 'published',
          createdAt: '2024-07-25T10:45:00Z',
          updatedAt: '2024-07-25T10:45:00Z',
          clientId: 'client-16',
          clientName: 'AutoAI Technologies',
          clientPhone: '+7 (495) 678-90-13'
        },
        {
          id: 'vacancy-17',
          title: 'AI for Climate Modeling',
          description: 'Ищем специалиста по ИИ для климатических моделей. Опыт с большими научными данными и экологическим моделированием.',
          status: 'published',
          createdAt: '2024-08-30T12:30:00Z',
          updatedAt: '2024-08-30T12:30:00Z',
          clientId: 'client-17',
          clientName: 'ClimateAI Research',
          clientPhone: '+7 (495) 789-01-24'
        },
        {
          id: 'vacancy-18',
          title: 'AI for Education Developer',
          description: 'Требуется разработчик ИИ для образовательных технологий. Опыт с адаптивным обучением и педагогическими подходами.',
          status: 'published',
          createdAt: '2024-09-10T14:15:00Z',
          updatedAt: '2024-09-10T14:15:00Z',
          clientId: 'client-18',
          clientName: 'EduAI Platform',
          clientPhone: '+7 (495) 890-12-35'
        },
        {
          id: 'vacancy-19',
          title: 'AI for Gaming Specialist',
          description: 'Ищем специалиста по ИИ для игровой индустрии. Опыт с NPC поведением и процедурной генерацией контента.',
          status: 'published',
          createdAt: '2024-10-05T16:20:00Z',
          updatedAt: '2024-10-05T16:20:00Z',
          clientId: 'client-19',
          clientName: 'GameAI Studios',
          clientPhone: '+7 (495) 901-23-46'
        },
        {
          id: 'vacancy-20',
          title: 'AI for Agriculture Engineer',
          description: 'Требуется инженер по ИИ для сельскохозяйственных технологий. Опыт с дронами, спутниковыми данными и precision farming.',
          status: 'published',
          createdAt: '2024-11-12T09:30:00Z',
          updatedAt: '2024-11-12T09:30:00Z',
          clientId: 'client-20',
          clientName: 'AgriAI Solutions',
          clientPhone: '+7 (495) 012-34-57'
        }
      ]

      // Filter published vacancies
      const publishedVacancies = mockVacancies.filter(vacancy => vacancy.status === 'published')
      
      // Shuffle array and take first 'count' items
      const shuffled = [...publishedVacancies].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    } catch (error) {
      console.error('Error fetching random published vacancies:', error)
      throw error
    }
  }

  // Get all vacancies for current client
  async getMyVacancies(searchQuery?: string): Promise<Vacancy[]> {
    try {
      // In a real implementation, this would call an actual API
      // For now, we'll return mock data
      const mockVacancies: Vacancy[] = [
        {
          id: '1',
          title: 'AI Specialist Needed for Chatbot Project',
          description: 'We need an experienced AI specialist to help us build a customer service chatbot using GPT-4 technology.',
          status: 'published',
          createdAt: '2023-05-15T10:30:00Z',
          updatedAt: '2023-05-20T14:45:00Z',
          clientId: 'client-1',
          clientName: 'Иван Петров',
          clientPhone: '+7 (999) 123-45-67'
        },
        {
          id: '2',
          title: 'Machine Learning Engineer for Recommendation System',
          description: 'Looking for a machine learning engineer to develop a recommendation system for our e-commerce platform.',
          status: 'draft',
          createdAt: '2023-06-01T09:15:00Z',
          updatedAt: '2023-06-01T09:15:00Z',
          clientId: 'client-1',
          clientName: 'Иван Петров',
          clientPhone: '+7 (999) 123-45-67'
        },
        {
          id: '3',
          title: 'Computer Vision Expert for Medical Imaging',
          description: 'Seeking a computer vision expert to help develop algorithms for medical image analysis.',
          status: 'closed',
          createdAt: '2023-04-10T11:20:00Z',
          updatedAt: '2023-05-25T16:30:00Z',
          clientId: 'client-1',
          clientName: 'Иван Петров',
          clientPhone: '+7 (999) 123-45-67'
        }
      ]

      // Filter by search query if provided
      if (searchQuery) {
        return mockVacancies.filter(vacancy => 
          vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vacancy.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      return mockVacancies
    } catch (error) {
      console.error('Error fetching vacancies:', error)
      throw error
    }
  }

  // Get all published vacancies with pagination
  async getAllPublishedVacancies(page: number = 1, pageSize: number = 10): Promise<VacancyPaginationResponse> {
    try {
      // Generate 20 realistic mock vacancies
      const mockVacancies: Vacancy[] = [
        {
          id: 'vacancy-1',
          title: 'Senior Data Scientist',
          description: 'Ищем опытного Data Scientist для работы над проектами в области предиктивной аналитики. Необходим опыт с Python, TensorFlow, и большими данными.',
          status: 'published',
          createdAt: '2023-05-15T10:30:00Z',
          updatedAt: '2023-05-20T14:45:00Z',
          clientId: 'client-1',
          clientName: 'TechCorp Solutions',
          clientPhone: '+7 (495) 123-45-67'
        },
        {
          id: 'vacancy-2',
          title: 'Machine Learning Engineer',
          description: 'Требуется ML инженер для разработки рекомендательных систем. Опыт работы с PyTorch, Scikit-learn и обработкой естественного языка.',
          status: 'published',
          createdAt: '2023-06-01T09:15:00Z',
          updatedAt: '2023-06-01T09:15:00Z',
          clientId: 'client-2',
          clientName: 'DataDriven Inc',
          clientPhone: '+7 (495) 234-56-78'
        },
        {
          id: 'vacancy-3',
          title: 'Computer Vision Specialist',
          description: 'Ищем специалиста по компьютерному зрению для разработки алгоритмов распознавания образов. Необходим опыт с OpenCV и нейронными сетями.',
          status: 'published',
          createdAt: '2023-04-10T11:20:00Z',
          updatedAt: '2023-05-25T16:30:00Z',
          clientId: 'client-3',
          clientName: 'VisionTech LLC',
          clientPhone: '+7 (495) 345-67-89'
        },
        {
          id: 'vacancy-4',
          title: 'NLP Engineer',
          description: 'Требуется инженер по обработке естественного языка для разработки чат-ботов. Опыт с BERT, GPT и языковыми моделями.',
          status: 'published',
          createdAt: '2023-07-12T14:20:00Z',
          updatedAt: '2023-07-12T14:20:00Z',
          clientId: 'client-4',
          clientName: 'LanguageAI Systems',
          clientPhone: '+7 (495) 456-78-90'
        },
        {
          id: 'vacancy-5',
          title: 'Deep Learning Researcher',
          description: 'Ищем исследователя в области глубокого обучения для работы над инновационными проектами. Публикации в топовых конференциях приветствуются.',
          status: 'published',
          createdAt: '2023-08-05T09:45:00Z',
          updatedAt: '2023-08-05T09:45:00Z',
          clientId: 'client-5',
          clientName: 'ResearchLabs Ltd',
          clientPhone: '+7 (495) 567-89-01'
        },
        {
          id: 'vacancy-6',
          title: 'AI Product Manager',
          description: 'Требуется менеджер продукта в сфере ИИ для управления разработкой AI-решений. Опыт в области машинного обучения и управления командами.',
          status: 'published',
          createdAt: '2023-09-10T11:30:00Z',
          updatedAt: '2023-09-10T11:30:00Z',
          clientId: 'client-6',
          clientName: 'InnovateAI Co',
          clientPhone: '+7 (495) 678-90-12'
        },
        {
          id: 'vacancy-7',
          title: 'Reinforcement Learning Engineer',
          description: 'Ищем инженера по обучению с подкреплением для разработки автономных систем. Опыт с RLlib, Stable Baselines и симуляциями.',
          status: 'published',
          createdAt: '2023-10-15T13:15:00Z',
          updatedAt: '2023-10-15T13:15:00Z',
          clientId: 'client-7',
          clientName: 'AutonomousTech',
          clientPhone: '+7 (495) 789-01-23'
        },
        {
          id: 'vacancy-8',
          title: 'MLOps Engineer',
          description: 'Требуется MLOps инженер для автоматизации процессов развертывания моделей. Опыт с Docker, Kubernetes и CI/CD пайплайнами.',
          status: 'published',
          createdAt: '2023-11-20T15:45:00Z',
          updatedAt: '2023-11-20T15:45:00Z',
          clientId: 'client-8',
          clientName: 'DevOpsAI Solutions',
          clientPhone: '+7 (495) 890-12-34'
        },
        {
          id: 'vacancy-9',
          title: 'AI Ethics Specialist',
          description: 'Ищем специалиста по этике ИИ для обеспечения ответственной разработки алгоритмов. Опыт в области регулирования ИИ и философии.',
          status: 'published',
          createdAt: '2023-12-05T10:20:00Z',
          updatedAt: '2023-12-05T10:20:00Z',
          clientId: 'client-9',
          clientName: 'EthicsAI Group',
          clientPhone: '+7 (495) 901-23-45'
        },
        {
          id: 'vacancy-10',
          title: 'Quantum Computing Researcher',
          description: 'Требуется исследователь в области квантовых вычислений для разработки алгоритмов. Опыт с Qiskit, Cirq и квантовой физикой.',
          status: 'published',
          createdAt: '2024-01-12T14:30:00Z',
          updatedAt: '2024-01-12T14:30:00Z',
          clientId: 'client-10',
          clientName: 'QuantumTech Labs',
          clientPhone: '+7 (495) 012-34-56'
        },
        {
          id: 'vacancy-11',
          title: 'Robotics AI Engineer',
          description: 'Ищем инженера по ИИ для разработки алгоритмов управления роботами. Опыт с ROS, компьютерным зрением и сенсорами.',
          status: 'published',
          createdAt: '2024-02-18T16:45:00Z',
          updatedAt: '2024-02-18T16:45:00Z',
          clientId: 'client-11',
          clientName: 'RoboticsAI Inc',
          clientPhone: '+7 (495) 123-45-68'
        },
        {
          id: 'vacancy-12',
          title: 'AI Security Specialist',
          description: 'Требуется специалист по безопасности ИИ для защиты моделей от атак. Опыт в области adversarial ML и кибербезопасности.',
          status: 'published',
          createdAt: '2024-03-22T09:15:00Z',
          updatedAt: '2024-03-22T09:15:00Z',
          clientId: 'client-12',
          clientName: 'SecureAI Systems',
          clientPhone: '+7 (495) 234-56-79'
        },
        {
          id: 'vacancy-13',
          title: 'AI Hardware Engineer',
          description: 'Ищем инженера по аппаратному обеспечению для разработки специализированных чипов для ИИ. Опыт с FPGA и ASIC.',
          status: 'published',
          createdAt: '2024-04-30T11:30:00Z',
          updatedAt: '2024-04-30T11:30:00Z',
          clientId: 'client-13',
          clientName: 'HardwareAI Corp',
          clientPhone: '+7 (495) 345-67-90'
        },
        {
          id: 'vacancy-14',
          title: 'AI for Healthcare Specialist',
          description: 'Требуется специалист по ИИ в здравоохранении для разработки диагностических систем. Опыт с медицинскими данными и регулированием.',
          status: 'published',
          createdAt: '2024-05-15T13:45:00Z',
          updatedAt: '2024-05-15T13:45:00Z',
          clientId: 'client-14',
          clientName: 'HealthAI Solutions',
          clientPhone: '+7 (495) 456-78-91'
        },
        {
          id: 'vacancy-15',
          title: 'AI for Finance Engineer',
          description: 'Ищем инженера по ИИ для финансового сектора. Опыт с алгоритмической торговлей и риск-менеджментом.',
          status: 'published',
          createdAt: '2024-06-20T15:20:00Z',
          updatedAt: '2024-06-20T15:20:00Z',
          clientId: 'client-15',
          clientName: 'FinTechAI Ltd',
          clientPhone: '+7 (495) 567-89-02'
        },
        {
          id: 'vacancy-16',
          title: 'AI for Autonomous Vehicles',
          description: 'Требуется специалист по ИИ для автономных транспортных средств. Опыт с LiDAR, картографией и планированием маршрутов.',
          status: 'published',
          createdAt: '2024-07-25T10:45:00Z',
          updatedAt: '2024-07-25T10:45:00Z',
          clientId: 'client-16',
          clientName: 'AutoAI Technologies',
          clientPhone: '+7 (495) 678-90-13'
        },
        {
          id: 'vacancy-17',
          title: 'AI for Climate Modeling',
          description: 'Ищем специалиста по ИИ для климатических моделей. Опыт с большими научными данными и экологическим моделированием.',
          status: 'published',
          createdAt: '2024-08-30T12:30:00Z',
          updatedAt: '2024-08-30T12:30:00Z',
          clientId: 'client-17',
          clientName: 'ClimateAI Research',
          clientPhone: '+7 (495) 789-01-24'
        },
        {
          id: 'vacancy-18',
          title: 'AI for Education Developer',
          description: 'Требуется разработчик ИИ для образовательных технологий. Опыт с адаптивным обучением и педагогическими подходами.',
          status: 'published',
          createdAt: '2024-09-10T14:15:00Z',
          updatedAt: '2024-09-10T14:15:00Z',
          clientId: 'client-18',
          clientName: 'EduAI Platform',
          clientPhone: '+7 (495) 890-12-35'
        },
        {
          id: 'vacancy-19',
          title: 'AI for Gaming Specialist',
          description: 'Ищем специалиста по ИИ для игровой индустрии. Опыт с NPC поведением и процедурной генерацией контента.',
          status: 'published',
          createdAt: '2024-10-05T16:20:00Z',
          updatedAt: '2024-10-05T16:20:00Z',
          clientId: 'client-19',
          clientName: 'GameAI Studios',
          clientPhone: '+7 (495) 901-23-46'
        },
        {
          id: 'vacancy-20',
          title: 'AI for Agriculture Engineer',
          description: 'Требуется инженер по ИИ для сельскохозяйственных технологий. Опыт с дронами, спутниковыми данными и precision farming.',
          status: 'published',
          createdAt: '2024-11-12T09:30:00Z',
          updatedAt: '2024-11-12T09:30:00Z',
          clientId: 'client-20',
          clientName: 'AgriAI Solutions',
          clientPhone: '+7 (495) 012-34-57'
        }
      ]

      // Simulate pagination
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedVacancies = mockVacancies.slice(startIndex, endIndex)
      
      // Simulate hasMore based on whether there are more items
      const hasMore = endIndex < mockVacancies.length

      return {
        vacancies: paginatedVacancies,
        page,
        pageSize,
        total: mockVacancies.length,
        hasMore
      }
    } catch (error) {
      console.error('Error fetching all published vacancies:', error)
      throw error
    }
  }

  // Search vacancies with filters (always returns published vacancies)
  async searchVacancies(filters: VacancySearchFilters): Promise<VacancyPaginationResponse> {
    try {
      // Generate 20 realistic mock vacancies
      const mockVacancies: Vacancy[] = [
        {
          id: 'vacancy-1',
          title: 'Senior Data Scientist',
          description: 'Ищем опытного Data Scientist для работы над проектами в области предиктивной аналитики. Необходим опыт с Python, TensorFlow, и большими данными.',
          status: 'published',
          createdAt: '2023-05-15T10:30:00Z',
          updatedAt: '2023-05-20T14:45:00Z',
          clientId: 'client-1',
          clientName: 'TechCorp Solutions',
          clientPhone: '+7 (495) 123-45-67'
        },
        {
          id: 'vacancy-2',
          title: 'Machine Learning Engineer',
          description: 'Требуется ML инженер для разработки рекомендательных систем. Опыт работы с PyTorch, Scikit-learn и обработкой естественного языка.',
          status: 'published',
          createdAt: '2023-06-01T09:15:00Z',
          updatedAt: '2023-06-01T09:15:00Z',
          clientId: 'client-2',
          clientName: 'DataDriven Inc',
          clientPhone: '+7 (495) 234-56-78'
        },
        {
          id: 'vacancy-3',
          title: 'Computer Vision Specialist',
          description: 'Ищем специалиста по компьютерному зрению для разработки алгоритмов распознавания образов. Необходим опыт с OpenCV и нейронными сетями.',
          status: 'published',
          createdAt: '2023-04-10T11:20:00Z',
          updatedAt: '2023-05-25T16:30:00Z',
          clientId: 'client-3',
          clientName: 'VisionTech LLC',
          clientPhone: '+7 (495) 345-67-89'
        },
        {
          id: 'vacancy-4',
          title: 'NLP Engineer',
          description: 'Требуется инженер по обработке естественного языка для разработки чат-ботов. Опыт с BERT, GPT и языковыми моделями.',
          status: 'published',
          createdAt: '2023-07-12T14:20:00Z',
          updatedAt: '2023-07-12T14:20:00Z',
          clientId: 'client-4',
          clientName: 'LanguageAI Systems',
          clientPhone: '+7 (495) 456-78-90'
        },
        {
          id: 'vacancy-5',
          title: 'Deep Learning Researcher',
          description: 'Ищем исследователя в области глубокого обучения для работы над инновационными проектами. Публикации в топовых конференциях приветствуются.',
          status: 'published',
          createdAt: '2023-08-05T09:45:00Z',
          updatedAt: '2023-08-05T09:45:00Z',
          clientId: 'client-5',
          clientName: 'ResearchLabs Ltd',
          clientPhone: '+7 (495) 567-89-01'
        },
        {
          id: 'vacancy-6',
          title: 'AI Product Manager',
          description: 'Требуется менеджер продукта в сфере ИИ для управления разработкой AI-решений. Опыт в области машинного обучения и управления командами.',
          status: 'published',
          createdAt: '2023-09-10T11:30:00Z',
          updatedAt: '2023-09-10T11:30:00Z',
          clientId: 'client-6',
          clientName: 'InnovateAI Co',
          clientPhone: '+7 (495) 678-90-12'
        },
        {
          id: 'vacancy-7',
          title: 'Reinforcement Learning Engineer',
          description: 'Ищем инженера по обучению с подкреплением для разработки автономных систем. Опыт с RLlib, Stable Baselines и симуляциями.',
          status: 'published',
          createdAt: '2023-10-15T13:15:00Z',
          updatedAt: '2023-10-15T13:15:00Z',
          clientId: 'client-7',
          clientName: 'AutonomousTech',
          clientPhone: '+7 (495) 789-01-23'
        },
        {
          id: 'vacancy-8',
          title: 'MLOps Engineer',
          description: 'Требуется MLOps инженер для автоматизации процессов развертывания моделей. Опыт с Docker, Kubernetes и CI/CD пайплайнами.',
          status: 'published',
          createdAt: '2023-11-20T15:45:00Z',
          updatedAt: '2023-11-20T15:45:00Z',
          clientId: 'client-8',
          clientName: 'DevOpsAI Solutions',
          clientPhone: '+7 (495) 890-12-34'
        },
        {
          id: 'vacancy-9',
          title: 'AI Ethics Specialist',
          description: 'Ищем специалиста по этике ИИ для обеспечения ответственной разработки алгоритмов. Опыт в области регулирования ИИ и философии.',
          status: 'published',
          createdAt: '2023-12-05T10:20:00Z',
          updatedAt: '2023-12-05T10:20:00Z',
          clientId: 'client-9',
          clientName: 'EthicsAI Group',
          clientPhone: '+7 (495) 901-23-45'
        },
        {
          id: 'vacancy-10',
          title: 'Quantum Computing Researcher',
          description: 'Требуется исследователь в области квантовых вычислений для разработки алгоритмов. Опыт с Qiskit, Cirq и квантовой физикой.',
          status: 'published',
          createdAt: '2024-01-12T14:30:00Z',
          updatedAt: '2024-01-12T14:30:00Z',
          clientId: 'client-10',
          clientName: 'QuantumTech Labs',
          clientPhone: '+7 (495) 012-34-56'
        },
        {
          id: 'vacancy-11',
          title: 'Robotics AI Engineer',
          description: 'Ищем инженера по ИИ для разработки алгоритмов управления роботами. Опыт с ROS, компьютерным зрением и сенсорами.',
          status: 'published',
          createdAt: '2024-02-18T16:45:00Z',
          updatedAt: '2024-02-18T16:45:00Z',
          clientId: 'client-11',
          clientName: 'RoboticsAI Inc',
          clientPhone: '+7 (495) 123-45-68'
        },
        {
          id: 'vacancy-12',
          title: 'AI Security Specialist',
          description: 'Требуется специалист по безопасности ИИ для защиты моделей от атак. Опыт в области adversarial ML и кибербезопасности.',
          status: 'published',
          createdAt: '2024-03-22T09:15:00Z',
          updatedAt: '2024-03-22T09:15:00Z',
          clientId: 'client-12',
          clientName: 'SecureAI Systems',
          clientPhone: '+7 (495) 234-56-79'
        },
        {
          id: 'vacancy-13',
          title: 'AI Hardware Engineer',
          description: 'Ищем инженера по аппаратному обеспечению для разработки специализированных чипов для ИИ. Опыт с FPGA и ASIC.',
          status: 'published',
          createdAt: '2024-04-30T11:30:00Z',
          updatedAt: '2024-04-30T11:30:00Z',
          clientId: 'client-13',
          clientName: 'HardwareAI Corp',
          clientPhone: '+7 (495) 345-67-90'
        },
        {
          id: 'vacancy-14',
          title: 'AI for Healthcare Specialist',
          description: 'Требуется специалист по ИИ в здравоохранении для разработки диагностических систем. Опыт с медицинскими данными и регулированием.',
          status: 'published',
          createdAt: '2024-05-15T13:45:00Z',
          updatedAt: '2024-05-15T13:45:00Z',
          clientId: 'client-14',
          clientName: 'HealthAI Solutions',
          clientPhone: '+7 (495) 456-78-91'
        },
        {
          id: 'vacancy-15',
          title: 'AI for Finance Engineer',
          description: 'Ищем инженера по ИИ для финансового сектора. Опыт с алгоритмической торговлей и риск-менеджментом.',
          status: 'published',
          createdAt: '2024-06-20T15:20:00Z',
          updatedAt: '2024-06-20T15:20:00Z',
          clientId: 'client-15',
          clientName: 'FinTechAI Ltd',
          clientPhone: '+7 (495) 567-89-02'
        },
        {
          id: 'vacancy-16',
          title: 'AI for Autonomous Vehicles',
          description: 'Требуется специалист по ИИ для автономных транспортных средств. Опыт с LiDAR, картографией и планированием маршрутов.',
          status: 'published',
          createdAt: '2024-07-25T10:45:00Z',
          updatedAt: '2024-07-25T10:45:00Z',
          clientId: 'client-16',
          clientName: 'AutoAI Technologies',
          clientPhone: '+7 (495) 678-90-13'
        },
        {
          id: 'vacancy-17',
          title: 'AI for Climate Modeling',
          description: 'Ищем специалиста по ИИ для климатических моделей. Опыт с большими научными данными и экологическим моделированием.',
          status: 'published',
          createdAt: '2024-08-30T12:30:00Z',
          updatedAt: '2024-08-30T12:30:00Z',
          clientId: 'client-17',
          clientName: 'ClimateAI Research',
          clientPhone: '+7 (495) 789-01-24'
        },
        {
          id: 'vacancy-18',
          title: 'AI for Education Developer',
          description: 'Требуется разработчик ИИ для образовательных технологий. Опыт с адаптивным обучением и педагогическими подходами.',
          status: 'published',
          createdAt: '2024-09-10T14:15:00Z',
          updatedAt: '2024-09-10T14:15:00Z',
          clientId: 'client-18',
          clientName: 'EduAI Platform',
          clientPhone: '+7 (495) 890-12-35'
        },
        {
          id: 'vacancy-19',
          title: 'AI for Gaming Specialist',
          description: 'Ищем специалиста по ИИ для игровой индустрии. Опыт с NPC поведением и процедурной генерацией контента.',
          status: 'published',
          createdAt: '2024-10-05T16:20:00Z',
          updatedAt: '2024-10-05T16:20:00Z',
          clientId: 'client-19',
          clientName: 'GameAI Studios',
          clientPhone: '+7 (495) 901-23-46'
        },
        {
          id: 'vacancy-20',
          title: 'AI for Agriculture Engineer',
          description: 'Требуется инженер по ИИ для сельскохозяйственных технологий. Опыт с дронами, спутниковыми данными и precision farming.',
          status: 'published',
          createdAt: '2024-11-12T09:30:00Z',
          updatedAt: '2024-11-12T09:30:00Z',
          clientId: 'client-20',
          clientName: 'AgriAI Solutions',
          clientPhone: '+7 (495) 012-34-57'
        }
      ]

      // Apply filters (only query filter, always show published vacancies)
      let filteredVacancies = mockVacancies.filter(vacancy => vacancy.status === 'published')
      
      // Filter by query
      if (filters.query) {
        const query = filters.query.toLowerCase()
        filteredVacancies = filteredVacancies.filter(vacancy => 
          vacancy.title.toLowerCase().includes(query) || 
          vacancy.description.toLowerCase().includes(query)
        )
      }

      // Simulate pagination
      const page = filters.page || 1
      const pageSize = filters.limit || 10
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedVacancies = filteredVacancies.slice(startIndex, endIndex)
      
      // Simulate hasMore based on whether there are more items
      const hasMore = endIndex < filteredVacancies.length

      return {
        vacancies: paginatedVacancies,
        page,
        pageSize,
        total: filteredVacancies.length,
        hasMore
      }
    } catch (error) {
      console.error('Error searching vacancies:', error)
      throw error
    }
  }

  // Create new vacancy
  async createVacancy(data: Partial<Vacancy>): Promise<Vacancy> {
    try {
      // In a real implementation, this would call an actual API
      const newVacancy: Vacancy = {
        id: Date.now().toString(),
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientId: data.clientId || 'client-1', // In real implementation, this would come from the authenticated user
        clientName: data.clientName || 'Иван Петров', // In real implementation, this would come from the authenticated user
        clientPhone: data.clientPhone || '+7 (999) 123-45-67' // In real implementation, this would come from the authenticated user
      }
      
      return newVacancy
    } catch (error) {
      console.error('Error creating vacancy:', error)
      throw error
    }
  }

  // Update existing vacancy
  async updateVacancy(id: string, data: Partial<Vacancy>): Promise<Vacancy> {
    try {
      // In a real implementation, this would call an actual API
      const updatedVacancy: Vacancy = {
        id,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'draft',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientId: data.clientId || 'client-1',
        clientName: data.clientName || 'Иван Петров',
        clientPhone: data.clientPhone || '+7 (999) 123-45-67'
      }
      
      return updatedVacancy
    } catch (error) {
      console.error('Error updating vacancy:', error)
      throw error
    }
  }

  // Delete vacancy
  async deleteVacancy(id: string): Promise<void> {
    try {
      // In a real implementation, this would call an actual API
      console.log(`Deleting vacancy with ID: ${id}`)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error deleting vacancy:', error)
      throw error
    }
  }
}