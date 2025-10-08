<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
      <!-- User Type -->
      <div class="flex items-center space-x-2">
        <div 
          class="w-3 h-3 rounded-full"
          :class="invitation.isActive ? 'bg-green-500' : 'bg-gray-400'"
        ></div>
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ invitation.userType === 'client' ? 'Клиент' : 'Специалист' }}
        </span>
      </div>

      <!-- Status with Toggle -->
      <div class="flex items-center space-x-3">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="invitation.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
        >
          {{ invitation.isActive ? 'Активно' : 'Неактивно' }}
        </span>
        <ControlledToggle
          :model-value="invitation.isActive"
          :disabled="isUpdating"
          @toggle-requested="handleToggleRequested"
        />
      </div>

      <!-- Registrations Count -->
      <div class="text-center">
        <div v-if="invitation.registrationsCount > 0" class="flex items-center justify-center space-x-2">
          <button
            @click="handleViewUsers"
            class="flex items-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer"
          >
            <EyeIcon class="h-4 w-4" />
            <span>{{ invitation.registrationsCount }}</span>
          </button>
        </div>
        <div v-else class="flex items-center justify-center">
          <span class="text-sm text-gray-400 dark:text-gray-500 flex items-center space-x-1">
            <MinusIcon class="h-4 w-4" />
            <span>Нет регистраций</span>
          </span>
        </div>
      </div>

      <!-- Link Type -->
      <div class="flex items-center justify-center">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="(invitation.isOneTime === true)
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' 
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'"
        >
          <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="(invitation.isOneTime === true) ? 'bg-orange-500' : 'bg-blue-500'"></span>
          {{ (invitation.isOneTime === true) ? 'Одноразовая' : 'Многоразовая' }}
        </span>
      </div>

      <!-- Combined Dates -->
      <div class="space-y-1">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Истекает:
        </div>
        <div class="text-sm text-gray-900 dark:text-white">
          {{ formatDate(invitation.expiresAt) }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Создано:
        </div>
        <div class="text-sm text-gray-900 dark:text-white">
          {{ formatDate(invitation.createdAt) }}
        </div>
      </div>

      <!-- Copy Link Button -->
      <div class="flex justify-center">
        <BaseButton
          @click="copyInvitationLink"
          variant="secondary"
          size="sm"
          class="flex items-center space-x-1"
        >
          <ClipboardIcon v-if="!copySuccess" class="h-3 w-3" />
          <CheckIcon v-else class="h-3 w-3 text-green-500" />
          <span class="text-xs">{{ copySuccess ? 'Скопировано!' : 'Копировать' }}</span>
        </BaseButton>
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
      @confirm="handleConfirmToggle"
      @cancel="handleCancelToggle"
    />

    <!-- Users Modal -->
    <InvitationUsersModal
      :is-open="showUsersModal"
      :invitation-id="invitation.id"
      @close="handleCloseUsersModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClipboardIcon, CheckIcon, EyeIcon, MinusIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'
import ControlledToggle from '@/components/ui/ControlledToggle.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import InvitationUsersModal from './InvitationUsersModal.vue'
import { useInvitationStore } from '@/stores/invitation'
import type { Invitation } from '@/types/invitation'

interface Props {
  invitation: Invitation
}

const props = defineProps<Props>()

// Store
const invitationStore = useInvitationStore()

// State for toggle functionality
const showConfirmModal = ref(false)
const pendingToggleValue = ref<boolean | null>(null)
const isUpdating = ref(false)

// State for copy indication
const copySuccess = ref(false)

// State for users modal
const showUsersModal = ref(false)

// Generate invitation link
const invitationLink = computed(() => {
  const currentSchema = window.location.protocol
  const currentDomain = window.location.host
  return `${currentSchema}//${currentDomain}/invite/${props.invitation.id}?token=${props.invitation.token}`
})

// Modal configuration
const modalConfig = computed(() => {
  const isActivating = pendingToggleValue.value === true
  return {
    title: isActivating ? 'Активировать приглашение' : 'Деактивировать приглашение',
    message: isActivating 
      ? 'Вы уверены, что хотите активировать это приглашение? Пользователи смогут использовать ссылку для регистрации.'
      : 'Вы уверены, что хотите деактивировать это приглашение? Пользователи больше не смогут использовать ссылку для регистрации.',
    confirmText: isActivating ? 'Активировать' : 'Деактивировать',
    cancelText: 'Отмена',
    confirmButtonType: isActivating ? 'primary' as const : 'danger' as const
  }
})

const copyInvitationLink = async () => {
  try {
    await navigator.clipboard.writeText(invitationLink.value)
    
    // Show success indication
    copySuccess.value = true
    
    // Reset indication after 2 seconds
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
    
    console.log('Invitation link copied to clipboard')
  } catch (err) {
    console.error('Failed to copy invitation link:', err)
  }
}

const handleToggleRequested = (newValue: boolean) => {
  pendingToggleValue.value = newValue
  showConfirmModal.value = true
}

const handleConfirmToggle = async () => {
  if (pendingToggleValue.value === null) return

  try {
    isUpdating.value = true
    await invitationStore.updateInvitationById(props.invitation.id, {
      isActive: pendingToggleValue.value
    })
    showConfirmModal.value = false
    pendingToggleValue.value = null
  } catch (error) {
    console.error('Failed to update invitation:', error)
    // You could add a toast notification here
  } finally {
    isUpdating.value = false
  }
}

const handleCancelToggle = () => {
  showConfirmModal.value = false
  pendingToggleValue.value = null
}

const handleViewUsers = () => {
  if (props.invitation.registrationsCount > 0) {
    showUsersModal.value = true
  }
}

const handleCloseUsersModal = () => {
  showUsersModal.value = false
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
</script>
