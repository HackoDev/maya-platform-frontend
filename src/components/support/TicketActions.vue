<template>
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 pt-4 border-t border-gray-200 dark:border-gray-600">
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
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        <CheckCircleIcon class="h-4 w-4 mr-1" />
        Отметить как решенный
      </button>
      
      <!-- Close Button (for all tickets) -->
      <button
        @click="handleClose"
        type="button"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <XMarkIcon class="h-4 w-4 mr-1" />
        Закрыть
      </button>
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