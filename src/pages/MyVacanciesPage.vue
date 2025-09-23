<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Мои вакансии
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Управляйте своими вакансиями и отслеживайте отклики
            </p>
          </div>
          <button
            @click="handleCreateVacancy"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Создать вакансию
          </button>
        </div>
      </div>

      <!-- Search Component -->
      <div class="mb-6">
        <VacancySearch />
      </div>

      <!-- Loading State -->
      <div v-if="vacancyStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="vacancyStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <h3 class="ml-2 text-sm font-medium text-red-800 dark:text-red-200">
            Ошибка загрузки
          </h3>
        </div>
        <div class="mt-2 text-sm text-red-700 dark:text-red-300">
          <p>{{ vacancyStore.error }}</p>
        </div>
        <div class="mt-4">
          <button
            @click="vacancyStore.fetchVacancies"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Попробовать снова
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="vacancyStore.vacancies.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <BriefcaseIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Нет вакансий</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Начните с создания своей первой вакансии.
        </p>
        <div class="mt-6">
          <button
            @click="handleCreateVacancy"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
          >
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
            Создать вакансию
          </button>
        </div>
      </div>

      <!-- Vacancy List -->
      <div v-else>
        <VacancyList 
          @view="handleViewVacancy"
          @create="handleCreateVacancy"
          @edit="handleEditVacancy"
          @delete="handleDeleteVacancy"
        />
      </div>
    </div>

    <!-- Vacancy Form Modal -->
    <VacancyForm 
      :is-open="vacancyStore.showVacancyForm"
      :vacancy="vacancyStore.selectedVacancy"
      @close="vacancyStore.closeVacancyForm"
      @save="handleSaveVacancy"
    />

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :is-open="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :cancel-text="confirmDialog.cancelText"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVacancyStore } from '@/stores/vacancy'
import { PlusIcon, ExclamationTriangleIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'
import VacancySearch from '@/components/vacancies/VacancySearch.vue'
import VacancyList from '@/components/vacancies/VacancyList.vue'
import VacancyForm from '@/components/vacancies/VacancyForm.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Vacancy } from '@/types/vacancy'

// Stores
const vacancyStore = useVacancyStore()

// Router
const router = useRouter()
const route = useRoute()

// State for confirm dialog
const showConfirmDialog = ref(false)
const confirmDialog = ref({
  title: 'Удалить вакансию',
  message: 'Вы уверены, что хотите удалить эту вакансию? Это действие нельзя отменить.',
  confirmText: 'Удалить',
  cancelText: 'Отмена'
})
const pendingDeleteId = ref<string | null>(null)

// Methods
const handleViewVacancy = (vacancy: Vacancy) => {
  router.push(`/profile/vacancies/${vacancy.id}`)
}

const handleCreateVacancy = () => {
  vacancyStore.openVacancyForm()
}

const handleEditVacancy = (vacancy: Vacancy) => {
  vacancyStore.openVacancyForm(vacancy)
}

const handleDeleteVacancy = async (id: string) => {
  pendingDeleteId.value = id
  showConfirmDialog.value = true
}

const handleConfirmDelete = async () => {
  if (pendingDeleteId.value) {
    try {
      await vacancyStore.deleteVacancy(pendingDeleteId.value)
    } catch (err) {
      // Error is handled in the store
      console.error('Error deleting vacancy:', err)
    } finally {
      showConfirmDialog.value = false
      pendingDeleteId.value = null
    }
  }
}

const handleCancelDelete = () => {
  showConfirmDialog.value = false
  pendingDeleteId.value = null
}

const handleSaveVacancy = async (vacancyData: Partial<Vacancy>) => {
  try {
    if (vacancyStore.selectedVacancy) {
      // Update existing vacancy
      await vacancyStore.updateVacancy(vacancyStore.selectedVacancy.id, vacancyData)
    } else {
      // Create new vacancy
      const newVacancy = await vacancyStore.createVacancy(vacancyData)
      // Redirect to the newly created vacancy details page
      router.push(`/profile/vacancies/${newVacancy.id}`)
    }
    vacancyStore.closeVacancyForm()
  } catch (err) {
    // Error is handled in the form component
    throw err
  }
}

// Lifecycle
onMounted(() => {
  // Check if there's a search query in the URL
  const urlSearch = route.query.search as string
  if (urlSearch) {
    // Set the search query in the store and fetch vacancies
    vacancyStore.setSearchQuery(urlSearch)
  }
  vacancyStore.fetchVacancies()
})
</script>