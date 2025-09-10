<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="flex items-center space-x-3">
      <QuestionMarkCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Часто задаваемые вопросы
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Найдите ответы на популярные вопросы о платформе
        </p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search Input -->
        <div class="relative">
          <label for="faq-search" class="sr-only">Поиск по FAQ</label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="faq-search"
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по вопросам и ответам..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
              :aria-describedby="searchQuery ? 'search-results-count' : undefined"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              @click="clearSearch"
              aria-label="Очистить поиск"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          <div
            v-if="searchQuery && filteredFAQs.length > 0"
            id="search-results-count"
            class="text-sm text-gray-600 dark:text-gray-400 mt-1"
          >
            Найдено {{ filteredFAQs.length }} результат{{ getResultsEnding(filteredFAQs.length) }}
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <label for="faq-category" class="sr-only">Фильтр по категории</label>
          <select
            id="faq-category"
            v-model="selectedCategory"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-colors duration-200"
          >
            <option value="">Все категории</option>
            <option value="general">Общие вопросы</option>
            <option value="technical">Технические проблемы</option>
            <option value="billing">Вопросы по оплате</option>
            <option value="account">Управление аккаунтом</option>
          </select>
        </div>
      </div>

      <!-- Quick filters -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          class="px-3 py-1 text-sm rounded-full border transition-colors duration-200"
          :class="showPopularOnly 
            ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'"
          @click="togglePopularFilter"
        >
          <StarIcon class="inline h-4 w-4 mr-1" />
          Только популярные
        </button>
        <button
          type="button"
          class="px-3 py-1 text-sm rounded-full bg-white text-gray-700 border border-gray-300 
                 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600
                 transition-colors duration-200"
          @click="clearAllFilters"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
      </div>
    </div>

    <!-- Error State -->
    <div 
      v-else-if="error" 
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
    >
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mt-0.5" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            Ошибка загрузки FAQ
          </h3>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">
            {{ error }}
          </p>
          <button
            type="button"
            class="mt-2 text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-600 dark:hover:text-red-100"
            @click="handleRetry"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div 
      v-else-if="filteredFAQs.length === 0 && (searchQuery || selectedCategory || showPopularOnly)"
      class="text-center py-12"
    >
      <QuestionMarkCircleIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Ничего не найдено
      </h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Попробуйте изменить критерии поиска или сбросить фильтры
      </p>
      <button
        type="button"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               transition-colors duration-200"
        @click="clearAllFilters"
      >
        Сбросить фильтры
      </button>
    </div>

    <!-- FAQ Items -->
    <div v-else class="space-y-4">
      <FAQItem
        v-for="faq in filteredFAQs"
        :key="faq.id"
        :faq="faq"
        :expanded="isFAQExpanded(faq.id)"
        @toggle="() => toggleFAQ(faq.id)"
        @helpful="(isHelpful) => handleFeedback(faq.id, isHelpful)"
      />
    </div>

    <!-- Load More (if needed for large datasets) -->
    <div 
      v-if="!loading && filteredFAQs.length > 0 && hasMoreFAQs"
      class="text-center py-6"
    >
      <button
        type="button"
        class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
               rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
               focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
               transition-colors duration-200"
        @click="loadMoreFAQs"
      >
        Показать еще
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  StarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'
import FAQItem from './FAQItem.vue'
import type { FAQ } from '@/types'

interface Props {
  faqs: FAQ[]
  loading: boolean
  error?: string | null
}

interface Emits {
  (e: 'toggle-faq', faqId: string): void
  (e: 'refresh'): void
  (e: 'feedback', data: { faqId: string; isHelpful: boolean }): void
}

const props = withDefaults(defineProps<Props>(), {
  error: null
})

const emit = defineEmits<Emits>()

// Local state
const searchQuery = ref('')
const selectedCategory = ref('')
const showPopularOnly = ref(false)
const expandedFAQs = ref<Set<string>>(new Set())

// Computed properties
const filteredFAQs = computed(() => {
  let result = [...props.faqs]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    result = result.filter(faq => faq.category === selectedCategory.value)
  }

  // Popular filter
  if (showPopularOnly.value) {
    result = result.filter(faq => faq.isPopular)
  }

  // Sort by priority
  return result.sort((a, b) => a.priority - b.priority)
})

const hasMoreFAQs = computed(() => false) // For future pagination implementation

// Methods
const toggleFAQ = (faqId: string): void => {
  if (expandedFAQs.value.has(faqId)) {
    expandedFAQs.value.delete(faqId)
  } else {
    expandedFAQs.value.add(faqId)
  }
  emit('toggle-faq', faqId)
}

const isFAQExpanded = (faqId: string): boolean => {
  return expandedFAQs.value.has(faqId)
}

const clearSearch = (): void => {
  searchQuery.value = ''
}

const togglePopularFilter = (): void => {
  showPopularOnly.value = !showPopularOnly.value
}

const clearAllFilters = (): void => {
  searchQuery.value = ''
  selectedCategory.value = ''
  showPopularOnly.value = false
}

const handleRetry = (): void => {
  emit('refresh')
}

const handleFeedback = (faqId: string, isHelpful: boolean): void => {
  emit('feedback', { faqId, isHelpful })
}

const loadMoreFAQs = (): void => {
  // For future pagination implementation
  console.log('Load more FAQs')
}

const getResultsEnding = (count: number): string => {
  if (count === 1) return ''
  if (count >= 2 && count <= 4) return 'а'
  return 'ов'
}

// Watch for search changes to clear expanded state
watch([searchQuery, selectedCategory, showPopularOnly], () => {
  expandedFAQs.value.clear()
})
</script>