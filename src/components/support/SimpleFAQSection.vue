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
          Найдите ответы на популярные вопросы
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg"></div>
      </div>
    </div>

    <!-- Error State -->
    <div 
      v-else-if="error"
      class="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
    >
      <QuestionMarkCircleIcon class="mx-auto h-12 w-12 text-red-400" />
      <h3 class="mt-4 text-lg font-medium text-red-900 dark:text-red-100">
        Ошибка загрузки FAQ
      </h3>
      <p class="mt-2 text-red-700 dark:text-red-300">
        {{ error }}
      </p>
      <button
        type="button"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
               focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
               transition-colors duration-200"
        @click="handleRetry"
      >
        Попробовать снова
      </button>
    </div>

    <!-- FAQ Items -->
    <div v-else-if="sortedFAQs.length > 0" class="space-y-2">
      <CompactFAQItem
        v-for="faq in sortedFAQs"
        :key="faq.id"
        :faq="faq"
        :expanded="isFAQExpanded(faq.id)"
        @toggle="() => toggleFAQ(faq.id)"
      />
    </div>

    <!-- No FAQs State -->
    <div 
      v-else
      class="text-center py-12"
    >
      <QuestionMarkCircleIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Нет доступных вопросов
      </h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        FAQ раздел пока пуст. Попробуйте обновить страницу.
      </p>
      <button
        type="button"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               transition-colors duration-200"
        @click="handleRetry"
      >
        Обновить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import CompactFAQItem from './CompactFAQItem.vue'
import type { SimplifiedFAQ } from '@/types'

interface Props {
  faqs: SimplifiedFAQ[]
  loading: boolean
  error?: string | null
}

interface Emits {
  (e: 'toggle-faq', faqId: string): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  error: null
})

const emit = defineEmits<Emits>()

// Local state for expanded FAQs
const expandedFAQs = ref<Set<string>>(new Set())

// Computed properties
const sortedFAQs = computed(() => {
  return [...props.faqs].sort((a, b) => a.priority - b.priority)
})

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

const handleRetry = (): void => {
  emit('refresh')
}
</script>