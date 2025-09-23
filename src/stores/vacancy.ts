import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vacancy, VacancyPaginationResponse, VacancySearchFilters } from '@/types/vacancy'
import { vacancyApiClient } from '@/services/vacancyApiClient'
import { useUserStore } from '@/stores/user'
import { getVacancyById } from '@/services/fakeVacancyService'

export const useVacancyStore = defineStore('vacancy', () => {
  // State
  const vacancies = ref<Vacancy[]>([])
  const allVacancies = ref<Vacancy[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const isActiveQuery = ref<string>('')
  const showVacancyForm = ref(false)
  const showContactModal = ref(false)
  const selectedVacancy = ref<Vacancy | null>(null)
  const currentPage = ref(1)
  const hasMoreVacancies = ref(true)
  const searchFilters = ref<VacancySearchFilters>({
    query: '',
    page: 1,
    limit: 7,
    isActive: undefined,
  })
  const hasSearched = ref(false)
  const lastSearchResults = ref<VacancyPaginationResponse | null>(null)

  // Service
  const userStore = useUserStore()
  
  // Initialize the API client with stored token
  vacancyApiClient.initializeWithStoredToken()

  // Getters
  const filteredVacancies = computed(() => {
    if (!searchQuery.value) {
      return vacancies.value
    }
    
    return vacancies.value
  })

  const publishedVacancies = computed(() => {
    return allVacancies.value.filter(vacancy => vacancy.isActive === true)
  })

  const closedVacancies = computed(() => {
    return vacancies.value.filter(vacancy => vacancy.isActive === false)
  })

  const myVacancies = computed(() => {
    if (!userStore.currentUser) return []
    return vacancies.value.filter(vacancy => vacancy.clientId === userStore.currentUser!.id.toString())
  })

  const canLoadMore = computed(() => {
    return hasMoreVacancies.value && !loadingMore.value && hasSearched.value
  })

  // Actions
  const fetchVacancies = async () => {
    loading.value = true
    error.value = null

    console.log(`fetchVacancies: searchQuery.value: ${searchQuery.value}, isActiveQuery.value: ${isActiveQuery.value}`)

    try {
      const response = await vacancyApiClient.getMyVacancies({
        limit: 100, // Get all my vacancies
        offset: 0,
        search: searchQuery.value,
        isActive: isActiveQuery.value,
      })
      vacancies.value = response.vacancies
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
      const offset = (page - 1) * pageSize
      const response = await vacancyApiClient.getVacancies({
        limit: pageSize,
        offset: offset,
      })
      
      if (isLoadingMore) {
        // Append new data to existing data
        allVacancies.value = [...allVacancies.value, ...response.vacancies]
        currentPage.value = page
        hasMoreVacancies.value = response.hasMore
      } else {
        // Replace existing data
        allVacancies.value = response.vacancies
        currentPage.value = 1
        hasMoreVacancies.value = response.hasMore
        hasSearched.value = true
      }
      
      lastSearchResults.value = response
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
      const offset = (currentPage.value - 1) * (searchFilters.value.limit || 7)
      const response = await vacancyApiClient.searchVacancies({
        limit: searchFilters.value.limit || 7,
        offset: offset,
        isActive: searchFilters.value.isActive,
      })

      if (resetResults) {
        allVacancies.value = response.vacancies
      } else {
        // Append for infinite scroll
        allVacancies.value.push(...response.vacancies)
      }

      lastSearchResults.value = response
      hasSearched.value = true
      hasMoreVacancies.value = response.hasMore
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
      const newVacancy = await vacancyApiClient.createVacancy(vacancyData)
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
      const updatedVacancy = await vacancyApiClient.updateVacancy(id, vacancyData)
      
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
      await vacancyApiClient.deleteVacancy(id)
      
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

  const setIsActiveQuery = (isActive: string) => {
    console.log('setIsActiveQuery', isActive)
    isActiveQuery.value = isActive
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
    // Use real API data if available, fallback to fake data for backward compatibility
    if (vacancy.author && vacancy.author.phone) {
      // Use real API data
      selectedVacancy.value = {
        ...vacancy,
        clientPhone: vacancy.author.phone,
      }
    } else {
      // Fallback to fake data for backward compatibility
      const fakeVacancy = getVacancyById(vacancy.id)
      if (fakeVacancy) {
        selectedVacancy.value = {
          ...vacancy,
          clientPhone: fakeVacancy.contactInfo.phone,
          _fakeData: fakeVacancy,
        } as Vacancy
      } else {
        selectedVacancy.value = vacancy
      }
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
    isActiveQuery,
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
    setIsActiveQuery,
    clearError,
    openVacancyForm,
    closeVacancyForm,
    openContactModal,
    closeContactModal,
    clearSearch
  }
})