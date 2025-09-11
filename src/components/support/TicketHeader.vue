<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-t-4 border-blue-500">
    <!-- Ticket ID and Status -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <TicketIcon class="h-6 w-6 text-gray-400" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            Тикет #{{ shortTicketId }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Создан {{ formatDate(ticket.createdAt) }}
          </p>
        </div>
      </div>
      
      <div class="mt-3 sm:mt-0">
        <span 
          class="px-3 py-1 text-sm font-medium rounded-full"
          :class="statusClasses[ticket.status]"
        >
          {{ statusLabels[ticket.status] }}
        </span>
      </div>
    </div>

    <!-- Ticket Message -->
    <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <p class="text-gray-700 dark:text-gray-300">
        {{ ticket.message }}
      </p>
    </div>

    <!-- Metadata with Action Buttons (only for open/in-progress tickets) -->
    <div 
      v-if="ticket.status === 'open' || ticket.status === 'in-progress'"
      class="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400"
    >
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-1">
          <ClockIcon class="h-4 w-4" />
          <span>Последнее обновление: {{ formatRelativeDate(ticket.updatedAt) }}</span>
        </div>
        
        <div v-if="ticket.assignedTo" class="flex items-center space-x-1">
          <UserIcon class="h-4 w-4" />
          <span>Назначен: {{ ticket.assignedTo }}</span>
        </div>
        
        <div v-if="ticket.resolvedAt" class="flex items-center space-x-1">
          <CheckCircleIcon class="h-4 w-4" />
          <span>Решено: {{ formatDate(ticket.resolvedAt) }}</span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <!-- Resolve Button (only for open/in-progress tickets) -->
        <button
          v-if="(ticket.status === 'open' || ticket.status === 'in-progress') && !ticket.resolvedAt"
          @click="handleResolve"
          type="button"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <CheckCircleIcon class="h-4 w-4 mr-1" />
          Отметить как решенный
        </button>
      </div>
    </div>
    
    <!-- Closed Ticket Metadata (only for resolved/closed tickets) -->
    <div 
      v-else
      class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
    >
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-1">
          <ClockIcon class="h-4 w-4" />
          <span>Последнее обновление: {{ formatRelativeDate(ticket.updatedAt) }}</span>
        </div>
        
        <div v-if="ticket.assignedTo" class="flex items-center space-x-1">
          <UserIcon class="h-4 w-4" />
          <span>Назначен: {{ ticket.assignedTo }}</span>
        </div>
        
        <div v-if="ticket.resolvedAt" class="flex items-center space-x-1">
          <CheckCircleIcon class="h-4 w-4" />
          <span>Решено: {{ formatDate(ticket.resolvedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  TicketIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import type { SupportTicket } from '@/types'

interface Props {
  ticket: SupportTicket
}

interface Emits {
  (e: 'resolve'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// Status styling (matching SupportTicketItem.vue)
const statusClasses = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

const statusLabels = {
  open: 'Открыт',
  'in-progress': 'В работе',
  resolved: 'Решен',
  closed: 'Закрыт',
}

// Computed properties
const shortTicketId = computed(() => {
  return props.ticket.id.replace('ticket-', '').slice(0, 8)
})

// Event handlers
const handleResolve = (): void => {
  emit('resolve')
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

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'только что'
  } else if (diffInHours < 24) {
    return `${diffInHours}ч назад`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}д назад`
  }
}
</script>