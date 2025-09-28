<template>
  <BaseModal :show="isOpen" @close="handleClose" size="3xl">
    <template #header>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        {{ isEditing ? 'Редактировать вакансию' : 'Создать вакансию' }}
      </h3>
    </template>

    <template #default>
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Название вакансии
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            maxlength="100"
            :class="[
              'block w-full rounded-md border shadow-sm focus:ring focus:outline-none sm:text-sm',
              formErrors.title 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' 
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:focus:ring-purple-500 dark:focus:border-purple-500 dark:bg-gray-700 dark:text-white'
            ]"
            placeholder="Введите название вакансии"
          />
          <div class="mt-1 flex justify-between items-center">
            <p v-if="formErrors.title" class="text-sm text-red-600 dark:text-red-400">
              {{ formErrors.title }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {{ form.title.length }}/100
            </p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Описание
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="10"
            maxlength="2000"
            :class="[
              'block w-full rounded-md border shadow-sm focus:ring focus:outline-none sm:text-sm resize-y min-h-[200px]',
              formErrors.description 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' 
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:focus:ring-purple-500 dark:focus:border-purple-500 dark:bg-gray-700 dark:text-white'
            ]"
            placeholder="Опишите вакансию подробно"
          />
          <div class="mt-1 flex justify-between items-center">
            <p v-if="formErrors.description" class="text-sm text-red-600 dark:text-red-400">
              {{ formErrors.description }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {{ form.description.length }}/2000
            </p>
          </div>
        </div>

        <!-- AI Assistant -->
        <div v-if="isAdmin" class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                AI Помощник
              </h4>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Сгенерируйте описание и название вакансии на основе уже заполненных данных. 
                Дайте тезисное описание и помощник все сделает за вас!
              </p>
              <button
                type="button"
                @click="handleImproveDescription"
                :disabled="isImproving"
                class="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg v-if="isImproving" class="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ isImproving ? 'Генерируем...' : 'Улучшить описание' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Статус публикации
          </label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 dark:text-gray-400" :class="{ 'font-medium text-gray-900 dark:text-white': !form.isActive }">
              Черновик
            </span>
            <button
              type="button"
              @click="form.isActive = !form.isActive"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                form.isActive ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  form.isActive ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400" :class="{ 'font-medium text-gray-900 dark:text-white': form.isActive }">
              Опубликовано
            </span>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {{ form.isActive ? 'Вакансия будет видна всем пользователям' : 'Вакансия будет скрыта от других пользователей' }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="submitError" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Ошибка при сохранении
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ submitError }}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="handleClose"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
        >
          Отмена
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Сохранение...</span>
          <span v-else>Сохранить</span>
        </button>
      </div>
    </template>
  </BaseModal>

  <!-- AI Preview Modal -->
  <BaseModal :show="showAiPreview" @close="handleCloseAiPreview" size="3xl">
    <template #header>
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          AI Улучшенное описание
        </h3>
      </div>
    </template>

    <template #default>
      <div class="space-y-6">
        <!-- Improved Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Улучшенное название
          </label>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <p class="text-sm text-gray-900 dark:text-white">
              {{ aiImprovedData.title }}
            </p>
          </div>
        </div>

        <!-- Improved Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Улучшенное описание
          </label>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
            <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
              {{ aiImprovedData.description }}
            </p>
          </div>
        </div>

        <!-- AI Info -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
          <div class="flex items-start space-x-2">
            <svg class="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-xs text-blue-700 dark:text-blue-300">
                AI помощник проанализировал ваши данные и предложил улучшенную версию. 
                Вы можете применить изменения или отменить их.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="handleCloseAiPreview"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
        >
          Отмена
        </button>
        <button
          type="button"
          @click="handleApplyAiImprovements"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Применить
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { Vacancy } from '@/types/vacancy'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useUserStore } from '@/stores/user'

interface Props {
  isOpen: boolean
  vacancy?: Vacancy | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', vacancy: Partial<Vacancy>): void
}

const props = withDefaults(defineProps<Props>(), {
  vacancy: null
})

const emit = defineEmits<Emits>()

// Stores
const userStore = useUserStore()

// Form state
const form = reactive({
  title: '',
  description: '',
  isActive: true
})

const formErrors = reactive({
  title: '',
  description: ''
})

