<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-grow">
        <label for="vacancy-search" class="sr-only">Поиск вакансий</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="vacancy-search"
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по названию или описанию вакансии..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            @input="handleSearch"
          />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <select
          v-model="statusFilter"
          class="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          @change="handleFilterChange"
        >
          <option value="">Все статусы</option>
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
          <option value="closed">Закрыто</option>
        </select>
        <button
          v-if="searchQuery || statusFilter"
          @click="clearFilters"
          class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVacancyStore } from '@/stores/vacancy'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Stores
const vacancyStore = useVacancyStore()

// Reactive state
const searchQuery = ref(vacancyStore.searchQuery)
const statusFilter = ref('')

// Methods
const handleSearch = () => {
  vacancyStore.setSearchQuery(searchQuery.value)
  vacancyStore.fetchVacancies()
}

const handleFilterChange = () => {
  // In a real implementation, we would filter by status
  console.log('Status filter changed:', statusFilter.value)
  vacancyStore.fetchVacancies()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  vacancyStore.setSearchQuery('')
  vacancyStore.fetchVacancies()
}

// Watch for changes in the store
watch(() => vacancyStore.searchQuery, (newQuery) => {
  searchQuery.value = newQuery
})
</script>