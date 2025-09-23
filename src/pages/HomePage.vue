<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Добро пожаловать, {{ session.currentUser.value?.firstName }}!
        </h1>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
          <span v-if="session.currentUser.value?.userType === 'client'">
            Здесь вы можете находить специалистов для ваших проектов.
          </span>
          <span v-else-if="session.currentUser.value?.userType === 'specialist'">
            Здесь вы можете находить интересные вакансии для работы.
          </span>
          <span v-else>
            Здесь вы можете находить специалистов или вакансии.
          </span>
        </p>
      </div>

      <!-- Dynamic Content Based on User Type -->
      <div class="w-full">
        <!-- For Clients: Show Portfolios -->
        <div v-if="session.currentUser.value?.userType === 'client'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Портфолио специалистов</h2>
            <router-link 
              to="/search/specialists"
              class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Найти специалиста ->
            </router-link>
          </div>
          
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p class="text-red-800 dark:text-red-200">Ошибка загрузки данных: {{ error }}</p>
          </div>
          
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <PortfolioSpecialistCard 
                v-for="(item, index) in portfolios.slice(0, 9)" 
                :key="index" 
                :portfolio="item.portfolio"
                :specialist="item.specialist"
              />
            </div>
            
            <!-- Centered link to view all specialists -->
            <div class="text-center">
              <router-link 
                to="/search/specialists"
                class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-lg font-medium"
              >
                Найти специалиста ->
              </router-link>
            </div>
          </div>
        </div>

        <!-- For Specialists: Show Vacancies -->
        <div v-else-if="session.currentUser.value?.userType === 'specialist'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Последние вакансии</h2>
            <router-link 
              to="/vacancies"
              class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Найти вакансии ->
            </router-link>
          </div>
          
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p class="text-red-800 dark:text-red-200">Ошибка загрузки данных: {{ error }}</p>
          </div>
          
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <VacancyCard 
                v-for="vacancy in vacancies.slice(0, 9)" 
                :key="vacancy.id" 
                :vacancy="vacancy"
                :is-owner="false"
                @view="handleViewVacancy"
              />
            </div>
            
            <!-- Centered link to view all vacancies -->
            <div class="text-center">
              <router-link 
                to="/vacancies"
                class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-lg font-medium"
              >
                Найти вакансии ->
              </router-link>
            </div>
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
import { useGlobalSession } from '@/composables/useSession'
import { usePlatformData } from '@/composables/usePlatformData'
import PortfolioSpecialistCard from '@/components/ui/PortfolioSpecialistCard.vue'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'
import type { Vacancy } from '@/types/vacancy'

// Stores
const session = useGlobalSession()
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