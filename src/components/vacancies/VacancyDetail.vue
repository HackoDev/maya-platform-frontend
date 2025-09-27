<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-2">
          {{ vacancy.title }}
        </h2>
        <div v-if="props.showActions" class="flex space-x-2">
          <button
            @click="$emit('edit')"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 w-full sm:w-auto justify-center"
          >
            <PencilIcon class="-ml-1 mr-1 h-4 w-4" />
            Редактировать
          </button>
        </div>
      </div>
    </div>

    <div class="p-4 sm:p-6">
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
          <span class="hidden sm:inline">Создано: </span>{{ formatDate(vacancy.createdAt) }}
        </span>
        <span
          v-if="vacancy.updatedAt !== vacancy.createdAt"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        >
          <span class="hidden sm:inline">Обновлено: </span>{{ formatDate(vacancy.updatedAt) }}
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
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
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
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
            >
              Связаться
            </button>
          </div>
        </div>
      </div>

      <div v-if="props.showActions" class="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          v-if="vacancy.isActive"
          @click="showConfirmation('close')"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
        >
          Закрыть вакансию
        </button>
        <button
          v-else-if="vacancy.isActive === false"
          @click="showConfirmation('publish')"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
        >
          Опубликовать
        </button>
        <button
          v-else-if="vacancy.isActive === false"
          @click="showConfirmation('reopen')"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
        >
          Открыть повторно
        </button>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <ConfirmDialog
    :is-open="showConfirmModal"
    :title="modalConfig.title"
    :message="modalConfig.message"
    :confirm-text="modalConfig.confirmText"
    :cancel-text="modalConfig.cancelText"
    :confirm-button-type="modalConfig.confirmButtonType"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Vacancy } from '@/types/vacancy'
import { PencilIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

interface Props {
  vacancy: Vacancy
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'close'): void
  (e: 'publish'): void
  (e: 'close-vacancy'): void
  (e: 'reopen'): void
  (e: 'contact'): void
}>()

// Modal state management
const showConfirmModal = ref(false)
const pendingAction = ref<'close' | 'publish' | 'reopen' | null>(null)

// Computed properties
const statusConfig = computed(() => {
  switch (props.vacancy.isActive) {
    case true:
      return {
        text: 'Опубликовано',
        classes: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      }
    case false:
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

// Computed properties for modal
const modalConfig = computed(() => {
  switch (pendingAction.value) {
    case 'close':
      return {
        title: 'Закрыть вакансию',
        message: `Вы уверены, что хотите закрыть вакансию "${props.vacancy.title}"? После закрытия вакансия не будет отображаться в поиске.`,
        confirmText: 'Закрыть',
        cancelText: 'Отмена',
        confirmButtonType: 'danger' as const
      }
    case 'publish':
      return {
        title: 'Опубликовать вакансию',
        message: `Вы уверены, что хотите опубликовать вакансию "${props.vacancy.title}"? После публикации вакансия станет доступна для просмотра специалистами.`,
        confirmText: 'Опубликовать',
        cancelText: 'Отмена',
        confirmButtonType: 'primary' as const
      }
    case 'reopen':
      return {
        title: 'Открыть вакансию повторно',
        message: `Вы уверены, что хотите открыть вакансию "${props.vacancy.title}" повторно? Вакансия снова станет доступна для просмотра специалистами.`,
        confirmText: 'Открыть',
        cancelText: 'Отмена',
        confirmButtonType: 'primary' as const
      }
    default:
      return {
        title: 'Подтверждение',
        message: 'Вы уверены?',
        confirmText: 'Подтвердить',
        cancelText: 'Отмена',
        confirmButtonType: 'primary' as const
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

const showConfirmation = (action: 'close' | 'publish' | 'reopen') => {
  pendingAction.value = action
  showConfirmModal.value = true
}

const handleConfirm = () => {
  if (pendingAction.value) {
    switch (pendingAction.value) {
      case 'close':
        emit('close-vacancy')
        break
      case 'publish':
        emit('publish')
        break
      case 'reopen':
        emit('reopen')
        break
    }
  }
  showConfirmModal.value = false
  pendingAction.value = null
}

const handleCancel = () => {
  showConfirmModal.value = false
  pendingAction.value = null
}
</script>
