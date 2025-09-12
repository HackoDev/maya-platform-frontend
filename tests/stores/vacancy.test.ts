import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useVacancyStore } from '@/stores/vacancy'
import { useUserStore } from '@/stores/user'

describe('VacancyStore', () => {
  beforeEach(() => {
    // Create a new pinia instance and make it active
    setActivePinia(createPinia())
  })

  it('initializes with correct default state', () => {
    const vacancyStore = useVacancyStore()
    
    expect(vacancyStore.vacancies).toEqual([])
    expect(vacancyStore.loading).toBe(false)
    expect(vacancyStore.error).toBeNull()
    expect(vacancyStore.searchQuery).toBe('')
    expect(vacancyStore.showVacancyForm).toBe(false)
    expect(vacancyStore.showContactModal).toBe(false)
    expect(vacancyStore.selectedVacancy).toBeNull()
  })

  it('computes filtered vacancies correctly', async () => {
    const vacancyStore = useVacancyStore()
    
    // Mock the service method directly
    const mockVacancies = [
      {
        id: '1',
        title: 'AI Specialist',
        description: 'AI job',
        status: 'published',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        clientId: 'client-1',
        clientName: 'Test Client',
        clientPhone: '+7 (999) 123-45-67'
      },
      {
        id: '2',
        title: 'ML Engineer',
        description: 'ML job',
        status: 'draft',
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        clientId: 'client-1',
        clientName: 'Test Client',
        clientPhone: '+7 (999) 123-45-67'
      }
    ]
    
    vi.spyOn(vacancyStore.vacancyService, 'getMyVacancies').mockResolvedValue(mockVacancies)
    
    await vacancyStore.fetchVacancies()
    
    // Test without search query
    expect(vacancyStore.filteredVacancies).toHaveLength(2)
    
    // Test with search query
    vacancyStore.setSearchQuery('AI')
    expect(vacancyStore.filteredVacancies).toHaveLength(1)
    expect(vacancyStore.filteredVacancies[0].title).toBe('AI Specialist')
  })

  it('computes status-specific vacancies correctly', async () => {
    const vacancyStore = useVacancyStore()
    
    // Mock the service method directly
    const mockVacancies = [
      {
        id: '1',
        title: 'Published Vacancy',
        description: 'Published job',
        status: 'published',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        clientId: 'client-1',
        clientName: 'Test Client',
        clientPhone: '+7 (999) 123-45-67'
      },
      {
        id: '2',
        title: 'Draft Vacancy',
        description: 'Draft job',
        status: 'draft',
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        clientId: 'client-1',
        clientName: 'Test Client',
        clientPhone: '+7 (999) 123-45-67'
      },
      {
        id: '3',
        title: 'Closed Vacancy',
        description: 'Closed job',
        status: 'closed',
        createdAt: '2023-01-03',
        updatedAt: '2023-01-03',
        clientId: 'client-1',
        clientName: 'Test Client',
        clientPhone: '+7 (999) 123-45-67'
      }
    ]
    
    vi.spyOn(vacancyStore.vacancyService, 'getMyVacancies').mockResolvedValue(mockVacancies)
    
    await vacancyStore.fetchVacancies()
    
    expect(vacancyStore.publishedVacancies).toHaveLength(1)
    expect(vacancyStore.publishedVacancies[0].title).toBe('Published Vacancy')
    
    expect(vacancyStore.draftVacancies).toHaveLength(1)
    expect(vacancyStore.draftVacancies[0].title).toBe('Draft Vacancy')
    
    expect(vacancyStore.closedVacancies).toHaveLength(1)
    expect(vacancyStore.closedVacancies[0].title).toBe('Closed Vacancy')
  })

  it('opens and closes vacancy form correctly', () => {
    const vacancyStore = useVacancyStore()
    
    const mockVacancy = {
      id: '1',
      title: 'Test Vacancy',
      description: 'Test Description',
      status: 'draft' as const,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    }
    
    // Test opening form for new vacancy
    vacancyStore.openVacancyForm()
    expect(vacancyStore.showVacancyForm).toBe(true)
    expect(vacancyStore.selectedVacancy).toBeNull()
    
    // Test closing form
    vacancyStore.closeVacancyForm()
    expect(vacancyStore.showVacancyForm).toBe(false)
    expect(vacancyStore.selectedVacancy).toBeNull()
    
    // Test opening form for existing vacancy
    vacancyStore.openVacancyForm(mockVacancy)
    expect(vacancyStore.showVacancyForm).toBe(true)
    expect(vacancyStore.selectedVacancy).toEqual(mockVacancy)
  })

  it('opens and closes contact modal correctly', () => {
    const vacancyStore = useVacancyStore()
    
    const mockVacancy = {
      id: '1',
      title: 'Test Vacancy',
      description: 'Test Description',
      status: 'draft' as const,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    }
    
    // Test opening contact modal
    vacancyStore.openContactModal(mockVacancy)
    expect(vacancyStore.showContactModal).toBe(true)
    expect(vacancyStore.selectedVacancy).toEqual(mockVacancy)
    
    // Test closing contact modal
    vacancyStore.closeContactModal()
    expect(vacancyStore.showContactModal).toBe(false)
    expect(vacancyStore.selectedVacancy).toBeNull()
  })

  it('creates vacancy with client information', async () => {
    const vacancyStore = useVacancyStore()
    const userStore = useUserStore()
    
    // Set up mock user
    userStore.currentUser = {
      id: 'client-1',
      name: 'Test Client',
      firstName: 'Test',
      lastName: 'Client',
      email: 'client@example.com',
      role: 'user',
      userType: 'client',
      isActive: true,
      lastLoginAt: '2023-01-01',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }
    
    // Mock the service method directly
    const mockCreatedVacancy = {
      id: 'new-1',
      title: 'New Vacancy',
      description: 'New Description',
      status: 'draft',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    }
    
    vi.spyOn(vacancyStore.vacancyService, 'createVacancy').mockResolvedValue(mockCreatedVacancy)
    
    // Create vacancy
    const vacancyData = {
      title: 'New Vacancy',
      description: 'New Description',
      status: 'draft' as const
    }
    
    const result = await vacancyStore.createVacancy(vacancyData)
    
    expect(result).toEqual(mockCreatedVacancy)
    expect(vacancyStore.vacancies).toContainEqual(mockCreatedVacancy)
    expect(vacancyStore.loading).toBe(false)
    expect(vacancyStore.error).toBeNull()
  })
})