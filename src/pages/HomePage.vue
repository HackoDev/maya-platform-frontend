<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Добро пожаловать, {{ userStore.currentUser?.firstName }}!
        </h1>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
          <span v-if="userStore.currentUser?.userType === 'client'">
            Здесь вы можете находить специалистов для ваших проектов.
          </span>
          <span v-else-if="userStore.currentUser?.userType === 'specialist'">
            Здесь вы можете находить интересные вакансии для работы.
          </span>
          <span v-else>
            Здесь вы можете находить специалистов или вакансии.
          </span>
        </p>
      </div>


      <!-- Dynamic Content Based on User Type -->
      <div class="max-w-4xl mx-auto">
        <!-- For Clients: Show Portfolios -->
        <div v-if="userStore.currentUser?.userType === 'client'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Портфолио специалистов</h2>
            <router-link 
              to="/search/specialists"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
            >
              Найти специалиста
            </router-link>
          </div>
          
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p class="text-red-800 dark:text-red-200">Ошибка загрузки данных: {{ error }}</p>
          </div>
          
          <div v-else class="space-y-6">
            <PortfolioSpecialistCard 
              v-for="(item, index) in portfolios" 
              :key="index" 
              :portfolio="item.portfolio"
              :specialist="item.specialist"
            />
          </div>
        </div>

        <!-- For Specialists: Show Vacancies -->
        <div v-else-if="userStore.currentUser?.userType === 'specialist'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Последние вакансии</h2>
            <router-link 
              to="/vacancies"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
            >
              Посмотреть все вакансии
            </router-link>
          </div>
          
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p class="text-red-800 dark:text-red-200">Ошибка загрузки данных: {{ error }}</p>
          </div>
          
          <div v-else class="space-y-6">
            <VacancyCard 
              v-for="vacancy in vacancies" 
              :key="vacancy.id" 
              :vacancy="vacancy"
              :is-owner="false"
              @view="handleViewVacancy"
            />
          </div>
        </div>

        <!-- Fallback for unknown user types -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">Не удалось определить тип пользователя</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePlatformData } from '@/composables/usePlatformData'
import PortfolioSpecialistCard from '@/components/ui/PortfolioSpecialistCard.vue'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'
import type { Vacancy } from '@/types/vacancy'

// Stores
const userStore = useUserStore()
const { portfolios, vacancies, loading, error, fetchPlatformData } = usePlatformData()

// Router
const router = useRouter()

// Methods
const handleViewVacancy = (vacancy: Vacancy): void => {
  router.push(`/vacancies/${vacancy.id}`)
}

// Initialize
onMounted(() => {
  fetchPlatformData()
})
</script>