<template>
  <div>
    <!-- Empty State -->
    <div v-if="!vacancyStore.loading && vacancyStore.vacancies.length === 0" class="text-center py-12">
      <BriefcaseIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Нет вакансий</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Начните с создания своей первой вакансии.
      </p>
      <div class="mt-6">
        <button
          type="button"
          @click="$emit('create')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Создать вакансию
        </button>
      </div>
    </div>

    <!-- Vacancy Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <VacancyCard
        v-for="vacancy in vacancyStore.vacancies"
        :key="vacancy.id"
        :vacancy="vacancy"
        @view="$emit('view', vacancy)"
        @edit="$emit('edit', vacancy)"
        @delete="$emit('delete', vacancy.id)"
      />
    </div>

    <!-- Loading Skeleton -->
    <div v-if="vacancyStore.loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-pulse">
        <div class="flex justify-between">
          <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div class="mt-4 space-y-3">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        <div class="mt-6 flex justify-end">
          <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVacancyStore } from '@/stores/vacancy'
import { BriefcaseIcon, PlusIcon } from '@heroicons/vue/24/outline'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'

// Stores
const vacancyStore = useVacancyStore()

// Emits
const emit = defineEmits<{
  (e: 'view', vacancy: any): void
  (e: 'create'): void
  (e: 'edit', vacancy: any): void
  (e: 'delete', id: string): void
}>()
</script>