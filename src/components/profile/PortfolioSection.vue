<template>
  <div class="portfolio-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Портфолио
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="portfolioCase in portfolio"
        :key="portfolioCase.id"
        class="portfolio-card bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ portfolioCase.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ portfolioCase.description }}
        </p>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ portfolioCase.result }}
        </div>
        <div class="mt-4">
          <button
            v-if="portfolioCase.content && portfolioCase.content.trim()"
            @click="handleShowContent(portfolioCase)"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 rounded-md transition-colors"
          >
            Показать контент
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DisplayPortfolioItem } from '@/types/specialist-profile-view-simple'

interface Props {
  portfolio: DisplayPortfolioItem[]
  specialistName: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'show-content', payload: { id: string; title: string; content: string }): void
}>()

const handleShowContent = (item: { id: string; title: string; content: string }) => {
  emit('show-content', { id: item.id, title: item.title, content: item.content })
}
</script>