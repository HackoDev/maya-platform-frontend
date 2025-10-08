<template>
  <BaseModal 
    :show="isOpen" 
    @close="handleClose" 
    size="7xl" 
    class="!max-w-[98vw] !w-[98vw]"
    style="max-width: 98vw !important; width: 98vw !important;"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Зарегистрированные пользователи
        </h3>
        <div class="text-sm text-gray-500 dark:text-gray-400 ml-4">
          Всего: {{ totalUsers }}
        </div>
      </div>
    </template>

    <template #default>
      <!-- Loading State -->
      <div v-if="loading && users.length === 0" class="flex justify-center py-8">
        <div class="flex items-center space-x-2">
          <ArrowPathIcon class="h-5 w-5 animate-spin text-blue-600" />
          <span class="text-gray-600 dark:text-gray-400">Загрузка пользователей...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
          <div>
            <h4 class="text-sm font-medium text-red-800 dark:text-red-200">
              Ошибка загрузки
            </h4>
            <p class="text-sm text-red-700 dark:text-red-300 mt-1">
              {{ error }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <BaseButton @click="loadUsers" variant="primary" size="sm">
            <ArrowPathIcon class="h-4 w-4 mr-2" />
            Попробовать снова
          </BaseButton>
        </div>
      </div>

      <!-- Users List -->
      <div v-else-if="users.length > 0" class="space-y-4">
        <!-- Users Table -->
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table class="w-full divide-y divide-gray-300 dark:divide-gray-600">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Пользователь
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Телефон
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Последний вход
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {{ getUserInitials(user) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-2">
                      <div class="text-xs font-medium text-gray-900 dark:text-white">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center space-x-1">
                    <div class="text-xs text-gray-900 dark:text-white">{{ user.email }}</div>
                    <button
                      @click="copyEmail(user.email)"
                      class="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      :title="isEmailCopied(user.email) ? 'Скопировано!' : 'Копировать email'"
                    >
                      <ClipboardIcon v-if="!isEmailCopied(user.email)" class="h-3 w-3" />
                      <CheckIcon v-else class="h-3 w-3 text-green-500" />
                    </button>
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="text-xs text-gray-900 dark:text-white">
                    {{ user.phone || 'Не указан' }}
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="text-xs text-gray-900 dark:text-white">
                    {{ formatDate(user.dateJoined) }}
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="text-xs text-gray-900 dark:text-white">
                    {{ formatDate(user.lastLogin) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between py-2">
          <div class="text-xs text-gray-700 dark:text-gray-300">
            Показано {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalUsers) }} из {{ totalUsers }}
          </div>
          <div class="flex space-x-1">
            <BaseButton
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              variant="secondary"
              size="sm"
            >
              Назад
            </BaseButton>
            <BaseButton
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              variant="secondary"
              size="sm"
            >
              Вперед
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-4">
        <UserGroupIcon class="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Нет зарегистрированных пользователей
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          Пока никто не зарегистрировался по этому приглашению.
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton @click="handleClose" variant="secondary" size="sm">
          Закрыть
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { invitationApi } from '@/services/invitationApiClient'
import type { InvitationUser } from '@/types/invitation'

interface Props {
  isOpen: boolean
  invitationId: string | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const users = ref<InvitationUser[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalUsers = ref(0)
const pageSize = 10
const copiedEmails = ref<Set<string>>(new Set())

// Computed
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize))

// Methods
const loadUsers = async () => {
  if (!props.invitationId) return

  try {
    loading.value = true
    error.value = null

    const offset = (currentPage.value - 1) * pageSize
    const response = await invitationApi.getInvitationUsers(props.invitationId, {
      limit: pageSize,
      offset
    })

    users.value = response.items
    totalUsers.value = response.count
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки пользователей'
    console.error('Failed to load invitation users:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getUserInitials = (user: InvitationUser): string => {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleClose = () => {
  emit('close')
}

const copyEmail = async (email: string) => {
  try {
    await navigator.clipboard.writeText(email)
    
    // Add to copied emails set
    copiedEmails.value.add(email)
    
    // Remove from copied emails after 2 seconds
    setTimeout(() => {
      copiedEmails.value.delete(email)
    }, 2000)
    
    console.log('Email copied to clipboard:', email)
  } catch (err) {
    console.error('Failed to copy email:', err)
  }
}

const isEmailCopied = (email: string): boolean => {
  return copiedEmails.value.has(email)
}

// Watch for modal opening and invitation changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.invitationId) {
    currentPage.value = 1
    loadUsers()
  }
})

watch(() => props.invitationId, (newId) => {
  if (props.isOpen && newId) {
    currentPage.value = 1
    loadUsers()
  }
})

// Watch for page changes
watch(currentPage, () => {
  if (props.isOpen && props.invitationId) {
    loadUsers()
  }
})
</script>

<style scoped>
/* Scoped styles for maximum width modal - only affects this component */
:deep(.relative.inline-block) {
  max-width: 98vw !important;
  width: 98vw !important;
  margin: 1vh auto !important;
}

@media (min-width: 640px) {
  :deep(.relative.inline-block) {
    max-width: 95vw !important;
    width: 95vw !important;
    margin: 2.5vh auto !important;
  }
}

@media (min-width: 1024px) {
  :deep(.relative.inline-block) {
    max-width: 90vw !important;
    width: 90vw !important;
    margin: 5vh auto !important;
  }
}

@media (min-width: 1280px) {
  :deep(.relative.inline-block) {
    max-width: 85vw !important;
    width: 85vw !important;
    margin: 7.5vh auto !important;
  }
}

/* Override the size classes */
:deep(.sm\\:max-w-7xl) {
  max-width: 98vw !important;
}

@media (min-width: 640px) {
  :deep(.sm\\:max-w-7xl) {
    max-width: 95vw !important;
  }
}

@media (min-width: 1024px) {
  :deep(.sm\\:max-w-7xl) {
    max-width: 90vw !important;
  }
}

@media (min-width: 1280px) {
  :deep(.sm\\:max-w-7xl) {
    max-width: 85vw !important;
  }
}
</style>
