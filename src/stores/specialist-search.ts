import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  SearchFilters,
  SearchResults,
  SkillOption,
  SpecialistProfile,
  InfiniteScrollState,
} from '@/types/specialist-search'
import { SpecialistSearchService } from '@/services/specialist-search'

export const useSpecialistSearchStore = defineStore('specialistSearch', () => {
  // State
  const searchFilters = ref<SearchFilters>({
    query: '',
    skills: [],
    page: 1,
    limit: 5,
  })

  const allSpecialists = ref<SpecialistProfile[]>([])
  const availableSkills = ref<SkillOption[]>([])
  const loading = ref(false)
  const skillsLoading = ref(false)
  const error = ref<string | null>(null)
  const hasSearched = ref(false)

  // Infinite scroll state
  const infiniteScrollState = ref<InfiniteScrollState>({
    isLoadingMore: false,
    hasReachedEnd: false,
    currentPage: 1,
    pageSize: 5,
  })

  // Last search results metadata
  const lastSearchResults = ref<SearchResults | null>(null)

  // Service instance
  const searchService = new SpecialistSearchService()

  // Getters
  const hasResults = computed(() => {
    return allSpecialists.value.length > 0
  })

  const selectedSkillLabels = computed(() => {
    return searchFilters.value.skills.map(skillKey => {
      const skill = availableSkills.value.find(s => s.key === skillKey)
      return skill ? skill.label : skillKey
    })
  })

  const searchSummary = computed(() => {
    if (!hasSearched.value) return ''

    const total = lastSearchResults.value?.total || 0
    const filters = []

    if (searchFilters.value.query) {
      filters.push(`"${searchFilters.value.query}"`)
    }

    if (searchFilters.value.skills.length > 0) {
      filters.push(`${searchFilters.value.skills.length} навыков`)
    }

    const filterText = filters.length > 0 ? ` по фильтрам: ${filters.join(', ')}` : ''
    return `Найдено ${total} специалистов${filterText}`
  })

  const availableSpecialistsCount = computed(() => {
    return allSpecialists.value.filter(s => s.status === 'available').length
  })

  const canLoadMore = computed(() => {
    return (
      !infiniteScrollState.value.hasReachedEnd &&
      !infiniteScrollState.value.isLoadingMore &&
      hasSearched.value
    )
  })

  // Actions
  const searchSpecialists = async (
    filters?: Partial<SearchFilters>,
    resetResults = true
  ): Promise<void> => {
    if (filters) {
      Object.assign(searchFilters.value, filters)
    }

    // Reset for new search
    if (resetResults) {
      allSpecialists.value = []
      infiniteScrollState.value.currentPage = 1
      infiniteScrollState.value.hasReachedEnd = false
      searchFilters.value.page = 1
    }

    loading.value = true
    error.value = null

    try {
      const results = await searchService.searchSpecialists({
        ...searchFilters.value,
        page: infiniteScrollState.value.currentPage,
      })

      if (resetResults) {
        allSpecialists.value = results.specialists
      } else {
        // Append for infinite scroll
        allSpecialists.value.push(...results.specialists)
      }

      lastSearchResults.value = results
      hasSearched.value = true

      // Update infinite scroll state
      infiniteScrollState.value.hasReachedEnd = !results.hasMore
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка поиска специалистов'
      if (resetResults) {
        allSpecialists.value = []
        lastSearchResults.value = null
      }
    } finally {
      loading.value = false
    }
  }

  const loadMoreSpecialists = async (): Promise<void> => {
    if (!canLoadMore.value) return

    infiniteScrollState.value.isLoadingMore = true
    infiniteScrollState.value.currentPage++

    try {
      await searchSpecialists(
        {
          page: infiniteScrollState.value.currentPage,
        },
        false
      ) // Don't reset results
    } catch (err) {
      // Revert page increment on error
      infiniteScrollState.value.currentPage--
      error.value =
        err instanceof Error ? err.message : 'Ошибка загрузки дополнительных результатов'
    } finally {
      infiniteScrollState.value.isLoadingMore = false
    }
  }

  const loadAvailableSkills = async (): Promise<void> => {
    if (availableSkills.value.length > 0) return // Already loaded

    skillsLoading.value = true

    try {
      const skills = await searchService.getAvailableSkills()
      availableSkills.value = skills
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки навыков'
    } finally {
      skillsLoading.value = false
    }
  }

  const updateFilters = (filters: Partial<SearchFilters>): void => {
    Object.assign(searchFilters.value, filters)
  }

  const clearSearch = (): void => {
    searchFilters.value = {
      query: '',
      skills: [],
      page: 1,
      limit: 5,
    }
    allSpecialists.value = []
    lastSearchResults.value = null
    hasSearched.value = false
    error.value = null

    // Reset infinite scroll state
    infiniteScrollState.value = {
      isLoadingMore: false,
      hasReachedEnd: false,
      currentPage: 1,
      pageSize: 5,
    }
  }

  const addSkillFilter = (skillKey: string): void => {
    if (!searchFilters.value.skills.includes(skillKey)) {
      searchFilters.value.skills.push(skillKey)
    }
  }

  const removeSkillFilter = (skillKey: string): void => {
    const index = searchFilters.value.skills.indexOf(skillKey)
    if (index > -1) {
      searchFilters.value.skills.splice(index, 1)
    }
  }

  const toggleSkillFilter = (skillKey: string): void => {
    if (searchFilters.value.skills.includes(skillKey)) {
      removeSkillFilter(skillKey)
    } else {
      addSkillFilter(skillKey)
    }
  }

  return {
    // State
    searchFilters,
    allSpecialists,
    availableSkills,
    loading,
    skillsLoading,
    error,
    hasSearched,
    infiniteScrollState,
    lastSearchResults,

    // Getters
    hasResults,
    selectedSkillLabels,
    searchSummary,
    availableSpecialistsCount,
    canLoadMore,

    // Actions
    searchSpecialists,
    loadMoreSpecialists,
    loadAvailableSkills,
    updateFilters,
    clearSearch,
    addSkillFilter,
    removeSkillFilter,
    toggleSkillFilter,
  }
})