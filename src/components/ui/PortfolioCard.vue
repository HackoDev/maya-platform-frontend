<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg h-full flex flex-col">
    <div class="p-5 flex-grow">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400 text-lg">💼</span>
          </div>
        </div>
        <div class="ml-4 flex-grow">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ portfolio.title }}</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-300 line-clamp-2">{{ portfolio.description }}</p>
          
          <div v-if="portfolio.result" class="mt-2">
            <p class="text-xs font-medium text-green-600 dark:text-green-400">Результат: {{ portfolio.result }}</p>
          </div>
          
          <div v-if="portfolio.tools && portfolio.tools.length" class="mt-2">
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="(tool, index) in portfolio.tools.slice(0, 3)" 
                :key="index"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              >
                {{ tool }}
              </span>
              <span 
                v-if="portfolio.tools.length > 3"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                +{{ portfolio.tools.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 text-right">
      <button 
        @click="viewPortfolio"
        class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
      >
        Подробнее →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { PortfolioCase } from '@/types/specialist-profile-view'

interface ExtendedPortfolioCase extends PortfolioCase {
  specialistId?: string
}

interface Props {
  portfolio: ExtendedPortfolioCase
}

const props = defineProps<Props>()
const router = useRouter()

const viewPortfolio = () => {
  // If specialistId is provided, navigate to the specialist profile
  if (props.portfolio.specialistId) {
    router.push({
      name: 'SpecialistProfile',
      params: { id: props.portfolio.specialistId }
    })
  } else {
    // Fallback to external link if no specialist ID is provided
    const contentUrl = typeof props.portfolio.content === 'string' ? props.portfolio.content : '#'
    if (contentUrl !== '#') {
      window.open(contentUrl, '_blank', 'noopener,noreferrer')
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>