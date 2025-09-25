<template>
  <div class="superpower-step">
    <div class="step-header">
      <h2>Коротко о себе</h2>
      <p>Твоя суперспособность или фишка (до 200 символов)</p>
    </div>

    <div class="step-content">
      <!-- Text Area -->
      <div class="textarea-container">
        <textarea
          :value="profile?.superpower || ''"
          @input="updateSuperpower(($event.target as HTMLTextAreaElement).value)"
          :placeholder="placeholder"
          rows="4"
          maxlength="200"
          class="textarea"
          :class="{ 
            'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500': validationError,
            'border-green-300 dark:border-green-600': isValid && (profile?.superpower?.length || 0) > 0
          }"
        ></textarea>
        
        <!-- Character Counter -->
        <div class="character-counter">
          {{ characterCount }}/200
        </div>
      </div>

      <!-- Character Counter Bar -->
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :class="getCounterBarColor()"
          :style="{ width: `${(characterCount / 200) * 100}%` }"
        ></div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="validation-error">
        <p>{{ validationError }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="isValid && (profile?.superpower?.length || 0) > 0" class="success-message">
        <p>✓ Отлично! Ваше описание соответствует требованиям</p>
      </div>

      <!-- Examples -->
      <div class="examples-section">
        <h4>💡 Примеры хороших описаний:</h4>
        <ul class="examples-list">
          <li>"Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте."</li>
          <li>"Помогаю бизнесу автоматизировать продажи через AI-воронки. Увеличиваю конверсию в 2-3 раза."</li>
          <li>"Специализируюсь на обучении нейросетям. За 5 лет обучил 500+ предпринимателей."</li>
        </ul>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <h4>⚡ Советы для создания цепляющего описания:</h4>
        <ul class="tips-list">
          <li>Укажите конкретный результат, который вы даете клиентам</li>
          <li>Используйте цифры и метрики, если они есть</li>
          <li>Избегайте общих фраз типа "качественно и быстро"</li>
          <li>Покажите свою уникальность и экспертность</li>
        </ul>
      </div>
    </div>

    <div class="step-actions">
      <button
        @click="completeStep"
        :disabled="!isValid"
        class="btn btn-primary"
      >
        Продолжить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

interface Props {
  profile: NeuralNetworkProfile | null
}

interface Emits {
  (e: 'update', updates: Partial<NeuralNetworkProfile>): void
  (e: 'complete', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const validationError = ref('')
const placeholder = 'Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте.'

const characterCount = computed(() => {
  return props.profile?.superpower?.length || 0
})

const isValid = computed(() => {
  const text = props.profile?.superpower || ''
  return text.length >= 10 && text.length <= 200 && text.trim().length > 0
})

const getCounterBarColor = () => {
  const count = characterCount.value
  if (count === 0) return 'bg-gray-300'
  if (count < 10) return 'bg-red-400'
  if (count <= 150) return 'bg-green-400'
  if (count <= 180) return 'bg-yellow-400'
  return 'bg-red-400'
}

const updateSuperpower = (value: string) => {
  emit('update', { superpower: value })
  validateStep()
}

const validateStep = () => {
  validationError.value = ''
  const text = (props.profile?.superpower || '').trim()
  
  if (!text) {
    validationError.value = 'Поле обязательно для заполнения'
  } else if (text.length < 10) {
    validationError.value = 'Минимум 10 символов'
  } else if (text.length > 200) {
    validationError.value = 'Максимум 200 символов'
  }
}

const completeStep = () => {
  if (isValid.value) {
    emit('complete', 2)
  }
}

// Watch for changes and validate
watch(() => props.profile?.superpower, validateStep)
</script>

<style scoped>
.superpower-step {
  @apply w-full p-6;
}

.step-header {
  @apply mb-4;
}

.step-header h2 {
  @apply text-2xl font-bold text-gray-900 dark:text-white mb-2;
}

.step-header p {
  @apply text-gray-600 dark:text-gray-400;
}

.textarea-container {
  @apply relative mb-4;
}

.textarea {
  @apply w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none;
}

.character-counter {
  @apply absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-1 rounded;
}

.progress-bar {
  @apply w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4;
}

.progress-fill {
  @apply h-2 rounded-full transition-all duration-300;
}

.validation-error {
  @apply p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md mb-4;
}

.validation-error p {
  @apply text-sm text-red-600 dark:text-red-400;
}

.success-message {
  @apply p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md mb-4;
}

.success-message p {
  @apply text-sm text-green-600 dark:text-green-400;
}

.examples-section {
  @apply p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4;
}

.examples-section h4 {
  @apply text-sm font-medium text-blue-900 dark:text-blue-200 mb-2;
}

.examples-list {
  @apply text-sm text-blue-800 dark:text-blue-300 space-y-1;
}

.examples-list li {
  @apply list-disc list-inside;
}

.tips-section {
  @apply p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4;
}

.tips-section h4 {
  @apply text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2;
}

.tips-list {
  @apply text-sm text-yellow-800 dark:text-yellow-300 space-y-1;
}

.tips-list li {
  @apply list-disc list-inside;
}

.step-actions {
  @apply flex justify-end;
}

.btn {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-colors;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
