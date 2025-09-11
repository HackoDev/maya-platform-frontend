<template>
  <div>
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
      
      <!-- Submit Button (hidden by default, exposed via slot) -->
      <div class="hidden">
        <button
          type="submit"
          ref="submitButton"
        >
          Отправить
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

// Template refs
const submitButton = ref<HTMLButtonElement | null>(null)

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

// Expose method to trigger submit from parent and access message text
defineExpose({
  submit: () => {
    if (submitButton.value) {
      submitButton.value.click()
    }
  },
  messageText: messageText,
  isMessageValid: isMessageValid
})

// Watch for error changes to clear it when user starts typing
const handleMessageInput = (): void => {
  if (props.error) {
    emit('clear-error')
  }
}

// Watch for input changes
messageText.value = '' // Initialize with empty string
</script>