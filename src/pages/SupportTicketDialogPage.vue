<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Back Button -->
        <div class="flex items-center">
          <button
            @click="goBack"
            class="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-1" />
            Назад к поддержке
          </button>
        </div>

        <!-- Loading State - Show spinner during initial load -->
        <div v-if="initialLoading" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-600 dark:text-gray-400">Загрузка тикета...</span>
          </div>
        </div>

        <!-- Error State - Show error only after failed request -->
        <div v-else-if="error" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mt-0.5" />
              <div class="ml-3">
                <h4 class="text-sm font-medium text-red-800 dark:text-red-200">
                  Ошибка загрузки
                </h4>
                <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                  {{ error }}
                </p>
                <div class="mt-3">
                  <button
                    @click="loadTicket"
                    class="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-800 dark:hover:bg-red-700 dark:text-red-100 rounded-md transition-colors"
                  >
                    Повторить попытку
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ticket Content -->
        <div v-else-if="ticket" class="space-y-6">
          <!-- Ticket Header -->
          <TicketHeader 
            :ticket="ticket" 
            @resolve="handleShowResolutionConfirm"
          />

          <!-- Ticket Conversation (Messages + Input + Actions) -->
          <TicketConversation
            :ticket="ticket"
            :messages="ticket.messages"
            :loading="{
              messageSubmission: loading.messageSubmission,
              resolution: loading.resolution
            }"
            :message-error="messageError"
            @add-message="handleAddMessage"
            @clear-message-error="clearMessageError"
          />
        </div>

        <!-- Not Found State -->
        <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="text-center py-12">
            <TicketIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Тикет не найден</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Запрашиваемый тикет не существует или был удален.
            </p>
            <div class="mt-6">
              <button
                @click="goBack"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Вернуться к поддержке
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Resolution Confirmation Modal -->
  <ResolutionConfirmModal
    v-if="showResolutionConfirm"
    :ticket="ticket"
    :loading="loading.resolution"
    @confirm="handleConfirmResolution"
    @cancel="handleCancelResolution"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  TicketIcon,
} from '@heroicons/vue/24/outline'
import { useSupportData } from '@/composables/useSupportData'
import TicketHeader from '@/components/support/TicketHeader.vue'
import TicketConversation from '@/components/support/TicketConversation.vue'
import ResolutionConfirmModal from '@/components/support/ResolutionConfirmModal.vue'

import type { SupportTicket } from '@/types'

// Composables
const route = useRoute()
const router = useRouter()
const {
  currentTicket,
  loading,
  error,
  fetchTicket,
  addMessage,
  resolveTicket,
  clearErrors,
  setCurrentTicket,
} = useSupportData()

// Local state
const ticket = ref<SupportTicket | null>(null)
const messageError = ref<string | null>(null)
const initialLoading = ref(true)
const showResolutionConfirm = ref(false)

// Computed properties
const isLoading = computed(() => loading.value.ticket)

// Load ticket on mount
const loadTicket = async (): Promise<void> => {
  try {
    clearErrors()
    messageError.value = null
    
    const ticketId = route.params.id as string
    if (!ticketId) {
      throw new Error('Ticket ID is required')
    }
    
    await fetchTicket(ticketId)
    ticket.value = currentTicket.value
  } catch (err) {
    console.error('Failed to load ticket:', err)
  } finally {
    initialLoading.value = false
  }
}

// Event handlers
const goBack = (): void => {
  router.push({ name: 'Support' })
}

const handleAddMessage = async (message: string): Promise<void> => {
  try {
    messageError.value = null
    
    if (!ticket.value) {
      throw new Error('No ticket selected')
    }
    
    if (!message?.trim()) {
      messageError.value = 'Сообщение не может быть пустым'
      return
    }
    
    if (message.trim().length < 5) {
      messageError.value = 'Сообщение должно содержать минимум 5 символов'
      return
    }
    
    if (message.trim().length > 1000) {
      messageError.value = 'Сообщение не должно превышать 1000 символов'
      return
    }
    
    const newMessage = await addMessage(ticket.value.id, message.trim())
    
    // Update local ticket with new message
    if (ticket.value) {
      ticket.value.messages.push(newMessage)
      ticket.value.updatedAt = newMessage.createdAt
    }
  } catch (err) {
    messageError.value = err instanceof Error ? err.message : 'Ошибка отправки сообщения'
    console.error('Failed to add message:', err)
  }
}

const handleShowResolutionConfirm = (): void => {
  showResolutionConfirm.value = true
}

const handleConfirmResolution = async (): Promise<void> => {
  try {
    if (!ticket.value) {
      throw new Error('No ticket selected')
    }
    
    const updatedTicket = await resolveTicket(ticket.value.id)
    
    // Update local ticket
    if (ticket.value) {
      ticket.value.status = updatedTicket.status
      ticket.value.resolvedAt = updatedTicket.resolvedAt
      ticket.value.updatedAt = updatedTicket.updatedAt
    }
    
    // Close modal
    showResolutionConfirm.value = false
  } catch (err) {
    console.error('Failed to resolve ticket:', err)
    // Error handling would be implemented here
  }
}

const handleCancelResolution = (): void => {
  showResolutionConfirm.value = false
}

const clearMessageError = (): void => {
  messageError.value = null
}

// Lifecycle
onMounted(() => {
  loadTicket()
})
</script>