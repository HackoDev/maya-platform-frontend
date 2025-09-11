<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Добавить сообщение
    </h2>
    
    <!-- Error Message -->
    <div 
      v-if="error"
      class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
    >
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div class="ml-2">
          <p class="text-sm text-red-700 dark:text-red-300">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Message Textarea -->
      <div>
        <label 
          for="message" 
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Ваше сообщение
        </label>
        <textarea
          id="message"
          v-model="messageText"
          rows="4"
          placeholder="Введите ваше сообщение..."
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                 focus:outline-none focus:ring-blue-500 focus:border-blue-500
                 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          :disabled="loading"
        />
        
        <!-- Character count -->
        <div class="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{{ messageText.length }}/1000 символов</span>
          <span v-if="messageText.length > 1000" class="text-red-500">
            Превышен лимит символов
          </span>
        </div>
      </div>
      
      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          :disabled="loading || !isMessageValid"
        >
          <span v-if="!loading">Отправить</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Отправка...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  loading: boolean
  error: string | null
}

interface Emits {
  (e: 'submit', message: string): void
  (e: 'clear-error'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state
const messageText = ref('')

// Computed properties
const isMessageValid = computed(() => {
  return messageText.value.trim().length >= 5 && 
         messageText.value.trim().length <= 1000
})

// Event handlers
const handleSubmit = (): void => {
  if (!isMessageValid.value) return
  
  emit('submit', messageText.value.trim())
  messageText.value = '' // Clear input after submission
}

// Watch for error changes to clear it when user starts typing
const handleMessageInput = (): void => {
  if (props.error) {
    emit('clear-error')
  }
}

// Watch for input changes
messageText.value = '' // Initialize with empty string
</script>