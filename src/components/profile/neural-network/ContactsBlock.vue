<template>
  <div class="contacts-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 8. Как тебе можно написать?
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Способы связи
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Контактная информация берется из настроек вашего профиля. Для изменения контактов перейдите в настройки.
      </p>
    </div>

    <div class="space-y-6">
      <!-- Contact Information Display -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">
          Контактная информация из профиля
        </h4>
        
        <!-- Contact Information Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Phone -->
          <div v-if="userContacts.phone" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Телефон</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ userContacts.phone }}</p>
              </div>
            </div>
          </div>

          <!-- WhatsApp -->
          <div v-if="userContacts.whatsapp" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ userContacts.whatsapp }}</p>
              </div>
            </div>
          </div>

          <!-- Telegram -->
          <div v-if="userContacts.telegram" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Telegram</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ userContacts.telegram }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Contacts Warning -->
        <div v-if="!hasAnyContacts" class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div class="flex items-center space-x-3">
            <svg class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
                Контактная информация не указана
              </p>
              <p class="text-sm text-amber-700 dark:text-amber-300">
                Для завершения анкеты необходимо указать хотя бы один способ связи в настройках профиля.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Link -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200">
              Изменить контакты
            </h4>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Для изменения контактной информации перейдите в настройки профиля
            </p>
          </div>
          <button
            @click="goToSettings"
            class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-blue-800 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-700 transition-colors"
          >
            Настройки
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { NeuralNetworkFormState } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const userStore = useUserStore()

// Get user contacts from user store
const userContacts = computed(() => {
  const user = userStore.currentUser
  return {
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    telegram: user?.telegram || ''
  }
})

// Check if user has any contacts
const hasAnyContacts = computed(() => {
  const contacts = userContacts.value
  return !!(contacts.phone || contacts.whatsapp || contacts.telegram)
})

// Navigate to settings page
const goToSettings = () => {
  router.push('/profile/settings')
}

// Validate block on mount and when user contacts change
onMounted(() => {
  validateBlock()
})

const validateBlock = () => {
  // Since contacts are now read-only from user profile,
  // we just need to check if the user has at least one contact method
  if (!hasAnyContacts.value) {
    emit('validate', '8')
  } else {
    emit('validate', '8')
  }
}
</script>