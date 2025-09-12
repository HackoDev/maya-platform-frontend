<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/profile/vacancies" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white">
              <HomeIcon class="w-4 h-4 mr-2" />
              Мои вакансии
            </router-link>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ vacancy?.title || 'Загрузка...' }}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <h3 class="ml-2 text-sm font-medium text-red-800 dark:text-red-200">
            Ошибка загрузки
          </h3>
        </div>
        <div class="mt-2 text-sm text-red-700 dark:text-red-300">
          <p>{{ error }}</p>
        </div>
        <div class="mt-4">
          <button
            @click="loadVacancy"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Попробовать снова
          </button>
        </div>
      </div>

      <!-- Vacancy Detail -->
      <div v-else-if="vacancy">
        <VacancyDetail 
          :vacancy="vacancy" 
          @edit="handleEdit"
          @close="handleClose"
          @publish="handlePublish"
          @close-vacancy="handleCloseVacancy"
          @reopen="handleReopen"
          @contact="handleContactClick"
        />
      </div>

      <!-- Not Found -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Вакансия не найдена</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Вакансия, которую вы ищете, не существует или была удалена.
        </p>
        <div class="mt-6">
          <router-link
            to="/vacancies"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
          >
            Вернуться к списку вакансий
          </router-link>
        </div>
      </div>
    </div>

    <!-- Vacancy Form Modal -->
    <VacancyForm 
      :is-open="showVacancyForm"
      :vacancy="vacancy"
      @close="handleCloseForm"
      @save="handleSaveVacancy"
    />

    <!-- Contact Modal -->
    <BaseModal :show="showContactModal" @close="handleCloseContactModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Контактная информация
        </h3>
      </template>

      <template #default>
        <div class="space-y-4">
          <div class="flex items-center">
            <UserCircleIcon class="h-10 w-10 text-gray-400" />
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ vacancy?.clientName }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Клиент
              </p>
            </div>
          </div>

          <div v-if="showPhoneNumber" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              Номер телефона:
            </p>
            <p class="mt-1 text-lg font-semibold text-purple-600 dark:text-purple-400">
              {{ vacancy?.clientPhone }}
            </p>
          </div>

          <div v-else class="mt-4">
            <button
              @click="showPhoneNumber = true"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
            >
              Показать номер телефона
            </button>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          type="button"
          @click="handleCloseContactModal"
          class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
        >
          Закрыть
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVacancyStore } from '@/stores/vacancy'
import { HomeIcon, ChevronRightIcon, ExclamationTriangleIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import VacancyDetail from '@/components/vacancies/VacancyDetail.vue'
import VacancyForm from '@/components/vacancies/VacancyForm.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { Vacancy } from '@/types/vacancy'

// Stores
const vacancyStore = useVacancyStore()

// Router
const route = useRoute()
const router = useRouter()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const showVacancyForm = ref(false)
const showContactModal = ref(false)
const showPhoneNumber = ref(false)

// Computed properties
const vacancy = ref<Vacancy | null>(null)

// Methods
const loadVacancy = async () => {
  loading.value = true
  error.value = null

  try {
    const vacancyId = route.params.id as string
    // In a real implementation, we would fetch the specific vacancy
    // For now, we'll find it in the store
    await vacancyStore.fetchVacancies()
    const foundVacancy = vacancyStore.vacancies.find(v => v.id === vacancyId)
    
    if (foundVacancy) {
      vacancy.value = foundVacancy
    } else {
      error.value = 'Вакансия не найдена'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки вакансии'
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  showVacancyForm.value = true
}

const handleClose = () => {
  router.push('/vacancies')
}

const handlePublish = async () => {
  if (!vacancy.value) return

  try {
    const updatedVacancy = await vacancyStore.updateVacancy(vacancy.value.id, {
      ...vacancy.value,
      status: 'published'
    })
    vacancy.value = updatedVacancy
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка публикации вакансии'
  }
}

const handleCloseVacancy = async () => {
  if (!vacancy.value) return

  try {
    const updatedVacancy = await vacancyStore.updateVacancy(vacancy.value.id, {
      ...vacancy.value,
      status: 'closed'
    })
    vacancy.value = updatedVacancy
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка закрытия вакансии'
  }
}

const handleReopen = async () => {
  if (!vacancy.value) return

  try {
    const updatedVacancy = await vacancyStore.updateVacancy(vacancy.value.id, {
      ...vacancy.value,
      status: 'draft'
    })
    vacancy.value = updatedVacancy
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка повторного открытия вакансии'
  }
}

const handleCloseForm = () => {
  showVacancyForm.value = false
}

const handleSaveVacancy = async (vacancyData: Partial<Vacancy>) => {
  try {
    if (vacancy.value) {
      // Update existing vacancy
      const updatedVacancy = await vacancyStore.updateVacancy(vacancy.value.id, vacancyData)
      vacancy.value = updatedVacancy
    } else {
      // Create new vacancy
      const newVacancy = await vacancyStore.createVacancy(vacancyData)
      vacancy.value = newVacancy
    }
    showVacancyForm.value = false
  } catch (err) {
    throw err
  }
}

const handleContactClick = () => {
  showContactModal.value = true
  showPhoneNumber.value = false
}

const handleCloseContactModal = () => {
  showContactModal.value = false
  showPhoneNumber.value = false
}

// Lifecycle
onMounted(() => {
  loadVacancy()
})
</script>