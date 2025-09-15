import type { Vacancy } from '@/types/vacancy'

export interface FakeContactInfo {
  phone: string
  telegram: string
  whatsapp: string
}

export interface FakeVacancy extends Omit<Vacancy, 'clientPhone'> {
  clientPhone?: string
  contactInfo: FakeContactInfo
}

// Generate realistic fake contact information
const generateFakeContactInfo = (): FakeContactInfo => {
  const phoneNumbers = [
    '+7 (903) 123-45-67',
    '+7 (916) 234-56-78',
    '+7 (925) 345-67-89',
    '+7 (905) 456-78-90',
    '+7 (965) 567-89-01',
    '+7 (977) 678-90-12',
    '+7 (985) 789-01-23',
    '+7 (926) 890-12-34',
    '+7 (909) 901-23-45',
    '+7 (987) 012-34-56'
  ]

  const telegramHandles = [
    '@ai_specialist',
    '@ml_engineer',
    '@data_scientist',
    '@cv_expert',
    '@nlp_researcher',
    '@deep_learning',
    '@robotics_ai',
    '@quantum_ai',
    '@healthcare_ai',
    '@finance_ai'
  ]

  const whatsappNumbers = [
    '+7 903 123-45-67',
    '+7 916 234-56-78',
    '+7 925 345-67-89',
    '+7 905 456-78-90',
    '+7 965 567-89-01',
    '+7 977 678-90-12',
    '+7 985 789-01-23',
    '+7 926 890-12-34',
    '+7 909 901-23-45',
    '+7 987 012-34-56'
  ]

  const randomIndex = Math.floor(Math.random() * phoneNumbers.length)

  return {
    phone: phoneNumbers[randomIndex],
    telegram: telegramHandles[randomIndex],
    whatsapp: whatsappNumbers[randomIndex]
  }
}

// Generate 20 realistic fake vacancies
const generateFakeVacancies = (count: number): FakeVacancy[] => {
  const companies = [
    'TechCorp Solutions',
    'DataDriven Inc',
    'VisionTech LLC',
    'LanguageAI Systems',
    'ResearchLabs Ltd',
    'InnovateAI Co',
    'AutonomousTech',
    'DevOpsAI Solutions',
    'EthicsAI Group',
    'QuantumTech Labs',
    'RoboticsAI Inc',
    'SecureAI Systems',
    'HardwareAI Corp',
    'HealthAI Solutions',
    'FinTechAI Ltd',
    'AutoAI Technologies',
    'ClimateAI Research',
    'EduAI Platform',
    'GameAI Studios',
    'AgriAI Solutions'
  ]

  const titles = [
    'Senior Data Scientist',
    'Machine Learning Engineer',
    'Computer Vision Specialist',
    'NLP Engineer',
    'Deep Learning Researcher',
    'AI Product Manager',
    'Reinforcement Learning Engineer',
    'MLOps Engineer',
    'AI Ethics Specialist',
    'Quantum Computing Researcher',
    'Robotics AI Engineer',
    'AI Security Specialist',
    'AI Hardware Engineer',
    'AI for Healthcare Specialist',
    'AI for Finance Engineer',
    'AI for Autonomous Vehicles',
    'AI for Climate Modeling',
    'AI for Education Developer',
    'AI for Gaming Specialist',
    'AI for Agriculture Engineer'
  ]

  const descriptions = [
    'Ищем опытного Data Scientist для работы над проектами в области предиктивной аналитики. Необходим опыт с Python, TensorFlow, и большими данными.',
    'Требуется ML инженер для разработки рекомендательных систем. Опыт работы с PyTorch, Scikit-learn и обработкой естественного языка.',
    'Ищем специалиста по компьютерному зрению для разработки алгоритмов распознавания образов. Необходим опыт с OpenCV и нейронными сетями.',
    'Требуется инженер по обработке естественного языка для разработки чат-ботов. Опыт с BERT, GPT и языковыми моделями.',
    'Ищем исследователя в области глубокого обучения для работы над инновационными проектами. Публикации в топовых конференциях приветствуются.',
    'Требуется менеджер продукта в сфере ИИ для управления разработкой AI-решений. Опыт в области машинного обучения и управления командами.',
    'Ищем инженера по обучению с подкреплением для разработки автономных систем. Опыт с RLlib, Stable Baselines и симуляциями.',
    'Требуется MLOps инженер для автоматизации процессов развертывания моделей. Опыт с Docker, Kubernetes и CI/CD пайплайнами.',
    'Ищем специалиста по этике ИИ для обеспечения ответственной разработки алгоритмов. Опыт в области регулирования ИИ и философии.',
    'Требуется исследователь в области квантовых вычислений для разработки алгоритмов. Опыт с Qiskit, Cirq и квантовой физикой.',
    'Ищем инженера по ИИ для разработки алгоритмов управления роботами. Опыт с ROS, компьютерным зрением и сенсорами.',
    'Требуется специалист по безопасности ИИ для защиты моделей от атак. Опыт в области adversarial ML и кибербезопасности.',
    'Ищем инженера по аппаратному обеспечению для разработки специализированных чипов для ИИ. Опыт с FPGA и ASIC.',
    'Требуется специалист по ИИ в здравоохранении для разработки диагностических систем. Опыт с медицинскими данными и регулированием.',
    'Ищем инженера по ИИ для финансового сектора. Опыт с алгоритмической торговлей и риск-менеджментом.',
    'Требуется специалист по ИИ для автономных транспортных средств. Опыт с LiDAR, картографией и планированием маршрутов.',
    'Ищем специалиста по ИИ для климатических моделей. Опыт с большими научными данными и экологическим моделированием.',
    'Требуется разработчик ИИ для образовательных технологий. Опыт с адаптивным обучением и педагогическими подходами.',
    'Ищем специалиста по ИИ для игровой индустрии. Опыт с NPC поведением и процедурной генерацией контента.',
    'Требуется инженер по ИИ для сельскохозяйственных технологий. Опыт с дронами, спутниковыми данными и precision farming.'
  ]

  const fakeVacancies: FakeVacancy[] = []

  for (let i = 1; i <= count; i++) {
    const companyIndex = (i - 1) % companies.length
    const titleIndex = (i - 1) % titles.length
    const descriptionIndex = (i - 1) % descriptions.length

    fakeVacancies.push({
      id: `vacancy-${i}`,
      title: titles[titleIndex],
      description: descriptions[descriptionIndex],
      status: 'published',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      clientId: `client-${i}`,
      clientName: companies[companyIndex],
      contactInfo: generateFakeContactInfo()
    })
  }

  return fakeVacancies
}

