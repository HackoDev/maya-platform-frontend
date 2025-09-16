<template>
  <BaseModal :show="isOpen" @close="handleCancel">
    <template #header>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        {{ title }}
      </h3>
    </template>

    <template #default>
      <div class="mt-2">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ message }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          :class="[
            'inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
            confirmButtonType === 'danger' 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          ]"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'

interface Props {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmButtonType?: 'primary' | 'danger'
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Подтверждение',
  message: 'Вы уверены?',
  confirmText: 'Подтвердить',
  cancelText: 'Отмена',
  confirmButtonType: 'danger'
})

const emit = defineEmits<Emits>()

const handleConfirm = (): void => {
  emit('confirm')
}

const handleCancel = (): void => {
  emit('cancel')
}
</script>