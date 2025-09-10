<template>
  <div 
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 
           hover:shadow-md transition-shadow duration-200 cursor-pointer"
    :data-testid="`ticket-item-${ticket.id}`"
    @click="handleClick"
    role="button"
    tabindex="0"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <TicketIcon class="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            Тикет #{{ shortTicketId }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(ticket.createdAt) }}
          </p>
        </div>
      </div>
      
      <!-- Status and Priority -->
      <div class="flex items-center space-x-2">
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="statusClasses[ticket.status]"
        >
          {{ statusLabels[ticket.status] }}
        </span>
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="priorityClasses[ticket.priority]"
        >
          {{ priorityLabels[ticket.priority] }}
        </span>
      </div>
    </div>

    <!-- Message Preview -->
    <div class="mb-3">
      <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {{ truncatedMessage }}
      </p>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center space-x-4">
        <!-- Message count -->
        <div class="flex items-center space-x-1">
          <ChatBubbleLeftRightIcon class="h-4 w-4" />
          <span>{{ ticket.messages.length }} сообщени{{ getMessageEnding(ticket.messages.length) }}</span>
        </div>
        
        <!-- Assigned to -->
        <div v-if="ticket.assignedTo" class="flex items-center space-x-1">
          <UserIcon class="h-4 w-4" />
          <span>{{ ticket.assignedTo }}</span>
        </div>
      </div>
      
      <!-- Last updated -->
      <div class="flex items-center space-x-1">
        <ClockIcon class="h-4 w-4" />
        <span>{{ formatRelativeDate(ticket.updatedAt) }}</span>
      </div>
    </div>

    <!-- Resolved indicator -->
    <div 
      v-if="ticket.resolvedAt" 
      class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700"
    >
      <div class="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
        <CheckCircleIcon class="h-4 w-4" />
        <span>Решено {{ formatDate(ticket.resolvedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  TicketIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import type { SupportTicket } from '@/types'

interface Props {
  ticket: SupportTicket
}

interface Emits {
  (e: 'click', ticket: SupportTicket): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Status styling
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

// Priority styling
const priorityClasses = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const priorityLabels = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный',
}

// Computed properties
const shortTicketId = computed(() => {
  return props.ticket.id.replace('ticket-', '').slice(0, 8)
})

const truncatedMessage = computed(() => {
  const maxLength = 100
  const message = props.ticket.message
  return message.length > maxLength 
    ? message.slice(0, maxLength) + '...' 
    : message
})

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

const getMessageEnding = (count: number): string => {
  if (count === 1) return 'е'
  if (count >= 2 && count <= 4) return 'я'
  return 'й'
}

// Event handlers
const handleClick = (): void => {
  emit('click', props.ticket)
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