<template>
  <div class="specializations-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 1. Кто ты?
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Я специализируюсь на:
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Выберите области вашей экспертизы (можно выбрать несколько)
      </p>
    </div>

    <div class="space-y-4">
      <!-- Specialization Options Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          v-for="specialization in specializations"
          :key="specialization.key"
          class="relative flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600': formState.specializations[specialization.key] }"
        >
          <input
            type="checkbox"
            :checked="formState.specializations[specialization.key]"
            @change="updateSpecialization(specialization.key, ($event.target as HTMLInputElement).checked)"
            class="sr-only"
          />
          <div class="flex items-center">
            <div
              class="flex-shrink-0 w-5 h-5 border-2 rounded transition-colors"
              :class="formState.specializations[specialization.key] 
                ? 'bg-blue-600 border-blue-600' 
                : 'border-gray-300 dark:border-gray-500'"
            >
              <svg
                v-if="formState.specializations[specialization.key]"
                class="w-3 h-3 text-white mx-auto mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ specialization.label }}
              </div>
              <div v-if="specialization.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ specialization.description }}
              </div>
            </div>
          </div>
        </label>
      </div>

      <!-- Custom Specializations -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Дополнительные специализации (если не нашли подходящих выше)
        </label>
        <div class="space-y-2">
          <div
            v-for="(custom, index) in customSpecializations"
            :key="index"
            class="flex items-center space-x-2"
          >
            <input
              v-model="custom.value"
              type="text"
              placeholder="Введите специализацию..."
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              @input="updateCustomSpecializations"
            />
            <button
              @click="removeCustomSpecialization(index)"
              class="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click="addCustomSpecialization"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить специализацию
          </button>
        </div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
        <p class="text-sm text-red-600 dark:text-red-400">{{ validationError }}</p>
      </div>

      <!-- Selection Counter -->
      <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Выбрано: {{ selectedCount }} из {{ maxSelections }} возможных
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

const specializations = [
  {
    key: 'neuralAssistants',
    label: 'Нейроассистенты (AI-боты)',
    description: 'Создание и настройка AI-ботов для автоматизации общения'
  },
  {
    key: 'neuralFunnels',
    label: 'Нейроворонки (продажи + автоматизация)',
    description: 'Автоматизированные воронки продаж с использованием ИИ'
  },
  {
    key: 'contentGeneration',
    label: 'Контент с помощью нейросетей',
    description: 'Генерация текстового контента через AI-инструменты'
  },
  {
    key: 'visuals',
    label: 'Визуалы (обложки, графика, Reels)',
    description: 'Создание визуального контента с помощью нейросетей'
  },
  {
    key: 'audioVideoProcessing',
    label: 'Обработка аудио и видео',
    description: 'AI-обработка мультимедийного контента'
  },
  {
    key: 'promptBases',
    label: 'Базы промптов',
    description: 'Создание коллекций эффективных промптов'
  },
  {
    key: 'chatbotSetup',
    label: 'Настройка чат-ботов',
    description: 'Разработка и внедрение чат-ботов для бизнеса'
  },
  {
    key: 'neuralNetworkTraining',
    label: 'Обучение других нейросетям',
    description: 'Консультации и обучение работе с AI-инструментами'
  }
]

const customSpecializations = ref<{ value: string }[]>([])
const validationError = ref('')
const maxSelections = 8

const selectedCount = computed(() => {
  return Object.values(props.formState.specializations).filter(value => 
    typeof value === 'boolean' && value
  ).length
})

// Initialize custom specializations from form state
if (props.formState.specializations.customSpecializations?.length) {
  customSpecializations.value = props.formState.specializations.customSpecializations.map(value => ({ value }))
}

const updateSpecialization = (key: string, checked: boolean) => {
  emit('update', 'specializations', key, checked)
  validateBlock()
}

const addCustomSpecialization = () => {
  customSpecializations.value.push({ value: '' })
}

const removeCustomSpecialization = (index: number) => {
  customSpecializations.value.splice(index, 1)
  updateCustomSpecializations()
}

const updateCustomSpecializations = () => {
  const customValues = customSpecializations.value
    .map(item => item.value.trim())
    .filter(value => value.length > 0)
  
  emit('update', 'specializations', 'customSpecializations', customValues)
  validateBlock()
}

const validateBlock = () => {
  validationError.value = ''
  
  const totalSelected = selectedCount.value + (props.formState.specializations.customSpecializations?.length || 0)
  
  if (totalSelected === 0) {
    validationError.value = 'Выберите хотя бы одну специализацию'
  } else if (totalSelected > maxSelections) {
    validationError.value = `Максимум ${maxSelections} специализаций`
  }
  
  emit('validate', '1')
}

// Watch for changes and validate
watch(() => props.formState.specializations, validateBlock, { deep: true })
</script>