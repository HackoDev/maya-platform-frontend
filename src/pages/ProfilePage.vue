<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- User Information Section -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <div class="flex items-center space-x-3 mb-6">
          <UserCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Мой профиль
          </h1>
        </div>
        
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Имя
</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ userStore.currentUser.firstName }}
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Фамилия
</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ userStore.currentUser.lastName }}
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Email
</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ userStore.currentUser.email }}
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Тип пользователя
</dt>
              <dd class="mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    userStore.currentUser.userType === 'specialist'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  "
                >
                  {{ userStore.currentUser.userType === 'specialist' ? 'Специалист' : 'Клиент' }}
                </span>
              </dd>
            </div>
            
            <div v-if="userStore.currentUser">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
Статус
</dt>
              <dd class="mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    userStore.currentUser.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  "
                >
                  {{ userStore.currentUser.isActive ? 'Активен' : 'Неактивен' }}
                </span>
              </dd>
            </div>
          </dl>
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
          <ActionCard
            v-if="userStore.currentUser?.userType === 'specialist'"
            title="Анкета специалиста"
            description="Заполните анкету нейросетевого специалиста для привлечения клиентов"
            icon="cpu"
            route="/profile/neural-network"
            color="purple"
            :moderation-status="questionnaireStatus"
            :completion-percentage="questionnaireCompletion"
            :show-progress="true"
            :action-text="questionnaireActionText"
          />
          
          <!-- Password Change Card -->
          <ActionCard
            title="Смена пароля"
            description="Измените пароль для обеспечения безопасности вашего аккаунта"
            icon="key"
            route="/profile/change-password"
            color="green"
            action-text="Изменить пароль"
          />
          
          <!-- Logout Card -->
          <ActionCard
            title="Выход"
            description="Завершить текущую сессию и выйти из системы"
            icon="logout"
            color="red"
            :is-action="true"
            action-text="Выйти из системы"
            @click="handleLogout"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'
import ActionCard from '@/components/ui/ActionCard.vue'
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