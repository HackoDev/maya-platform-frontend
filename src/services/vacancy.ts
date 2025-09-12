import type { Vacancy } from '@/types/vacancy'
import { useApi } from '@/composables/useApi'
import { useUserStore } from '@/stores/user'

export class VacancyService {
  private api = useApi()
  private userStore = useUserStore()

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