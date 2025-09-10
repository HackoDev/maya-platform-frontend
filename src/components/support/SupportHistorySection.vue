<template>
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <ClockIcon class="h-8 w-8 text-green-600 dark:text-green-400" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            История обращений
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ваши последние {{ tickets.length }} обращени{{ getTicketsEnding(tickets.length) }} в поддержку
          </p>
        </div>
      </div>
      
      <!-- Summary Stats -->
      <div class="hidden md:flex items-center space-x-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ openTicketsCount }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Открытых
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ inProgressTicketsCount }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            В работе
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ resolvedTicketsCount }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Решенных
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Stats -->
    <div class="md:hidden grid grid-cols-3 gap-4">
      <div class="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
          {{ openTicketsCount }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          Открытых
        </div>
      </div>
      <div class="text-center bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
        <div class="text-xl font-bold text-yellow-600 dark:text-yellow-400">
          {{ inProgressTicketsCount }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          В работе
        </div>
      </div>
      <div class="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
        <div class="text-xl font-bold text-green-600 dark:text-green-400">
          {{ resolvedTicketsCount }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          Решенных
        </div>
      </div>
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
            class="mt-2 text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-600 dark:hover:text-red-100"
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
      
      <!-- View All Link -->
      <div v-if="tickets.length >= 5" class="text-center pt-4">
        <button
          type="button"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                 font-medium text-sm focus:outline-none focus:underline"
          @click="handleViewAll"
        >
          Посмотреть все обращения →
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Быстрые действия
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                 border border-gray-300 dark:border-gray-600 rounded-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-600 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 transition-colors duration-200"
          @click="() => handleFilter('open')"
        >
          <span class="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
          Открытые тикеты
        </button>
        <button
          type="button"
          class="px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                 border border-gray-300 dark:border-gray-600 rounded-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-600 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 transition-colors duration-200"
          @click="() => handleFilter('in-progress')"
        >
          <span class="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          В работе
        </button>
        <button
          type="button"
          class="px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                 border border-gray-300 dark:border-gray-600 rounded-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-600 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 transition-colors duration-200"
          @click="handleRefresh"
        >
          <ArrowPathIcon class="inline-block h-4 w-4 mr-2" />
          Обновить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  (e: 'view-all'): void
  (e: 'filter', status: SupportTicket['status']): void
  (e: 'refresh'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  error: null
})

const emit = defineEmits<Emits>()

// Computed properties
const openTicketsCount = computed(() => 
  props.tickets.filter(ticket => ticket.status === 'open').length
)

const inProgressTicketsCount = computed(() => 
  props.tickets.filter(ticket => ticket.status === 'in-progress').length
)

const resolvedTicketsCount = computed(() => 
  props.tickets.filter(ticket => 
    ticket.status === 'resolved' || ticket.status === 'closed'
  ).length
)

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

const handleViewAll = (): void => {
  emit('view-all')
}

const handleFilter = (status: SupportTicket['status']): void => {
  emit('filter', status)
}

const handleRefresh = (): void => {
  emit('refresh')
}

const handleRetry = (): void => {
  emit('retry')
}
</script>