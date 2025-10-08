<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Header -->
      <h2 class="mt-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Регистрация по приглашению
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Заполните форму для завершения регистрации
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
      <div 
        class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 relative overflow-hidden"
        :class="[
          isAnimationComplete ? 'opacity-100' : 'opacity-0',
          success ? 'animate-form-hide' : 'animate-form-appear'
        ]"
      >
        <!-- Registration Form -->
        <div 
          v-if="!success"
          class="transition-all duration-500"
          :class="success ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'"
        >
          <InviteRegistrationForm
            :invitation-id="invitationId"
            :token="token"
            @submit="handleRegistration"
          />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="mt-4 flex justify-center">
          <div class="flex items-center space-x-2">
            <ArrowPathIcon class="h-5 w-5 animate-spin text-blue-600" />
            <span class="text-sm text-gray-600 dark:text-gray-400">Обработка регистрации...</span>
          </div>
        </div>

        <!-- Success Message -->
        <div 
          v-if="success"
          class="text-center space-y-6 animate-welcome-appear"
        >
          <!-- Success Icon -->
          <div class="flex justify-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-success-pulse shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <!-- Welcome Message -->
          <div class="space-y-3 animate-welcome-content">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Регистрация успешна!
            </h3>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Добро пожаловать в MayaWork!
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Ваш аккаунт успешно создан
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Теперь вы можете 
              <router-link 
                to="/login" 
                class="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                войти в личный кабинет
              </router-link>
            </p>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Ошибка регистрации
              </h3>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'
import InviteRegistrationForm from '@/components/invitations/InviteRegistrationForm.vue'
import { invitationApi } from '@/services/invitationApiClient'
import type { InvitationRegistrationRequest } from '@/types/invitation'
import { prepareErrorResponse } from '@/types/errors'

// Route params
const route = useRoute()
const invitationId = route.params.id as string
const token = route.query.token as string

// State
const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)
const invitationInfo = ref<{ userType: 'client' | 'specialist' } | null>(null)

// Animation state
const isAnimationComplete = ref(false)

// Methods
const handleRegistration = async (formData: any) => {
  try {
    loading.value = true
    error.value = null
    
    // Prepare registration data according to API format
    const registrationData: InvitationRegistrationRequest = {
      token: token,
      invitationId: invitationId,
      confirmPassword: formData.confirmPassword,
      consent: formData.consent,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      phone: formData.phone
    }
    
    console.log('Sending registration data:', registrationData)
    
    // Call real API
    const response = await invitationApi.registerByInvitation(registrationData)
    
    console.log('Registration successful:', response.message)
    success.value = true
  } catch (err: any) {
    console.error('Registration failed:', err)
    
    // Use prepareErrorResponse for consistent error handling
    const { message, data: errorsData } = prepareErrorResponse(err.data, 'Ошибка при регистрации. Проверьте введенные данные.')
    
    // Set error message
    error.value = message
    
    // Log detailed error information for debugging
    if (errorsData) {
      console.error('Registration validation errors:', errorsData)
    }
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  // TODO: Validate invitation and token
  // For now, just set a mock user type
  invitationInfo.value = {
    userType: 'client' // This should come from API validation
  }
  
  // Complete animation after 1 second
  setTimeout(() => {
    isAnimationComplete.value = true
  }, 1000)
})
</script>

<style scoped>
/* Form appear animation */
@keyframes form-appear {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-form-appear {
  animation: form-appear 0.8s ease-out forwards;
}

/* Form hide animation */
@keyframes form-hide {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.animate-form-hide {
  animation: form-hide 0.5s ease-in-out forwards;
}

/* Welcome message animations */
@keyframes welcome-appear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-welcome-appear {
  animation: welcome-appear 0.8s ease-out forwards;
}

/* Success pulse animation */
@keyframes success-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
}

.animate-success-pulse {
  animation: success-pulse 2s ease-in-out infinite;
}

/* Welcome content animation */
@keyframes welcome-content {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-welcome-content {
  animation: welcome-content 0.6s ease-out 0.3s forwards;
}
</style>
