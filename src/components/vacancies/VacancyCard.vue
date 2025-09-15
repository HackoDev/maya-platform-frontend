<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    :class="{ 'cursor-pointer': !isOwner }"
  >
    <div class="p-6">
      <div class="flex justify-between items-start">
        <div @click="!isOwner ? $emit('view', vacancy) : null">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ vacancy.title }}
          </h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ vacancy.description }}
          </p>
        </div>
        <button
          v-if="isOwner"
          @click.stop="$emit('edit')"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          aria-label="Редактировать"
        >
          <PencilIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="statusConfig.classes"
        >
          {{ statusConfig.text }}
        </span>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        >
          {{ formatDate(vacancy.createdAt) }}
        </span>
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <button
          v-if="isOwner"
          @click.stop="$emit('delete')"
          class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
        >
          Удалить
        </button>
        <button
          v-else-if="userStore.currentUser?.userType === 'specialist'"
          @click.stop="$emit('contact', vacancy)"
          class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
        >
          Связаться
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Vacancy } from '@/types/vacancy'
import { PencilIcon } from '@heroicons/vue/24/outline'

interface Props {
  vacancy: Vacancy
  isOwner?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOwner: false
})

const emit = defineEmits<{
  (e: 'view', vacancy: Vacancy): void
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'contact', vacancy: Vacancy): void
}>()

// Stores
const userStore = useUserStore()

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
    month: 'short',
    day: 'numeric',
  })
}
</script>