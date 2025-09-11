<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
    <form @submit.prevent="handleSearch" class="space-y-6">
      <!-- Search Query -->
      <div>
        <label for="search-query" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Поиск по имени или специализации
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="search-query"
            v-model="localFilters.query"
            type="text"
            placeholder="Введите имя специалиста или специализацию..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 
                   rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>

      <!-- Skills Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Навыки и специализации
        </label>
        <MultiSkillSelector
          v-model="localFilters.skills"
          :options="availableSkills"
          placeholder="Выберите необходимые навыки..."
          :max-selections="5"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-3">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                   rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   dark:focus:ring-offset-gray-800"
          >
            <MagnifyingGlassIcon v-if="!loading" class="h-4 w-4 mr-2" />
            <svg
              v-else
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Поиск...' : 'Найти специалистов' }}
          </button>

          <button
            type="button"
            @click="handleClear"
            :disabled="!hasActiveFilters || loading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
                   text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 
                   bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   dark:focus:ring-offset-gray-800"
          >
            <XMarkIcon class="h-4 w-4 mr-2" />
            Очистить
          </button>
        </div>

        <!-- Quick Stats -->
        <div v-if="searchSummary" class="text-sm text-gray-500 dark:text-gray-400">
          {{ searchSummary }}
        </div>
      </div>
    </form>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Активные фильтры:</span>
        <button
          @click="handleClear"
          class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Очистить все
        </button>
      </div>
      
      <div class="flex flex-wrap gap-2">
        <!-- Query filter -->
        <span
          v-if="localFilters.query"
          class="inline-flex items-center px-2 py-1 text-xs font-medium 
                 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
        >
          Текст: "{{ localFilters.query }}"
          <button
            @click="localFilters.query = ''"
            class="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ×
          </button>
        </span>

        <!-- Skills filters -->
        <span
          v-for="skillKey in localFilters.skills"
          :key="skillKey"
          class="inline-flex items-center px-2 py-1 text-xs font-medium 
                 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
        >
          {{ getSkillLabel(skillKey) }}
          <button
            @click="removeSkillFilter(skillKey)"
            class="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
          >
            ×
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import MultiSkillSelector from './MultiSkillSelector.vue'
import { useSpecialistSearchStore } from '@/stores/specialist-search'
import type { SearchFilters, SkillOption } from '@/types/specialist-search'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'search', filters: SearchFilters): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Store
const searchStore = useSpecialistSearchStore()

// Local state for form
const localFilters = ref<SearchFilters>({
  query: '',
  skills: [],
  page: 1,
  limit: 5,
})

// Computed
const availableSkills = computed(() => searchStore.availableSkills)

const searchSummary = computed(() => searchStore.searchSummary)

const hasActiveFilters = computed(() => {
  return !!(
    localFilters.value.query ||
    localFilters.value.skills.length > 0
  )
})

// Methods
const getSkillLabel = (skillKey: string): string => {
  const skill = availableSkills.value.find(s => s.key === skillKey)
  return skill ? skill.label : skillKey
}

const removeSkillFilter = (skillKey: string): void => {
  const index = localFilters.value.skills.indexOf(skillKey)
  if (index > -1) {
    localFilters.value.skills.splice(index, 1)
  }
}

const handleSearch = (): void => {
  emit('search', { ...localFilters.value })
}

const handleClear = (): void => {
  localFilters.value = {
    query: '',
    skills: [],
    page: 1,
    limit: 5,
  }
  emit('clear')
}

// Initialize filters from store
const initializeFilters = (): void => {
  const storeFilters = searchStore.searchFilters
  localFilters.value = {
    query: storeFilters.query || '',
    skills: [...(storeFilters.skills || [])],
    page: 1,
    limit: 5,
  }
}

// Load available skills on mount
onMounted(async () => {
  await searchStore.loadAvailableSkills()
  initializeFilters()
})

// Watch for external filter changes
watch(
  () => searchStore.searchFilters,
  () => {
    initializeFilters()
  },
  { deep: true }
)
</script>