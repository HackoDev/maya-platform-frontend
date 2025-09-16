import type { User } from '@/types'
import type { Portfolio, Specialist } from '@/types/platform'
import type { Vacancy } from '@/types/vacancy'
import type { SupportTicket, SupportMessage } from '@/types'

/**
 * Generate a unique ID for testing
 */
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Create a mock user for testing
 */
export const createMockUser = (overrides: Partial<User> = {}): User => {
  return {
    id: generateId(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userType: 'client',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock specialist for testing
 */
export const createMockSpecialist = (overrides: Partial<Specialist> = {}): Specialist => {
  return {
    id: generateId(),
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    userType: 'specialist',
    avatar: 'https://via.placeholder.com/150',
    title: 'Frontend Developer',
    specializations: ['React', 'TypeScript', 'Vue.js'],
    experience: 5,
    rating: 4.8,
    reviewCount: 24,
    hourlyRate: 50,
    isAvailable: true,
    location: 'Remote',
    bio: 'Experienced frontend developer with expertise in modern web technologies.',
    skills: ['JavaScript', 'React', 'Vue.js', 'TypeScript', 'CSS', 'HTML'],
    languages: ['English', 'Russian'],
    portfolio: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock portfolio for testing
 */
export const createMockPortfolio = (overrides: Partial<Portfolio> = {}): Portfolio => {
  return {
    id: generateId(),
    title: 'E-commerce Website',
    description: 'Modern e-commerce platform built with React and Node.js',
    images: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    projectUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/project',
    category: 'web-development',
    duration: '3 months',
    client: 'TechCorp Inc.',
    year: 2023,
    featured: true,
    specialistId: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock vacancy for testing
 */
export const createMockVacancy = (overrides: Partial<Vacancy> = {}): Vacancy => {
  return {
    id: generateId(),
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced frontend developer to join our team.',
    company: 'TechCorp',
    location: 'Remote',
    type: 'full-time',
    experience: 'senior',
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD',
      period: 'yearly',
    },
    skills: ['React', 'TypeScript', 'Vue.js', 'JavaScript'],
    requirements: [
      '5+ years of frontend development experience',
      'Strong knowledge of React and TypeScript',
      'Experience with modern build tools',
    ],
    benefits: [
      'Competitive salary',
      'Remote work',
      'Health insurance',
      'Professional development',
    ],
    isActive: true,
    isRemote: true,
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    clientId: generateId(),
    applicationsCount: 12,
    viewsCount: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock support ticket for testing
 */
export const createMockSupportTicket = (overrides: Partial<SupportTicket> = {}): SupportTicket => {
  return {
    id: generateId(),
    title: 'Login Issue',
    description: 'I cannot log into my account',
    status: 'open',
    priority: 'medium',
    category: 'technical',
    userId: generateId(),
    assignedTo: generateId(),
    messages: [],
    attachments: [],
    tags: ['login', 'authentication'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock support message for testing
 */
export const createMockSupportMessage = (overrides: Partial<SupportMessage> = {}): SupportMessage => {
  return {
    id: generateId(),
    ticketId: generateId(),
    content: 'Thank you for contacting support. We will help you resolve this issue.',
    authorId: generateId(),
    authorName: 'Support Agent',
    authorType: 'agent',
    attachments: [],
    isInternal: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create multiple mock items of a specific type
 */
export const createMockArray = <T>(
  factory: (overrides?: any) => T,
  count: number,
  overrides: any[] = []
): T[] => {
  return Array.from({ length: count }, (_, index) => 
    factory(overrides[index] || {})
  )
}

/**
 * Create a mock portfolio with specialist for testing
 */
export const createMockPortfolioWithSpecialist = (
  portfolioOverrides: Partial<Portfolio> = {},
  specialistOverrides: Partial<Specialist> = {}
): { portfolio: Portfolio; specialist: Specialist } => {
  const specialist = createMockSpecialist(specialistOverrides)
  const portfolio = createMockPortfolio({
    specialistId: specialist.id,
    ...portfolioOverrides,
  })

  return { portfolio, specialist }
}

/**
 * Create mock data for platform dashboard
 */
export const createMockPlatformData = (userType: 'client' | 'specialist' = 'client') => {
  if (userType === 'client') {
    return {
      portfolios: createMockArray(() => createMockPortfolioWithSpecialist(), 6),
      vacancies: [],
    }
  } else {
    return {
      portfolios: [],
      vacancies: createMockArray(createMockVacancy, 6),
    }
  }
}

/**
 * Mock API responses
 */
export const createMockApiResponse = <T>(data: T, success = true) => {
  return {
    data,
    success,
    message: success ? 'Success' : 'Error',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Create mock error response
 */
export const createMockErrorResponse = (message = 'Something went wrong') => {
  return createMockApiResponse(null, false)
}