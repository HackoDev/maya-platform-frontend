import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vacancy, VacancyStoreState, VacancyPaginationResponse, VacancySearchFilters } from '@/types/vacancy'
import { VacancyService } from '@/services/vacancy'
import { useUserStore } from '@/stores/user'
import { getPaginatedVacancies, getVacancyById, generateFakeVacancyWithId, type FakeVacancy } from '@/services/fakeVacancyService'

export const useVacancyStore = defineStore('vacancy', () => {
  // State
  const vacancies = ref<Vacancy[]>([])
  const allVacancies = ref<Vacancy[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const showVacancyForm = ref(false)
  const showContactModal = ref(false)
  const selectedVacancy = ref<Vacancy | null>(null)
  const currentPage = ref(1)
  const hasMoreVacancies = ref(true)
  const searchFilters = ref<VacancySearchFilters>({
    query: '',
    page: 1,
    limit: 7, // Changed to 7 as per requirements
  })
  const hasSearched = ref(false)
  const lastSearchResults = ref<VacancyPaginationResponse | null>(null)

  // Service
  const vacancyService = new VacancyService()
  const userStore = useUserStore()

  // Getters
  const filteredVacancies = computed(() => {
    if (!searchQuery.value) {
      return vacancies.value
    }
    
    return vacancies.value.filter(vacancy => 
      vacancy.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vacancy.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const publishedVacancies = computed(() => {
    return allVacancies.value.filter(vacancy => vacancy.status === 'published')
  })

  const draftVacancies = computed(() => {
    return vacancies.value.filter(vacancy => vacancy.status === 'draft')
  })

  const closedVacancies = computed(() => {
    return vacancies.value.filter(vacancy => vacancy.status === 'closed')
  })

  const myVacancies = computed(() => {
    if (!userStore.currentUser) return []
    return vacancies.value.filter(vacancy => vacancy.clientId === userStore.currentUser!.id)
  })

  const canLoadMore = computed(() => {
    return hasMoreVacancies.value && !loadingMore.value && hasSearched.value
  })

  // Actions
  const fetchVacancies = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await vacancyService.getMyVacancies(searchQuery.value)
      vacancies.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch vacancies'
      console.error('Error fetching vacancies:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAllVacancies = async (page: number = 1, pageSize: number = 7) => { // Changed default pageSize to 7
    // If page is 1, we're doing initial load, otherwise loading more
    const isLoadingMore = page > 1
    
    if (isLoadingMore) {
      loadingMore.value = true
    } else {
      loading.value = true
    }
    
    error.value = null

    try {
      // Simulate network delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use fake data instead of real API
      const fakeResults = getPaginatedVacancies(page, pageSize)
      
      // Convert FakeVacancy to Vacancy for compatibility and store fake data
      const convertedVacancies = fakeResults.vacancies.map(fakeVacancy => ({
        id: fakeVacancy.id,
        title: fakeVacancy.title,
        description: fakeVacancy.description,
        status: fakeVacancy.status,
        createdAt: fakeVacancy.createdAt,
        updatedAt: fakeVacancy.updatedAt,
        clientId: fakeVacancy.clientId,
        clientName: fakeVacancy.clientName,
        clientPhone: fakeVacancy.contactInfo.phone, // Use phone from contactInfo
        _fakeData: fakeVacancy // Store the full fake data for contact info
      }))
      
      if (isLoadingMore) {
        // Append new data to existing data
        allVacancies.value = [...allVacancies.value, ...convertedVacancies]
        currentPage.value = page
        hasMoreVacancies.value = fakeResults.hasMore
      } else {
        // Replace existing data
        allVacancies.value = convertedVacancies
        currentPage.value = 1
        hasMoreVacancies.value = fakeResults.hasMore
        hasSearched.value = true
      }
      
      // Convert FakeVacancy to Vacancy for compatibility (for lastSearchResults)
      const convertedResults: VacancyPaginationResponse = {
        vacancies: convertedVacancies.map(vacancy => ({
          id: vacancy.id,
          title: vacancy.title,
          description: vacancy.description,
          status: vacancy.status,
          createdAt: vacancy.createdAt,
          updatedAt: vacancy.updatedAt,
          clientId: vacancy.clientId,
          clientName: vacancy.clientName,
          clientPhone: vacancy.clientPhone
        })),
        page: page,
        pageSize: pageSize,
        total: fakeResults.total,
        hasMore: fakeResults.hasMore
      }
      
      lastSearchResults.value = convertedResults
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch vacancies'
      console.error('Error fetching all vacancies:', err)
    } finally {
      if (isLoadingMore) {
        loadingMore.value = false
      } else {
        loading.value = false
      }
    }
  }

  const searchVacancies = async (filters?: Partial<VacancySearchFilters>, resetResults = true) => {
    if (filters) {
      Object.assign(searchFilters.value, filters)
    }

    // Reset for new search
    if (resetResults) {
      allVacancies.value = []
      currentPage.value = 1
      hasMoreVacancies.value = true
      searchFilters.value.page = 1
    }

    // Set appropriate loading state
    if (resetResults) {
      loading.value = true
    } else {
      loadingMore.value = true
    }
    
    error.value = null

    try {
      // Simulate network delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use fake data instead of real API
      const fakeResults = getPaginatedVacancies(
        currentPage.value,
        searchFilters.value.limit || 7
      )

      // Convert FakeVacancy to Vacancy for compatibility and store fake data
      const convertedVacancies = fakeResults.vacancies.map(fakeVacancy => ({
        id: fakeVacancy.id,
        title: fakeVacancy.title,
        description: fakeVacancy.description,
        status: fakeVacancy.status,
        createdAt: fakeVacancy.createdAt,
        updatedAt: fakeVacancy.updatedAt,
        clientId: fakeVacancy.clientId,
        clientName: fakeVacancy.clientName,
        clientPhone: fakeVacancy.contactInfo.phone, // Use phone from contactInfo
        _fakeData: fakeVacancy // Store the full fake data for contact info
      }))

      if (resetResults) {
        allVacancies.value = convertedVacancies
      } else {
        // Append for infinite scroll
        allVacancies.value.push(...convertedVacancies)
      }

      // Convert FakeVacancy to Vacancy for compatibility (for lastSearchResults)
      const convertedResults: VacancyPaginationResponse = {
        vacancies: convertedVacancies.map(vacancy => ({
          id: vacancy.id,
          title: vacancy.title,
          description: vacancy.description,
          status: vacancy.status,
          createdAt: vacancy.createdAt,
          updatedAt: vacancy.updatedAt,
          clientId: vacancy.clientId,
          clientName: vacancy.clientName,
          clientPhone: vacancy.clientPhone
        })),
        page: currentPage.value,
        pageSize: searchFilters.value.limit || 7,
        total: fakeResults.total,
        hasMore: fakeResults.hasMore
      }

      lastSearchResults.value = convertedResults
      hasSearched.value = true
      hasMoreVacancies.value = fakeResults.hasMore
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search vacancies'
      if (resetResults) {
        allVacancies.value = []
        lastSearchResults.value = null
      }
    } finally {
      if (resetResults) {
        loading.value = false
      } else {
        loadingMore.value = false
      }
    }
  }

  const loadMoreVacancies = async () => {
    if (!canLoadMore.value) return
    
    // Set loadingMore to true before incrementing page
    loadingMore.value = true
    currentPage.value++

    try {
      await searchVacancies(
        {
          page: currentPage.value,
        },
        false
      ) // Don't reset results
    } catch (err) {
      // Revert page increment on error
      currentPage.value--
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки дополнительных результатов'
    } finally {
      loadingMore.value = false
    }
  }

  const createVacancy = async (vacancyData: Partial<Vacancy>) => {
    loading.value = true
    error.value = null

    try {
      // Add client information from current user
      const userData = userStore.currentUser
      if (userData) {
        vacancyData.clientId = userData.id
        vacancyData.clientName = `${userData.firstName} ${userData.lastName}`
        // In a real implementation, we would get the phone from user profile
        vacancyData.clientPhone = vacancyData.clientPhone || '+7 (999) 123-45-67'
      }

      const newVacancy = await vacancyService.createVacancy(vacancyData)
      vacancies.value.push(newVacancy)
      return newVacancy
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create vacancy'
      console.error('Error creating vacancy:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVacancy = async (id: string, vacancyData: Partial<Vacancy>) => {
    loading.value = true
    error.value = null

    try {
      const updatedVacancy = await vacancyService.updateVacancy(id, vacancyData)
      
      // Update the vacancy in the list
      const index = vacancies.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vacancies.value[index] = updatedVacancy
      }
      
      // Also update in allVacancies if it exists there
      const allIndex = allVacancies.value.findIndex(v => v.id === id)
      if (allIndex !== -1) {
        allVacancies.value[allIndex] = updatedVacancy
      }
      
      return updatedVacancy
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update vacancy'
      console.error('Error updating vacancy:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteVacancy = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await vacancyService.deleteVacancy(id)
      
      // Remove the vacancy from the list
      vacancies.value = vacancies.value.filter(vacancy => vacancy.id !== id)
      
      // Also remove from allVacancies if it exists there
      allVacancies.value = allVacancies.value.filter(vacancy => vacancy.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete vacancy'
      console.error('Error deleting vacancy:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearError = () => {
    error.value = null
  }

  const openVacancyForm = (vacancy?: Vacancy) => {
    selectedVacancy.value = vacancy || null
    showVacancyForm.value = true
  }

  const closeVacancyForm = () => {
    showVacancyForm.value = false
    selectedVacancy.value = null
  }

  const openContactModal = (vacancy: Vacancy) => {
    // Find the fake vacancy to get the full contact info
    const fakeVacancy = getVacancyById(vacancy.id)
    if (fakeVacancy) {
      // Update the vacancy with full contact info
      selectedVacancy.value = {
        ...vacancy,
        clientPhone: fakeVacancy.contactInfo.phone
      } as Vacancy
      // Store the fake vacancy data for use in modals
      ;(selectedVacancy.value as any)._fakeData = fakeVacancy
    } else {
      selectedVacancy.value = vacancy
    }
    showContactModal.value = true
  }

  const closeContactModal = () => {
    showContactModal.value = false
    selectedVacancy.value = null
  }

  const clearSearch = () => {
    searchFilters.value = {
      query: '',
      page: 1,
      limit: 7, // Changed to 7 as per requirements
    }
    allVacancies.value = []
    lastSearchResults.value = null
    hasSearched.value = false
    error.value = null
    currentPage.value = 1
    hasMoreVacancies.value = true
  }

  return {
    // State
    vacancies,
    allVacancies,
    loading,
    loadingMore,
    error,
    searchQuery,
    showVacancyForm,
    showContactModal,
    selectedVacancy,
    currentPage,
    hasMoreVacancies,
    searchFilters,
    hasSearched,
    lastSearchResults,

    // Getters
    filteredVacancies,
    publishedVacancies,
    draftVacancies,
    closedVacancies,
    myVacancies,
    canLoadMore,

    // Actions
    fetchVacancies,
    fetchAllVacancies,
    searchVacancies,
    loadMoreVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    setSearchQuery,
    clearError,
    openVacancyForm,
    closeVacancyForm,
    openContactModal,
    closeContactModal,
    clearSearch
  }
})