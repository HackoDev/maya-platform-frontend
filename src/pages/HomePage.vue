<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Добро пожаловать, {{ userStore.currentUser?.firstName }}!
        </h1>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
          Здесь вы можете отслеживать ключевые показатели платформы и находить специалистов или вакансии.
        </p>
      </div>

      <!-- Statistics Section -->
      <div class="mb-12">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Статистика платформы
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Ключевые показатели активности на платформе
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatisticsCard 
            title="Портфолио специалистов" 
            :value="statistics?.portfolioCount || 0" 
            icon="💼"
            icon-bg-class="bg-gradient-to-r from-emerald-500 to-teal-600"
            :max-value="1000"
          />
          <StatisticsCard 
            title="Активные вакансии" 
            :value="statistics?.vacancyCount || 0" 
            icon="📋"
            icon-bg-class="bg-gradient-to-r from-purple-500 to-pink-600"
            :max-value="500"
          />
        </div>
      </div>

      <!-- Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Portfolios Column -->
        <div>
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

        <!-- Vacancies Column -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Активные вакансии</h2>
            <router-link 
              to="/vacancies"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
            >
              Найти вакансию
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePlatformData } from '@/composables/usePlatformData'
import StatisticsCard from '@/components/ui/StatisticsCard.vue'
import PortfolioSpecialistCard from '@/components/ui/PortfolioSpecialistCard.vue'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'

const userStore = useUserStore()
const { statistics, portfolios, vacancies, loading, error, fetchPlatformData } = usePlatformData()

// Methods
const handleViewVacancy = (vacancy: any) => {
  // Navigate to vacancy detail page
  window.location.href = `/vacancies/${vacancy.id}`
}

onMounted(() => {
  fetchPlatformData()
})
</script>