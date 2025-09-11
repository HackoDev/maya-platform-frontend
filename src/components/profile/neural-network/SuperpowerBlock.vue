<template>
  <div class="superpower-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 2. Коротко о себе
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Твоя суперспособность или фишка
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Расскажите кратко, что вас отличает от других специалистов (до 200 символов)
      </p>
    </div>

    <div class="space-y-4">
      <!-- Text Area -->
      <div class="relative">
        <textarea
          :value="formState.superpower"
          @input="updateSuperpower(($event.target as HTMLTextAreaElement).value)"
          :placeholder="placeholder"
          rows="4"
          maxlength="200"
          class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          :class="{ 
            'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500': validationError,
            'border-green-300 dark:border-green-600': isValid && formState.superpower.length > 0
          }"
        ></textarea>
        
        <!-- Character Counter -->
        <div class="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-1 rounded">
          {{ characterCount }}/200
        </div>
      </div>

      <!-- Character Counter Bar -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="getCounterBarColor()"
          :style="{ width: `${(characterCount / 200) * 100}%` }"
        ></div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
        <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="isValid && formState.superpower.length > 0" class="p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md">
        <p class="text-sm text-green-600 dark:text-green-400">
          ✓ Отлично! Ваше описание соответствует требованиям
        </p>
      </div>

      <!-- Examples -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Примеры хороших описаний:
        </h4>
        <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• "Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте."</li>
          <li>• "Помогаю бизнесу автоматизировать продажи через AI-воронки. Увеличиваю конверсию в 2-3 раза."</li>
          <li>• "Специализируюсь на обучении нейросетям. За 5 лет обучил 500+ предпринимателей."</li>
        </ul>
      </div>

      <!-- Tips -->
      <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h4 class="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">
          ⚡ Советы для создания цепляющего описания:
        </h4>
        <ul class="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
          <li>• Укажите конкретный результат, который вы даете клиентам</li>
          <li>• Используйте цифры и метрики, если они есть</li>
          <li>• Избегайте общих фраз типа "качественно и быстро"</li>
          <li>• Покажите свою уникальность и экспертность</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NeuralNetworkFormState } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const validationError = ref('')
const placeholder = 'Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте.'

const characterCount = computed(() => {
  return props.formState.superpower.length
})

const isValid = computed(() => {
  const text = props.formState.superpower
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
  emit('update', 'superpower', 'text', value)
  validateBlock()
}

const validateBlock = () => {
  validationError.value = ''
  const text = props.formState.superpower.trim()
  
  if (!text) {
    validationError.value = 'Поле обязательно для заполнения'
  } else if (text.length < 10) {
    validationError.value = 'Минимум 10 символов'
  } else if (text.length > 200) {
    validationError.value = 'Максимум 200 символов'
  }
  
  emit('validate', '2')
}

// Watch for changes and validate
watch(() => props.formState.superpower, validateBlock)
</script>