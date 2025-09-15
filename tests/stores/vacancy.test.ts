import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVacancyStore } from '@/stores/vacancy'

describe('vacancyStore', () => {
  beforeEach(() => {
    // Create a new pinia instance before each test
    setActivePinia(createPinia())
  })

  it('should initialize with correct default values', () => {
    const store = useVacancyStore()
    
    expect(store.vacancies).toEqual([])
    expect(store.allVacancies).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.loadingMore).toBe(false)
    expect(store.error).toBeNull()
    expect(store.searchQuery).toBe('')
    expect(store.showVacancyForm).toBe(false)
    expect(store.showContactModal).toBe(false)
    expect(store.selectedVacancy).toBeNull()
    expect(store.currentPage).toBe(1)
    expect(store.hasMoreVacancies).toBe(true)
    expect(store.searchFilters).toEqual({
      query: '',
      page: 1,
      limit: 7
    })
    expect(store.hasSearched).toBe(false)
    expect(store.lastSearchResults).toBeNull()
  })

  it('should search vacancies with fake data', async () => {
    const store = useVacancyStore()
    
    await store.searchVacancies()
    
    expect(store.allVacancies).toHaveLength(7)
    expect(store.hasSearched).toBe(true)
    expect(store.lastSearchResults).not.toBeNull()
    expect(store.lastSearchResults?.total).toBe(20)
    expect(store.lastSearchResults?.hasMore).toBe(true)
  })

  it('should load more vacancies', async () => {
    const store = useVacancyStore()
    
    // First load
    await store.searchVacancies()
    const firstBatchCount = store.allVacancies.length
    
    // Load more
    await store.loadMoreVacancies()
    const secondBatchCount = store.allVacancies.length
    
    expect(secondBatchCount).toBeGreaterThan(firstBatchCount)
    expect(store.currentPage).toBe(2)
  })

  it('should clear search correctly', async () => {
    const store = useVacancyStore()
    
    // Perform a search first
    await store.searchVacancies()
    expect(store.hasSearched).toBe(true)
    expect(store.allVacancies.length).toBeGreaterThan(0)
    
    // Clear search
    store.clearSearch()
    
    expect(store.searchFilters).toEqual({
      query: '',
      page: 1,
      limit: 7
    })
    expect(store.allVacancies).toEqual([])
    expect(store.lastSearchResults).toBeNull()
    expect(store.hasSearched).toBe(false)
    expect(store.error).toBeNull()
    expect(store.currentPage).toBe(1)
    expect(store.hasMoreVacancies).toBe(true)
  })

  it('should open and close contact modal', () => {
    const store = useVacancyStore()
    
    // Create a mock vacancy
    const mockVacancy = {
      id: '1',
      title: 'Test Vacancy',
      description: 'Test Description',
      status: 'published' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    }
    
    // Open contact modal
    store.openContactModal(mockVacancy)
    expect(store.showContactModal).toBe(true)
    expect(store.selectedVacancy).toEqual(mockVacancy)
    
    // Close contact modal
    store.closeContactModal()
    expect(store.showContactModal).toBe(false)
    expect(store.selectedVacancy).toBeNull()
  })
})
