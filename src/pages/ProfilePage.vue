<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Combined Profile Header Section -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <!-- Avatar Section -->
          <div class="flex-shrink-0">
            <div class="bg-gray-200 dark:bg-gray-700 border-4 border-gray-300 dark:border-gray-600 rounded-full shadow-md w-40 h-40 flex items-center justify-center overflow-hidden">
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
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                  {{ userStore.currentUser?.email }}
                </p>
              </div>
              <div class="flex flex-wrap justify-center md:justify-end gap-2">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="
                    userStore.currentUser?.userType === 'specialist'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  "
                >
                  {{ userStore.currentUser?.userType === 'specialist' ? 'Специалист' : 'Клиент' }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="
                    userStore.currentUser?.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  "
                >
                  {{ userStore.currentUser?.isActive ? 'Активен' : 'Неактивен' }}
                </span>
              </div>
            </div>
            
            <!-- Personal Information Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Имя
                </label>
                <p class="text-gray-900 dark:text-white">
                  {{ userStore.currentUser?.firstName }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Фамилия
                </label>
                <p class="text-gray-900 dark:text-white">
                  {{ userStore.currentUser?.lastName }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 sm:col-span-2">
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  О себе
                </label>
                <p class="text-gray-900 dark:text-white">
                  <span v-if="userStore.currentUser?.bio">{{ userStore.currentUser.bio }}</span>
                  <span v-else class="text-gray-400 italic">Информация не указана</span>
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
          <!-- Questionnaire Access Card -->
          <div 
            v-if="userStore.currentUser?.userType === 'specialist'"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            @click="router.push('/profile/neural-network')"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Анкета специалиста</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Заполните анкету нейросетевого специалиста
                </p>
              </div>
              <CpuChipIcon class="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            </div>
            <div v-if="questionnaireStatus" class="mt-4">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="moderationStatusConfig.classes"
              >
                <span class="mr-1">{{ moderationStatusConfig.icon }}</span>
                {{ moderationStatusConfig.text }}
              </span>
            </div>
            <div v-if="questionnaireCompletion !== undefined" class="mt-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-600 dark:text-gray-400">Заполнено</span>
                <span class="text-xs text-gray-600 dark:text-gray-400">{{ questionnaireCompletion }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full bg-purple-500 dark:bg-purple-400"
                  :style="{ width: `${questionnaireCompletion}%` }"
                ></div>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-sm text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {{ questionnaireActionText }}
              </span>
            </div>
          </div>
          
          <!-- Password Change Card -->
          <div 
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            @click="router.push('/profile/change-password')"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">Смена пароля</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Измените пароль для обеспечения безопасности
                </p>
              </div>
              <KeyIcon class="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            </div>
            <div class="mt-6">
              <span class="text-sm text-green-600 dark:text-green-400 font-medium group-hover:text-green-700 dark:group-hover:text-green-300">
                Изменить пароль
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
import { UserCircleIcon, Cog6ToothIcon, CpuChipIcon, KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'
import { computed, onMounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const neuralNetworkStore = useNeuralNetworkProfileStore()

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
  try {
    // Call the store logout method
    userStore.logout()
    
    // Redirect to login page
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>