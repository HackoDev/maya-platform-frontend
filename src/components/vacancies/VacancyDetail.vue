<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ vacancy.title }}
        </h2>
        <div class="flex space-x-2">
          <button
            @click="$emit('edit')"
            class="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
          >
            <PencilIcon class="-ml-1 mr-1 h-4 w-4" />
            Редактировать
          </button>
          <button
            @click="$emit('close')"
            class="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
          >
            <XMarkIcon class="-ml-1 mr-1 h-4 w-4" />
            Закрыть
          </button>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="flex flex-wrap gap-2 mb-6">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="statusConfig.classes"
        >
          {{ statusConfig.text }}
        </span>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        >
          Создано: {{ formatDate(vacancy.createdAt) }}
        </span>
        <span
          v-if="vacancy.updatedAt !== vacancy.createdAt"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        >
          Обновлено: {{ formatDate(vacancy.updatedAt) }}
        </span>
      </div>

      <div class="prose prose-sm max-w-none dark:prose-invert">
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {{ vacancy.description }}
        </p>
      </div>

      <!-- Client Information Section -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Информация о клиенте</h3>
        <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UserCircleIcon class="h-10 w-10 text-gray-400" />
              <div class="ml-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ vacancy.clientName }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Клиент</p>
              </div>
            </div>
            <button
              @click="$emit('contact')"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
            >
              Связаться
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end space-x-3">
        <button
          v-if="vacancy.status === 'published'"
          @click="$emit('close-vacancy')"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
        >
          Закрыть вакансию
        </button>
        <button
          v-else-if="vacancy.status === 'draft'"
          @click="$emit('publish')"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900"
        >
          Опубликовать
        </button>
        <button
          v-else-if="vacancy.status === 'closed'"
          @click="$emit('reopen')"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
        >
          Открыть повторно
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Vacancy } from '@/types/vacancy'
import { PencilIcon, XMarkIcon, UserCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  vacancy: Vacancy
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'close'): void
  (e: 'publish'): void
  (e: 'close-vacancy'): void
  (e: 'reopen'): void
  (e: 'contact'): void
}>()

// Computed properties
const statusConfig = computed(() => {
  switch (props.vacancy.status) {
    case 'draft':
      return {
        text: 'Черновик',
        classes: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      }
    case 'published':
      return {
        text: 'Опубликовано',
        classes: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      }
    case 'closed':
      return {
        text: 'Закрыто',
        classes: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      }
    default:
      return {
        text: 'Черновик',
        classes: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      }
  }
})

// Methods
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
