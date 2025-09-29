<template>
  <div class="space-y-6">
    <!-- Section Header with Toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <PlusCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Обратиться в поддержку
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Опишите вашу проблему или задайте вопрос
          </p>
        </div>
      </div>
      
      <button
        type="button"
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900"
        @click="toggleForm"
        :aria-expanded="visible"
        aria-controls="support-form"
      >
        {{ visible ? 'Скрыть форму' : 'Задать вопрос' }}
      </button>
    </div>

    <!-- Form Container with Slide Animation -->
    <Transition
      name="slide"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div 
        v-show="visible"
        id="support-form"
        class="overflow-hidden"
        role="region"
        aria-labelledby="support-form-title"
      >
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 id="support-form-title" class="sr-only">
            Форма обращения в поддержку
          </h3>
          
          <!-- Success Message -->
          <div 
            v-if="showSuccessMessage"
            class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div class="flex">
              <CheckCircleIcon class="h-5 w-5 text-green-400 mt-0.5" />
              <div class="ml-3">
                <h4 class="text-sm font-medium text-green-800 dark:text-green-200">
                  Сообщение отправлено!
                </h4>
                <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                  Ваше обращение получено. Мы ответим в течение 24 часов.
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div 
            v-if="error"
            class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div class="flex">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mt-0.5" />
              <div class="ml-3">
                <h4 class="text-sm font-medium text-red-800 dark:text-red-200">
                  Ошибка отправки
                </h4>
                <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                  {{ error }}
                </p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Message Input -->
            <div>
              <label 
                for="support-message" 
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Сообщение <span class="text-red-500">*</span>
              </label>
              <textarea
                id="support-message"
                v-model="formData.message"
                rows="4"
                placeholder="Опишите вашу проблему или вопрос подробно..."
                class="block w-full px-3 py-3 border rounded-lg resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-200"
                :class="[
                  validationErrors.message 
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                  'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                ]"
                :disabled="loading"
                @blur="validateMessage"
                @input="clearMessageError"
              />
              
              <!-- Character count and validation -->
              <div class="mt-2 flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formData.message.length }}/1000 символов
                </div>
                <div v-if="validationErrors.message" class="text-xs text-red-600 dark:text-red-400">
                  {{ validationErrors.message }}
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-between pt-4">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                <span class="text-red-500">*</span> Обязательные поля
              </div>
              
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 
                         text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
                         transition-colors duration-200 dark:focus:ring-offset-gray-900"
                  @click="handleCancel"
                  :disabled="loading"
                >
                  Отмена
                </button>
                
                <button
                  type="submit"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium 
                         rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 
                         transition-colors duration-200 relative dark:focus:ring-offset-gray-900 disabled:bg-blue-400"
                  :disabled="loading || !isFormValid"
                >
                  <span v-if="!loading">Отправить сообщение</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Отправка...
                  </span>
                </button>
              </div>
            </div>
          </form>

          <!-- Tips -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Советы для быстрого решения:
            </h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Опишите проблему максимально подробно</li>
              <li>• Укажите, какие действия вы уже предпринимали</li>
              <li>• Приложите скриншоты, если это поможет</li>
              <li>• Укажите браузер и устройство, если проблема техническая</li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  PlusCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

interface Props {
  visible: boolean
  loading: boolean
  error?: string | null
}

interface Emits {
  (e: 'toggle'): void
  (e: 'submit', message: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  error: null
})

const emit = defineEmits<Emits>()

// Form state
const formData = ref({
  message: '',
})

const validationErrors = ref({
  message: '',
})

const showSuccessMessage = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return formData.value.message.trim().length >= 10 && 
         formData.value.message.trim().length <= 1000 &&
         !validationErrors.value.message
})

// Validation methods
const validateMessage = (): void => {
  const message = formData.value.message.trim()
  
  if (!message) {
    validationErrors.value.message = 'Сообщение обязательно для заполнения'
  } else if (message.length < 10) {
    validationErrors.value.message = 'Сообщение должно содержать минимум 10 символов'
  } else if (message.length > 1000) {
    validationErrors.value.message = 'Сообщение не должно превышать 1000 символов'
  } else {
    validationErrors.value.message = ''
  }
}

const clearMessageError = (): void => {
  if (validationErrors.value.message) {
    validationErrors.value.message = ''
  }
}

// Event handlers
const toggleForm = (): void => {
  emit('toggle')
}

const handleSubmit = async (): Promise<void> => {
  // Validate before submit
  validateMessage()
  
  if (!isFormValid.value) {
    return
  }

  try {
    emit('submit', formData.value.message.trim())
    
    // Show success message
    showSuccessMessage.value = true
    
    // Reset form
    formData.value.message = ''
    validationErrors.value.message = ''
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 5000)
    
  } catch (error) {
    console.error('Form submission error:', error)
  }
}

const handleCancel = (): void => {
  // Reset form
  formData.value.message = ''
  validationErrors.value.message = ''
  showSuccessMessage.value = false
  
  emit('cancel')
}

// Animation handlers
const onEnter = (el: Element): void => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.offsetHeight // trigger reflow
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
}

const onLeave = (el: Element): void => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.offsetHeight // trigger reflow
  htmlEl.style.height = '0'
}

// Watch for prop changes
watch(() => props.visible, (visible) => {
  if (!visible) {
    showSuccessMessage.value = false
  }
})

watch(() => props.error, (error) => {
  if (error) {
    showSuccessMessage.value = false
  }
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: height 0.4s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  height: 0;
}
</style>