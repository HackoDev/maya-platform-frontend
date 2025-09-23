<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Toggle Confirmation Modal -->
      <ConfirmDialog
        :is-open="showConfirmModal"
        :title="modalConfig.title"
        :message="modalConfig.message"
        :confirm-text="modalConfig.confirmText"
        :cancel-text="modalConfig.cancelText"
        confirm-button-type="primary"
        @confirm="handleConfirmToggle"
        @cancel="handleCancelToggle"
      />
      <!-- Combined Profile Header Section -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <!-- Avatar Section -->
          <div class="flex-shrink-0">
            <div class="bg-gray-200 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-500 rounded-full shadow-md w-40 h-40 flex items-center justify-center overflow-hidden">
              <span v-if="!userStore.currentUser?.avatar" class="text-5xl font-bold text-gray-500 dark:text-gray-400">
                {{ userInitials }}
              </span>
              <img v-else :src="userStore.currentUser.avatar" :alt="userDisplayName" class="w-full h-full object-cover" />
            </div>
          </div>
          
          <!-- User Information Section -->
          <div class="flex-grow text-center md:text-left">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ userDisplayName }}
                </h1>
              </div>
              <div class="flex flex-wrap justify-center md:justify-end gap-2">
                <!-- Email Badge -->
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {{ userStore.currentUser?.email }}
                </span>
                <!-- User Type Badge -->
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="
                    userStore.currentUser?.userType === 'specialist'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                  "
                >
                  {{ userStore.currentUser?.userType === 'specialist' ? 'Специалист' : 'Клиент' }}
                </span>
                <!-- Open to Offers Badge -->
                <span
                  v-if="userStore.currentUser?.userType === 'specialist' && userStore.currentUser?.isOpenToOffers"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  Открыт к предложениям
                </span>
              </div>
            </div>
            
            <!-- Contact Information Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="space-y-2" v-if="userStore.currentUser?.phone">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Телефон
                </label>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ userStore.currentUser.phone }}
                </p>
              </div>
              <div class="space-y-2" v-if="userStore.currentUser?.whatsapp">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  WhatsApp
                </label>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ userStore.currentUser.whatsapp }}
                </p>
              </div>
              <div class="space-y-2" v-if="userStore.currentUser?.telegram">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Telegram
                </label>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ userStore.currentUser.telegram }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Actions Section -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex items-center space-x-3 mb-6">
          <Cog6ToothIcon class="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Действия профиля
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Open to Offers Toggle (Only for specialists) -->
          <div 
            v-if="userStore.currentUser?.userType === 'specialist'"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Открыт к предложениям</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Показывать вашу доступность для новых проектов
                </p>
              </div>
              <ControlledToggle
                ref="toggleRef"
                :model-value="isOpenToOffers"
                :disabled="toggleDisabled"
                :confirmation-required="true"
                sr-text="Изменить статус доступности"
                @toggle-requested="handleToggleRequested"
              />
            </div>
          </div>
          
          <!-- Questionnaire Access Card (Only for specialists) -->
          <div 
            v-if="userStore.currentUser?.userType === 'specialist'"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            @click="router.push('/profile/neural-network')"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Анкета специалиста
                </h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ moderationStatusConfig.text }}. Заполнено {{ questionnaireCompletion }}%. Улучшите свою анкету.
                </p>
              </div>
              <CpuChipIcon class="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            </div>
            <div class="mt-6">
              <span class="text-sm text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                Заполнить анкету
              </span>
            </div>
          </div>
          
          <!-- My Vacancies Card (Only for clients) -->
          <div 
            v-if="userStore.currentUser?.userType === 'client'"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            @click="router.push('/profile/vacancies')"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Мои вакансии</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Управляйте своими вакансиями и отслеживайте отклики
                </p>
              </div>
              <BriefcaseIcon class="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            </div>
            <div class="mt-6">
              <span class="text-sm text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                Перейти к вакансиям
              </span>
            </div>
          </div>
          
          <!-- Settings Card -->
          <div 
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            @click="router.push('/profile/settings')"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Настройки</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Управление личными данными, контактами и безопасностью
                </p>
              </div>
              <Cog6ToothIcon class="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            </div>
            <div class="mt-6">
              <span class="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                Открыть настройки
              </span>
            </div>
          </div>
          
          <!-- Logout Card -->
          <div 
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            @click="handleLogout"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">Выход</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Завершить текущую сессию и выйти из системы
                </p>
              </div>
              <ArrowRightOnRectangleIcon class="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            </div>
            <div class="mt-6">
              <span class="text-sm text-red-600 dark:text-red-400 font-medium group-hover:text-red-700 dark:group-hover:text-red-300">
                Выйти из системы
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, Cog6ToothIcon, CpuChipIcon, KeyIcon, ArrowRightOnRectangleIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'
import { computed, onMounted, ref, watch } from 'vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ControlledToggle from '@/components/ui/ControlledToggle.vue'

