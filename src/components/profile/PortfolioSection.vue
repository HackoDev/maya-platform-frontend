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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PortfolioSectionProps } from '@/types/specialist-profile-view'

interface Props {
  portfolio: PortfolioSectionProps['portfolio']
  specialistName: PortfolioSectionProps['specialistName']
}

const props = defineProps<Props>()
</script>