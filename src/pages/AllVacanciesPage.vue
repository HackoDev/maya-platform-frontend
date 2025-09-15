<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-3 mb-4">
          <BriefcaseIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Все вакансии
          </h1>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Просмотрите все опубликованные вакансии на платформе
        </p>
      </div>

      <!-- Search Filters -->
      <VacancySearchFilters
        :loading="vacancyStore.loading"
        @search="handleSearch"
        @clear="handleClearSearch"
      />

      <!-- Search Results -->
      <VacancySearchResults
        :vacancies="vacancyStore.allVacancies"
        :loading="vacancyStore.loading"
        :loading-more="vacancyStore.loadingMore"
        :empty="!vacancyStore.hasSearched && vacancyStore.allVacancies.length === 0"
        :can-load-more="vacancyStore.canLoadMore"
        :total-results="vacancyStore.lastSearchResults?.total"
        :error="vacancyStore.error"
        @load-more="handleLoadMore"
        @clear-search="handleClearSearch"
        @retry="handleRetrySearch"
        @view-vacancy="handleViewVacancy"
        @contact-vacancy="handleContactVacancy"
        @edit-vacancy="handleEditVacancy"
        @delete-vacancy="handleDeleteVacancy"
      />
    </div>

    <!-- Contact Modal -->
    <BaseModal 
      :show="vacancyStore.showContactModal"
      @close="vacancyStore.closeContactModal"
    >
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Контактная информация
        </h3>
      </template>
      <template #body>
        <div v-if="vacancyStore.selectedVacancy" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Компания
            </label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ vacancyStore.selectedVacancy.clientName }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Телефон для связи
            </label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ (vacancyStore.selectedVacancy as any)._fakeData?.contactInfo?.phone || vacancyStore.selectedVacancy.clientPhone }}
            </p>
          </div>
          <div v-if="(vacancyStore.selectedVacancy as any)._fakeData?.contactInfo?.telegram">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Telegram
            </label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ (vacancyStore.selectedVacancy as any)._fakeData.contactInfo.telegram }}
            </p>
          </div>
          <div v-if="(vacancyStore.selectedVacancy as any)._fakeData?.contactInfo?.whatsapp">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              WhatsApp
            </label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ (vacancyStore.selectedVacancy as any)._fakeData.contactInfo.whatsapp }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Информация
            </label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">
              Свяжитесь с представителем компании по указанным контактам для получения дополнительной информации о вакансии.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <button
          type="button"
          @click="vacancyStore.closeContactModal"
          class="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
        >
          Закрыть
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVacancyStore } from '@/stores/vacancy'
import { useUserStore } from '@/stores/user'
import { 
  BriefcaseIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon 
} from '@heroicons/vue/24/outline'
import VacancySearchFilters from '@/components/vacancies/VacancySearchFilters.vue'
import VacancySearchResults from '@/components/vacancies/VacancySearchResults.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { Vacancy, VacancySearchFilters as VacancySearchFiltersType } from '@/types/vacancy'

// Stores
const vacancyStore = useVacancyStore()
const userStore = useUserStore()

// Router
const router = useRouter()

// Methods
const handleSearch = async (filters: VacancySearchFiltersType): Promise<void> => {
  try {
    await vacancyStore.searchVacancies(filters)
  } catch (error) {
    console.error('Search failed:', error)
  }
}

const handleClearSearch = (): void => {
  vacancyStore.clearSearch()
}

const handleLoadMore = async (): Promise<void> => {
  try {
    await vacancyStore.loadMoreVacancies()
  } catch (error) {
    console.error('Load more failed:', error)
  }
}

const handleRetrySearch = async (): Promise<void> => {
  try {
    await vacancyStore.searchVacancies()
  } catch (error) {
    console.error('Retry search failed:', error)
  }
}

const handleViewVacancy = (vacancy: Vacancy) => {
  router.push(`/vacancies/${vacancy.id}`)
}

const handleContactVacancy = (vacancy: Vacancy) => {
  vacancyStore.openContactModal(vacancy)
}

const handleEditVacancy = (vacancy: Vacancy) => {
  router.push(`/profile/vacancies/${vacancy.id}`)
}

const handleDeleteVacancy = (id: string) => {
  // In the public view, we shouldn't be able to delete
  // This is just a placeholder in case we need it
  console.log('Delete vacancy:', id)
}

// Initialize
onMounted(async () => {
  // Load initial vacancies
  await vacancyStore.searchVacancies()
})
</script>