const router = useRouter()
const userStore = useUserStore()
const neuralNetworkStore = useNeuralNetworkProfileStore()

// Reactive state for the toggle switch and confirmation modal
const isOpenToOffers = ref(false)
const pendingToggleValue = ref<boolean | null>(null)
const showConfirmModal = ref(false)
const isUpdating = ref(false)
const toggleRef = ref<InstanceType<typeof ControlledToggle>>()

// Computed property for toggle disabled state
const toggleDisabled = computed(() => isUpdating.value || userStore.loading)

// Watch for changes to the user store and update the local state
watch(() => userStore.currentUser?.isOpenToOffers, (newValue: boolean | undefined) => {
  if (newValue !== undefined) {
    isOpenToOffers.value = newValue
    // Also update the ControlledToggle component programmatically
    if (toggleRef.value) {
      toggleRef.value.updateValue(newValue)
    }
  }
}, { immediate: true })

// Handle toggle requested event from ControlledToggle
const handleToggleRequested = (newValue: boolean) => {
  pendingToggleValue.value = newValue
  showConfirmModal.value = true
}

// Dynamic modal content configuration
const modalConfig = computed(() => {
  const isBecomingAvailable = pendingToggleValue.value === true

  return {
    title: isBecomingAvailable ? 'Показать в поиске' : 'Скрыть из поиска',
    message: isBecomingAvailable
      ? 'Ваша анкета специалиста снова будет показана в поиске активных специалистов и станет видимой для потенциальных клиентов.'
      : 'Ваша анкета специалиста не будет показана в поиске активных специалистов, но останется доступной для просмотра по прямой ссылке.',
    confirmText: isBecomingAvailable ? 'Показать профиль' : 'Скрыть профиль',
    cancelText: 'Отмена',
  }
})

// Confirmation modal handlers
const handleConfirmToggle = async () => {
  if (pendingToggleValue.value === null) return

  isUpdating.value = true

  try {
    await userStore.updateOpenToOffers(pendingToggleValue.value)
    // Update toggle visual state programmatically after successful store update
    if (toggleRef.value) {
      toggleRef.value.updateValue(pendingToggleValue.value)
    }
    isOpenToOffers.value = pendingToggleValue.value
  } catch (error) {
    console.error('Failed to update availability status:', error)
    // On error, ensure toggle stays in current state
    if (userStore.currentUser?.isOpenToOffers !== undefined && toggleRef.value) {
      toggleRef.value.updateValue(userStore.currentUser.isOpenToOffers)
      isOpenToOffers.value = userStore.currentUser.isOpenToOffers
    }
  } finally {
    isUpdating.value = false
    showConfirmModal.value = false
    pendingToggleValue.value = null
  }
}

const handleCancelToggle = () => {
  showConfirmModal.value = false
  pendingToggleValue.value = null
  // Toggle already reverted in watch function
}

// Initialize the neural network profile store when component mounts
onMounted(() => {
  if (userStore.currentUser?.userType === 'specialist') {
    // Try to load existing profile or initialize a new one
    neuralNetworkStore.initializeForm()
  }
})

// Computed properties for user display
const userDisplayName = computed(() => {
  if (!userStore.currentUser) return ''
  return `${userStore.currentUser.firstName} ${userStore.currentUser.lastName}`
})

const userInitials = computed(() => {
  if (!userStore.currentUser) return ''
  return `${userStore.currentUser.firstName.charAt(0)}${userStore.currentUser.lastName.charAt(0)}`
})

// Computed properties for questionnaire status
const questionnaireStatus = computed(() => {
  const profile = neuralNetworkStore.currentProfile
  return profile?.status || 'draft'
})

const questionnaireCompletion = computed(() => {
  return neuralNetworkStore.getCompletionPercentage
})

const questionnaireActionText = computed(() => {
  const status = questionnaireStatus.value
  switch (status) {
    case 'draft':
      return questionnaireCompletion.value > 0 ? 'Продолжить заполнение' : 'Заполнить анкету'
    case 'pending':
      return 'Просмотреть анкету'
    case 'approved':
      return 'Просмотреть анкету'
    case 'rejected':
      return 'Исправить анкету'
    default:
      return 'Заполнить анкету'
  }
})

// Moderation status styling
const moderationStatusConfig = computed(() => {
  const status = questionnaireStatus.value
  switch (status) {
    case 'draft':
      return {
        text: 'Черновик',
        classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: '✏️'
      }
    case 'pending':
      return {
        text: 'На модерации',
        classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        icon: '⏳'
      }
    case 'approved':
      return {
        text: 'Одобрено',
        classes: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        icon: '✅'
      }
    case 'rejected':
      return {
        text: 'Отклонено',
        classes: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: '❌'
      }
    default:
      return {
        text: 'Черновик',
        classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: '✏️'
      }
  }
})

const handleLogout = async () => {
  await userStore.logoutWithRedirect('/login')
}
</script>