const submitError = ref('')
const isSubmitting = ref(false)

// AI Assistant state
const isImproving = ref(false)
const showAiPreview = ref(false)
const aiImprovedData = reactive({
  title: '',
  description: ''
})

// Computed properties
const isEditing = computed(() => !!props.vacancy?.id)
const isAdmin = computed(() => userStore.currentUser?.userType === 'admin')

// Methods
const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.title.trim()) {
    formErrors.title = 'Название обязательно для заполнения'
    isValid = false
  } else if (form.title.length > 100) {
    formErrors.title = 'Название не должно превышать 100 символов'
    isValid = false
  }

  if (!form.description.trim()) {
    formErrors.description = 'Описание обязательно для заполнения'
    isValid = false
  } else if (form.description.length > 2000) {
    formErrors.description = 'Описание не должно превышать 2000 символов'
    isValid = false
  }

  return isValid
}

const clearErrors = () => {
  formErrors.title = ''
  formErrors.description = ''
  submitError.value = ''
}

const handleSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    emit('save', { ...form })
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Произошла ошибка при сохранении'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  clearErrors()
  emit('close')
}

// AI Assistant methods
const handleImproveDescription = async () => {
  isImproving.value = true
  
  try {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate improved content based on current form data
    const improvedTitle = generateImprovedTitle(form.title)
    const improvedDescription = generateImprovedDescription(form.description)
    
    aiImprovedData.title = improvedTitle
    aiImprovedData.description = improvedDescription
    
    showAiPreview.value = true
  } catch (error) {
    console.error('AI improvement error:', error)
  } finally {
    isImproving.value = false
  }
}

const generateImprovedTitle = (currentTitle: string): string => {
  if (!currentTitle.trim()) {
    return 'Senior Frontend Developer (React/Vue.js)'
  }
  
  // Simulate AI improvement
  const improvements = [
    'Senior',
    'Lead',
    'Expert',
    'Senior',
    'Principal'
  ]
  
  const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)]
  return `${randomImprovement} ${currentTitle}`
}

const generateImprovedDescription = (currentDescription: string): string => {
  if (!currentDescription.trim()) {
    return `Мы ищем опытного разработчика для работы над современными веб-приложениями.

**Что мы предлагаем:**
• Работа с современными технологиями (React, Vue.js, TypeScript)
• Интересные проекты и возможность профессионального роста
• Гибкий график работы и удаленный формат
• Конкурентную заработную плату и социальный пакет

**Требования:**
• Опыт разработки на JavaScript/TypeScript от 3 лет
• Знание современных фреймворков (React, Vue.js)
• Опыт работы с REST API и GraphQL
• Понимание принципов SOLID и паттернов проектирования

**Будет плюсом:**
• Опыт работы с Node.js
• Знание Docker и CI/CD
• Опыт работы в команде разработки

Присоединяйтесь к нашей команде и создавайте продукты, которыми пользуются тысячи людей!`
  }
  
  // Simulate AI improvement by adding structure and formatting
  return `**Обновленное описание вакансии:**

${currentDescription}

**Дополнительные требования:**
• Опыт работы в команде разработки
• Знание современных инструментов разработки
• Готовность к изучению новых технологий

**Мы предлагаем:**
• Интересные проекты и возможность профессионального роста
• Современный технологический стек
• Дружную команду профессионалов
• Возможность влиять на архитектурные решения

Присоединяйтесь к нам и создавайте продукты будущего!`
}

const handleCloseAiPreview = () => {
  showAiPreview.value = false
  aiImprovedData.title = ''
  aiImprovedData.description = ''
}

const handleApplyAiImprovements = () => {
  if (aiImprovedData.title) {
    form.title = aiImprovedData.title
  }
  if (aiImprovedData.description) {
    form.description = aiImprovedData.description
  }
  
  handleCloseAiPreview()
}

// Watch for vacancy changes to populate form
watch(
  () => props.vacancy,
  (newVacancy) => {
    if (newVacancy) {
      form.title = newVacancy.title
      form.description = newVacancy.description
      form.isActive = newVacancy.isActive
    } else {
      // Reset form for new vacancy
      form.title = ''
      form.description = ''
      form.isActive = true
    }
    // Clear errors when form is opened
    clearErrors()
  },
  { immediate: true }
)
</script>