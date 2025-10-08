<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                Создать приглашение
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                @click="handleClose"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <CheckCircleIcon class="h-5 w-5 text-green-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800 dark:text-green-200">
                    Приглашение успешно создано!
                  </p>
                </div>
              </div>
            </div>

            <!-- Form fields -->
            <div class="space-y-4">
              <!-- User Type -->
              <div>
                <label for="userType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тип пользователя *
                </label>
                <select
                  id="userType"
                  v-model="formData.userType"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="client">Клиент</option>
                  <option value="specialist">Специалист</option>
                </select>
              </div>

              <!-- Expiration Days -->
              <div>
                <label for="expiresAfter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Срок действия (дней) *
                </label>
                <input
                  id="expiresAfter"
                  v-model.number="formData.expiresAfter"
                  type="number"
                  min="1"
                  max="365"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Приглашение будет действовать {{ formData.expiresAfter || 7 }} {{ getDaysText(formData.expiresAfter || 7) }}
                </p>
              </div>

              <!-- Count -->
              <div>
                <label for="count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Количество приглашений *
                </label>
                <input
                  id="count"
                  v-model.number="formData.count"
                  type="number"
                  min="1"
                  max="100"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <!-- Is One Time -->
              <div class="flex items-center justify-between py-2">
                <div class="flex flex-col">
                  <label for="isOneTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Одноразовая ссылка
                  </label>
                </div>
                <div class="flex-shrink-0">
                  <ControlledToggle
                    :model-value="formData.isOneTime || false"
                    :confirmation-required="true"
                    sr-text="Одноразовая ссылка"
                    @toggle-requested="handleOneTimeToggle"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
              class="w-full sm:w-auto sm:ml-3"
            >
              Создать приглашение
            </BaseButton>
            <BaseButton
              type="button"
              variant="secondary"
              class="mt-3 w-full sm:mt-0 sm:w-auto"
              @click="handleClose"
            >
              Отмена
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'
import ControlledToggle from '@/components/ui/ControlledToggle.vue'
import type { CreateInvitationRequest } from '@/types/invitation'

interface Props {
  isOpen: boolean
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: CreateInvitationRequest): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// Form data
const formData = ref<CreateInvitationRequest>({
  userType: 'client',
  expiresAfter: 7,
  count: 1,
  isOneTime: false
})

// Success message state
const showSuccessMessage = ref(false)

// Computed

// Methods
const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  // Validate form
  if (!formData.value.userType || !formData.value.expiresAfter || !formData.value.count) {
    return
  }

  // Prepare data for submission
  const submitData: CreateInvitationRequest = {
    userType: formData.value.userType,
    expiresAfter: formData.value.expiresAfter,
    count: formData.value.count,
    isOneTime: formData.value.isOneTime
  }

  console.log('Submitting data:', submitData)
  emit('submit', submitData)
}

const handleOneTimeToggle = (newValue: boolean) => {
  console.log('Toggle requested:', newValue)
  formData.value.isOneTime = newValue
  console.log('Form data after toggle:', formData.value)
}

// Helper function for day text declension
const getDaysText = (days: number): string => {
  if (days === 1) return 'день'
  if (days >= 2 && days <= 4) return 'дня'
  return 'дней'
}

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    formData.value = {
      userType: 'client',
      expiresAfter: 7,
      count: 1,
      isOneTime: false
    }
  }
})
</script>
