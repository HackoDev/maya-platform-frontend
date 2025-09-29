<template>
  <div class="space-y-6">
    <!-- Section Header with Refresh Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <ClockIcon class="h-8 w-8 text-green-600 dark:text-green-400" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            История обращений
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ваши последние обращения в поддержку
          </p>
        </div>
      </div>
      
      <!-- Refresh Button with Spinner -->
      <button
        type="button"
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900 disabled:opacity-50"
        @click="handleRefresh"
        title="Обновить"
        :disabled="refreshLoading"
      >
        <ArrowPathIcon v-if="!refreshLoading" class="h-4 w-4 mr-1.5" />
        <svg v-else class="animate-spin h-4 w-4 mr-1.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
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
            Ошибка загрузки истории
          </h3>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">
            {{ error }}
          </p>
          <button
            type="button"
            class="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 dark:focus:ring-offset-gray-900"
            @click="handleRetry"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="tickets.length === 0" class="text-center py-12">
      <TicketIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Нет обращений в поддержку
      </h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        У вас пока нет обращений в службу поддержки.
      </p>
      <p class="text-gray-600 dark:text-gray-400">
        Задайте вопрос ниже, если нужна помощь.
      </p>
    </div>

    <!-- Tickets List -->
    <div v-else class="space-y-4">
      <SupportTicketItem
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        @click="handleTicketClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ClockIcon,
  TicketIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import SupportTicketItem from './SupportTicketItem.vue'
import type { SupportTicket } from '@/types'

interface Props {
  tickets: SupportTicket[]
  loading: boolean
  error?: string | null
}

interface Emits {
  (e: 'ticket-click', ticket: SupportTicket): void
  (e: 'refresh'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  error: null
})

const emit = defineEmits<Emits>()

// Local state for refresh button loading
const refreshLoading = ref(false)

// Utility methods
const getTicketsEnding = (count: number): string => {
  if (count === 1) return 'е'
  if (count >= 2 && count <= 4) return 'я'
  return 'й'
}

// Event handlers
const handleTicketClick = (ticket: SupportTicket): void => {
  emit('ticket-click', ticket)
}

const handleRefresh = (): void => {
  refreshLoading.value = true
  emit('refresh')
}

const handleRefreshComplete = (): void => {
  refreshLoading.value = false
}

const handleRetry = (): void => {
  emit('retry')
}

// Expose method to parent component to reset loading state
defineExpose({
  handleRefreshComplete
})
</script>