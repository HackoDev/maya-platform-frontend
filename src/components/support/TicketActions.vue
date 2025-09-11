<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
      <!-- Status Info -->
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <span v-if="ticket.status === 'open' || ticket.status === 'in-progress'">
          Тикет открыт. Наша команда рассмотрит ваш запрос в ближайшее время.
        </span>
        <span v-else-if="ticket.status === 'resolved'">
          Тикет решен {{ ticket.resolvedAt ? formatDate(ticket.resolvedAt) : '' }}.
        </span>
        <span v-else-if="ticket.status === 'closed'">
          Тикет закрыт.
        </span>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <!-- Resolve Button (only for open/in-progress tickets) -->
        <button
          v-if="(ticket.status === 'open' || ticket.status === 'in-progress') && !ticket.resolvedAt"
          @click="handleResolve"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          :disabled="loading"
        >
          <CheckCircleIcon class="h-4 w-4 mr-1" />
          <span v-if="!loading">Отметить как решенный</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Обработка...
          </span>
        </button>
        
        <!-- Close Button (for all tickets) -->
        <button
          @click="handleClose"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <XMarkIcon class="h-4 w-4 mr-1" />
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { SupportTicket } from '@/types'

interface Props {
  ticket: SupportTicket
  loading: boolean
}

interface Emits {
  (e: 'resolve'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// Event handlers
const handleResolve = (): void => {
  emit('resolve')
}

const handleClose = (): void => {
  router.push({ name: 'Support' })
}

// Utility methods
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>