<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <MayaLogoIcon class="h-12 w-12 text-purple-600" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Вход в систему
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Используйте предопределенные учетные записи для тестирования
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <BaseInput v-model="form.email" type="email" label="Email address" required />

          <BaseInput v-model="form.password" type="password" label="Password" required />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.remember"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Запомнить меня
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Забыли пароль?
              </a>
            </div>
          </div>

          <BaseButton type="submit" class="w-full" :disabled="session.isLoading.value">
            {{ session.isLoading.value ? 'Вход...' : 'Войти' }}
          </BaseButton>

          <div v-if="session.error.value" class="text-red-600 dark:text-red-400 text-sm text-center">
            {{ session.error.value }}
          </div>
        </form>

        <!-- Predefined User Profiles -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Или войдите как
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <button
              @click="loginAsSpecialist"
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
            >
              <span>Специалист</span>
              <span class="ml-2 text-xs bg-green-800 dark:bg-green-900 px-2 py-1 rounded"
                >Тест</span
              >
            </button>

            <button
              @click="loginAsClient"
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              <span>Клиент</span>
              <span class="ml-2 text-xs bg-blue-800 dark:bg-blue-900 px-2 py-1 rounded">Тест</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalSession } from '@/composables/useSession'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MayaLogoIcon from '@/components/icons/MayaLogoIcon.vue'

const router = useRouter()
const session = useGlobalSession()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const handleRedirect = () => {
  const redirect = router.currentRoute.value.query.redirect as string
  router.push(redirect || '/')
}

const handleSubmit = async () => {
  try {
    const success = await session.login(form.value.email, form.value.password)
    
    if (success) {
      handleRedirect()
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Predefined login methods for testing
const loginAsSpecialist = async () => {
  try {
    const success = await session.login('specialist@example.com', 'password')
    if (success) {
      // Update user type to specialist
      if (session.currentUser.value) {
        session.currentUser.value.userType = 'specialist'
        session.currentUser.value.firstName = 'Евгений '
        session.currentUser.value.isOpenToOffers = true
        session.currentUser.value.avatar =
          'https://ca.slack-edge.com/TCPCGHZRN-U085RMHDTRR-be74a12f2553-512'
        session.currentUser.value.lastName = 'Хацко'
        session.currentUser.value.name = 'Евгений Хацко'
      }
      handleRedirect()
    }
  } catch (error) {
    console.error('Specialist login failed:', error)
  }
}

const loginAsClient = async () => {
  try {
    const success = await session.login('client@example.com', 'password')
    if (success) {
      // Update user type to client
      if (session.currentUser.value) {
        session.currentUser.value.avatar =
          'https://optim.tildacdn.com/tild6334-3932-4163-b563-373933393264/-/resize/240x/-/format/webp/image_162.png.webp'
        session.currentUser.value.userType = 'client'
        session.currentUser.value.isOpenToOffers = true
        session.currentUser.value.firstName = 'Майя'
        session.currentUser.value.lastName = 'Галицкая'
        session.currentUser.value.name =
          session.currentUser.value.firstName + ' ' + session.currentUser.value.lastName
      }
      handleRedirect()
    }
  } catch (error) {
    console.error('Client login failed:', error)
  }
}
</script>
