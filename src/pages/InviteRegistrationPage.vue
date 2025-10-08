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

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Registration Form -->
        <InviteRegistrationForm
          :invitation-id="invitationId"
          :token="token"
          @submit="handleRegistration"
        />

        <!-- Loading State -->
        <div v-if="loading" class="mt-4 flex justify-center">
          <div class="flex items-center space-x-2">
            <ArrowPathIcon class="h-5 w-5 animate-spin text-blue-600" />
            <span class="text-sm text-gray-600 dark:text-gray-400">Обработка регистрации...</span>
          </div>
        </div>

        <!-- Success State -->
        <div v-if="success" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-5 w-5 text-green-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                Регистрация успешна!
              </h3>
              <p class="text-sm text-green-700 dark:text-green-300 mt-1">
                Добро пожаловать в MayaWork!
              </p>
            </div>
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
  CheckCircleIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'
import InviteRegistrationForm from '@/components/invitations/InviteRegistrationForm.vue'
import { invitationApi } from '@/services/invitationApiClient'
import type { InvitationRegistrationRequest } from '@/types/invitation'

// Route params
const route = useRoute()
const invitationId = route.params.id as string
const token = route.query.token as string

// State
const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)
const invitationInfo = ref<{ userType: 'client' | 'specialist' } | null>(null)

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
    
    // Handle different error types
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Произошла ошибка при регистрации'
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
})
</script>
