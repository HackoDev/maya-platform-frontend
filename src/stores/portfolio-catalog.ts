import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { portfoliosApi } from '@/services/portfoliosApiClient'
import type { Skill, Specialization, Service } from '@/types/portfolio'

export const usePortfolioCatalogStore = defineStore('portfolioCatalog', () => {
  const skills = ref<Skill[]>([])
  const specializations = ref<Specialization[]>([])
  const services = ref<Service[]>([])

  const isLoading = ref(false)
  const isInitialized = ref(false)
  const error = ref<string | null>(null)

  const hasData = computed(() => {
    return skills.value.length > 0 || specializations.value.length > 0 || services.value.length > 0
  })

  const initialize = async () => {
    if (isInitialized.value || isLoading.value) return
    await fetchCatalog()
  }

  const fetchCatalog = async () => {
    try {
      isLoading.value = true
      error.value = null

      const [skillsResponse, specializationsResponse, servicesResponse] = await Promise.all([
        portfoliosApi.getSkills({ limit: 100 }),
        portfoliosApi.getSpecializations({ limit: 100 }),
        portfoliosApi.getServices({ limit: 100 })
      ])

      skills.value = skillsResponse.skills
      specializations.value = specializationsResponse.specializations
      services.value = servicesResponse.services

      isInitialized.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load portfolio catalog'
      // Keep initialized flag to false so future attempts can retry
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    skills,
    specializations,
    services,
    isLoading,
    isInitialized,
    error,

    // getters
    hasData,

    // actions
    initialize,
    fetchCatalog,
  }
})



