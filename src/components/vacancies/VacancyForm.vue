<template>
  <BaseModal :show="isOpen" @close="handleClose" size="xl">
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { Vacancy } from '@/types/vacancy'
import BaseModal from '@/components/ui/BaseModal.vue'

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

// Computed properties
const isEditing = computed(() => !!props.vacancy?.id)

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