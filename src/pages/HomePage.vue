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
              class="inline-flex items-center gap-2 whitespace-nowrap text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors"
            >
              <span>Найти специалиста</span>
              <ArrowRightIcon class="h-5 w-5" />
            </router-link>
          </div>
          
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p class="text-red-800 dark:text-red-200">Ошибка загрузки данных: {{ error }}</p>
          </div>
          
          <div v-else>
            <!-- Empty state for portfolios -->
            <div v-if="portfolios.length === 0" class="text-center py-16">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-200/70 dark:ring-gray-700/70">
                <UserGroupIcon class="h-7 w-7 text-gray-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Пока нет анкет</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Здесь скоро появятся анкеты специалистов. Загляните позже или перейдите к поиску.
              </p>
              <div class="mt-6">
                <router-link 
                  to="/search/specialists"
                  class="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800"
                >
                  Перейти к поиску специалистов
                </router-link>
              </div>
            </div>
            
            <!-- Portfolios grid -->
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
                class="inline-flex items-center gap-2 whitespace-nowrap text-lg font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors"
              >
                <span>Найти специалиста</span>
                <ArrowRightIcon class="h-5 w-5" />
              </router-link>
            </div>
            </div>
          </div>
        </div>

        <!-- For Specialists: Show Vacancies -->
        <div v-else-if="session.currentUser.value?.userType === 'specialist'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Последние вакансии</h2>
            <router-link 
              to="/vacancies"
              class="inline-flex items-center gap-2 whitespace-nowrap text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors"
            >
              <span>Найти вакансии</span>
              <ArrowRightIcon class="h-5 w-5" />
            </router-link>
          </div>
          
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p class="text-red-800 dark:text-red-200">Ошибка загрузки данных: {{ error }}</p>
          </div>
          
          <div v-else>
            <!-- Empty state for vacancies -->
            <div v-if="vacancies.length === 0" class="text-center py-16">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-200/70 dark:ring-gray-700/70">
                <BriefcaseIcon class="h-7 w-7 text-gray-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Пока нет вакансий</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Здесь скоро появятся вакансии. Загляните позже или перейдите к поиску.
              </p>
              <div class="mt-6">
                <router-link 
                  to="/vacancies"
                  class="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800"
                >
                  Перейти к поиску вакансий
                </router-link>
              </div>
            </div>
            
            <!-- Vacancies grid -->
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
                class="inline-flex items-center gap-2 whitespace-nowrap text-lg font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors"
              >
                <span>Найти вакансии</span>
                <ArrowRightIcon class="h-5 w-5" />
              </router-link>
            </div>
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
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalSession } from '@/composables/useSession'
import { usePlatformData } from '@/composables/usePlatformData'
import PortfolioSpecialistCard from '@/components/ui/PortfolioSpecialistCard.vue'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'
import type { Vacancy } from '@/types/vacancy'
import { BriefcaseIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

// Stores
const session = useGlobalSession()
const { portfolios, vacancies, loading, error, fetchPlatformData } = usePlatformData(computed(() => session.currentUser.value?.userType))

// Router
const router = useRouter()

// Methods
const handleViewVacancy = (vacancy: Vacancy): void => {
  router.push(`/vacancies/${vacancy.id}`)
}

// Initialize
onMounted(() => {
  // Only fetch data if user is authenticated and has a user type
  if (session.isAuthenticated.value && session.currentUser.value?.userType) {
    fetchPlatformData()
  }
})
</script>