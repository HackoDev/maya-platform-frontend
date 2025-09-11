<template>
  <div class="specialist-search-results">
    <!-- Loading State -->
    <div v-if="loading && !specialists.length" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
        <svg
          class="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Поиск специалистов...
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Ищем подходящих специалистов по вашим критериям
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="empty && !loading" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <UserGroupIcon class="h-6 w-6 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Специалисты не найдены
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Попробуйте изменить критерии поиска или использовать другие ключевые слова
      </p>
      <button
        type="button"
        @click="$emit('clear-search')"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
               rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 
               hover:bg-blue-100 dark:hover:bg-blue-800 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
               dark:focus:ring-offset-gray-900"
      >
        <MagnifyingGlassIcon class="h-4 w-4 mr-2" />
        Начать новый поиск
      </button>
    </div>

    <!-- Results List -->
    <div v-else-if="specialists.length" class="space-y-6">
      <!-- Results Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Найденные специалисты
        </h2>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Показано {{ specialists.length }} из {{ totalResults }}
        </div>
      </div>

      <!-- Specialist Cards -->
      <div class="grid gap-6">
        <SpecialistCard
          v-for="specialist in specialists"
          :key="specialist.id"
          :specialist="specialist"
          @view-profile="handleViewProfile"
          @view-profile-modal="handleViewProfileModal"
        />
      </div>

      <!-- Infinite Scroll Loading Spinner -->
      <div 
        v-if="loadingMore" 
        class="flex justify-center items-center py-8"
        ref="loadingIndicator"
      >
        <div class="inline-flex items-center text-gray-600 dark:text-gray-400">
          <svg
            class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium">Загружаем еще специалистов...</span>
        </div>
      </div>

      <!-- Infinite Scroll Trigger Element -->
      <div 
        v-if="canLoadMore && !loadingMore" 
        :ref="infiniteScroll.triggerRef" 
        class="h-4 w-full"
        aria-hidden="true"
      ></div>

      <!-- End of Results -->
      <div v-else-if="specialists.length && !canLoadMore && !loadingMore" class="text-center py-6">
        <div class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
          <CheckCircleIcon class="h-4 w-4 mr-2" />
          Показаны все результаты
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-8">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Ошибка поиска
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {{ error }}
      </p>
      <button
        type="button"
        @click="$emit('retry')"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
               rounded-md text-white bg-red-600 hover:bg-red-700 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
               dark:focus:ring-offset-gray-900"
      >
        <ArrowPathIcon class="h-4 w-4 mr-2" />
        Повторить поиск
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import SpecialistCard from './SpecialistCard.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import type { SpecialistProfile } from '@/types/specialist-search'

interface Props {
  specialists: SpecialistProfile[]
  loading: boolean
  loadingMore?: boolean
  empty: boolean
  canLoadMore: boolean
  totalResults?: number
  error?: string | null
}

interface Emits {
  (e: 'load-more'): void
  (e: 'clear-search'): void
  (e: 'retry'): void
  (e: 'view-profile', specialist: SpecialistProfile): void
  (e: 'view-profile-modal', specialist: SpecialistProfile): void
}

const props = withDefaults(defineProps<Props>(), {
  loadingMore: false,
  totalResults: 0,
  error: null,
})

const emit = defineEmits<Emits>()

// Template refs
const loadingIndicator = ref<HTMLElement>()

// Infinite scroll setup
const infiniteScroll = useInfiniteScroll(
  () => {
    if (props.canLoadMore && !props.loadingMore && !props.loading) {
      emit('load-more')
    }
  },
  {
    rootMargin: '100px',
    threshold: 0.1,
    throttleDelay: 300,
    enabled: true,
  }
)

// Methods
const handleViewProfile = (specialist: SpecialistProfile): void => {
  emit('view-profile', specialist)
}

const handleViewProfileModal = (specialist: SpecialistProfile): void => {
  emit('view-profile-modal', specialist)
}

// Watch for changes that affect infinite scroll
watch(
  () => [props.canLoadMore, props.specialists.length],
  () => {
    infiniteScroll.reset()
  },
  { flush: 'post' }
)

// Disable/enable infinite scroll based on loading state
watch(
  () => props.loadingMore,
  (newValue) => {
    infiniteScroll.isActive.value = !newValue && props.canLoadMore
  }
)
</script>

<style scoped>
/* Grid adjustments for different screen sizes */
@media (min-width: 1024px) {
  .specialist-search-results .grid {
    grid-template-columns: 1fr;
  }
}

/* Loading animation improvements */
.specialist-search-results .animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Button hover effects */
.specialist-search-results button {
  transition: all 0.15s ease-in-out;
}

.specialist-search-results button:hover {
  transform: translateY(-1px);
}

.specialist-search-results button:active {
  transform: translateY(0);
}

/* Staggered animation for specialist cards */
.specialist-search-results .grid > * {
  animation: slideInUp 0.4s ease-out;
}

.specialist-search-results .grid > *:nth-child(2) {
  animation-delay: 0.1s;
}

.specialist-search-results .grid > *:nth-child(3) {
  animation-delay: 0.2s;
}

.specialist-search-results .grid > *:nth-child(4) {
  animation-delay: 0.3s;
}

.specialist-search-results .grid > *:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus improvements */
.specialist-search-results button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state styling */
.specialist-search-results .bg-red-100 {
  background-color: #fee2e2;
}

.dark .specialist-search-results .bg-red-900 {
  background-color: #7f1d1d;
}

/* Empty state improvements */
.specialist-search-results .bg-gray-100 {
  background-color: #f3f4f6;
}

.dark .specialist-search-results .bg-gray-800 {
  background-color: #1f2937;
}
</style>