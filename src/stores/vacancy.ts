import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vacancy, VacancyStoreState } from '@/types/vacancy'
import { VacancyService } from '@/services/vacancy'
import { useUserStore } from '@/stores/user'

export const useVacancyStore = defineStore('vacancy', () => {
  // State
  const vacancies = ref<Vacancy[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const showVacancyForm = ref(false)
  const showContactModal = ref(false)
  const selectedVacancy = ref<Vacancy | null>(null)

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
    return vacancies.value.filter(vacancy => vacancy.status === 'published')
  })

  const draftVacancies = computed(() => {
    return vacancies.value.filter(vacancy => vacancy.status === 'draft')
  })

  const closedVacancies = computed(() => {
    return vacancies.value.filter(vacancy => vacancy.status === 'closed')
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
    selectedVacancy.value = vacancy
    showContactModal.value = true
  }

  const closeContactModal = () => {
    showContactModal.value = false
    selectedVacancy.value = null
  }

  return {
    // State
    vacancies,
    loading,
    error,
    searchQuery,
    showVacancyForm,
    showContactModal,
    selectedVacancy,

    // Getters
    filteredVacancies,
    publishedVacancies,
    draftVacancies,
    closedVacancies,

    // Actions
    fetchVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    setSearchQuery,
    clearError,
    openVacancyForm,
    closeVacancyForm,
    openContactModal,
    closeContactModal
  }
})