// Store generated fake vacancies to maintain consistency
let fakeVacanciesCache: FakeVacancy[] | null = null

const getFakeVacancies = (): FakeVacancy[] => {
  if (!fakeVacanciesCache) {
    fakeVacanciesCache = generateFakeVacancies(20)
  }
  return fakeVacanciesCache
}

const getPaginatedVacancies = (
  page: number,
  limit: number = 7
): {
  vacancies: FakeVacancy[]
  total: number
  hasMore: boolean
} => {
  const allVacancies = getFakeVacancies()
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedVacancies = allVacancies.slice(startIndex, endIndex)
  
  return {
    vacancies: paginatedVacancies,
    total: allVacancies.length,
    hasMore: endIndex < allVacancies.length
  }
}

const getVacancyById = (id: string): FakeVacancy | undefined => {
  const allVacancies = getFakeVacancies()
  return allVacancies.find(vacancy => vacancy.id === id)
}

const generateFakeVacancyWithId = (id: string): FakeVacancy => {
  const companies = [
    'TechCorp Solutions',
    'DataDriven Inc',
    'VisionTech LLC',
    'LanguageAI Systems',
    'ResearchLabs Ltd'
  ]

  const titles = [
    'Senior Data Scientist',
    'Machine Learning Engineer',
    'Computer Vision Specialist',
    'NLP Engineer',
    'Deep Learning Researcher'
  ]

  const descriptions = [
    'Ищем опытного специалиста для работы над интересными проектами в области искусственного интеллекта.',
    'Требуется инженер с опытом в машинном обучении для разработки инновационных решений.',
    'Ищем эксперта по ИИ для участия в передовых исследованиях и разработках.',
    'Требуется специалист для создания интеллектуальных систем и алгоритмов.',
    'Ищем талантливого разработчика ИИ для работы над сложными техническими задачами.'
  ]

  const randomCompanyIndex = Math.floor(Math.random() * companies.length)
  const randomTitleIndex = Math.floor(Math.random() * titles.length)
  const randomDescriptionIndex = Math.floor(Math.random() * descriptions.length)

  return {
    id,
    title: titles[randomTitleIndex],
    description: descriptions[randomDescriptionIndex],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clientId: `client-${id}`,
    clientName: companies[randomCompanyIndex],
    contactInfo: generateFakeContactInfo()
  }
}

export { 
  generateFakeVacancies, 
  getPaginatedVacancies, 
  getFakeVacancies,
  getVacancyById,
  generateFakeVacancyWithId,
  FakeVacancy, 
  FakeContactInfo 
}