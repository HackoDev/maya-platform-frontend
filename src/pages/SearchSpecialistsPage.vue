<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-3 mb-4">
          <MagnifyingGlassIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Поиск специалистов
          </h1>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Найдите идеального специалиста для ваших задач с помощью нейросетей
        </p>
      </div>

      <!-- Search Filters -->
      <SpecialistSearchFilters
        :loading="searchStore.loading"
        @search="handleSearch"
        @clear="handleClearSearch"
      />

      <!-- Search Results -->
      <SpecialistSearchResults
        :specialists="searchStore.allSpecialists"
        :loading="searchStore.loading"
        :loading-more="searchStore.infiniteScrollState.isLoadingMore"
        :empty="!searchStore.hasResults && searchStore.hasSearched"
        :can-load-more="searchStore.canLoadMore"
        :total-results="searchStore.lastSearchResults?.total"
        :error="searchStore.error"
        @load-more="handleLoadMore"
        @clear-search="handleClearSearch"
        @retry="handleRetrySearch"
        @view-profile="handleViewProfile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import SpecialistSearchFilters from '@/components/search/SpecialistSearchFilters.vue'
import SpecialistSearchResults from '@/components/search/SpecialistSearchResults.vue'
import { useSpecialistSearchStore } from '@/stores/specialist-search'
import type { SearchFilters, SpecialistProfile } from '@/types/specialist-search'

// Store
const searchStore = useSpecialistSearchStore()

// Methods
const handleSearch = async (filters: SearchFilters): Promise<void> => {
  try {
    await searchStore.searchSpecialists(filters)
  } catch (error) {
    console.error('Search failed:', error)
  }
}

const handleClearSearch = (): void => {
  searchStore.clearSearch()
}

const handleLoadMore = async (): Promise<void> => {
  try {
    await searchStore.loadMoreSpecialists()
  } catch (error) {
    console.error('Load more failed:', error)
  }
}

const handleRetrySearch = async (): Promise<void> => {
  try {
    await searchStore.searchSpecialists()
  } catch (error) {
    console.error('Retry search failed:', error)
  }
}

const handleSpecialistContact = (
  type: 'telegram' | 'email' | 'website',
  contact: string,
  specialist: SpecialistProfile
): void => {
  // Track contact interaction
  console.log(`Contact ${specialist.displayName} via ${type}:`, contact)
  
  // TODO: Implement analytics tracking
  // analytics.track('specialist_contact', {
  //   specialist_id: specialist.id,
  //   contact_type: type,
  //   contact_value: contact
  // })
}

const handleSpecialistSave = (specialist: SpecialistProfile): void => {
  // Handle saving specialist to favorites
  console.log('Save specialist:', specialist.displayName)
  
  // TODO: Implement save to favorites functionality
  // favoritesStore.addFavorite(specialist)
}

const handleViewProfile = (specialist: SpecialistProfile): void => {
  // Handle viewing full specialist profile
  console.log('View profile:', specialist.displayName)
  
  // TODO: Navigate to specialist profile page
  // router.push(`/specialists/${specialist.id}`)
}

// Initialize
onMounted(async () => {
  // Load available skills on page mount
  await searchStore.loadAvailableSkills()
})
</script>