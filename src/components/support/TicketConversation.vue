<template>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow">
    <!-- Messages List -->
    <MessageList :messages="messages" class="mb-6" />

    <!-- Closed Ticket Message -->
    <div 
      v-if="ticket.status === 'resolved' || ticket.status === 'closed'" 
      class="bg-white dark:bg-gray-700 rounded-lg shadow p-8 text-center"
    >
      <div class="flex flex-col items-center justify-center">
        <CheckCircleIcon class="h-12 w-12 text-green-500 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Ваш запрос отмечен как решенный
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          Если у вас возникнут дополнительные вопросы, вы можете создать новую заявку в поддержку.
        </p>
      </div>
    </div>

    <!-- Message Input and Actions in same container (only for open tickets) -->
    <div 
      v-else-if="ticket.status === 'open' || ticket.status === 'in-progress'"
      class="bg-white dark:bg-gray-700 rounded-lg shadow p-4"
    >
      <!-- Message Input -->
      <MessageInput
        ref="messageInputRef"
        :loading="loading.messageSubmission"
        :error="messageError"
        @submit="handleAddMessage"
        @clear-error="clearMessageError"
        class="mb-4"
      />

      <!-- Send Button -->
      <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          @click="handleSendMessage"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          :disabled="loading.messageSubmission || !isMessageValid"
        >
          <span v-if="!loading.messageSubmission">Отправить</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Отправка...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import MessageList from '@/components/support/MessageList.vue'
import MessageInput from '@/components/support/MessageInput.vue'
import type { SupportTicket, SupportMessage } from '@/types'

interface Props {
  ticket: SupportTicket
  messages: SupportMessage[]
  loading: {
    messageSubmission: boolean
    resolution: boolean
  }
  messageError: string | null
}

interface Emits {
  (e: 'add-message', message: string): void
  (e: 'clear-message-error'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Template refs
const messageInputRef = ref<InstanceType<typeof MessageInput> | null>(null)

// Computed properties
const isMessageValid = computed(() => {
  if (messageInputRef.value) {
    return messageInputRef.value.isMessageValid
  }
  return false
})

// Event handlers
const handleAddMessage = (message: string): void => {
  emit('add-message', message)
}

const clearMessageError = (): void => {
  emit('clear-message-error')
}

const handleSendMessage = (): void => {
  if (messageInputRef.value) {
    messageInputRef.value.submit()
  }
}
</script>