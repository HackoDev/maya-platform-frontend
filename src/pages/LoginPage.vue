<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <MayaLogoIcon class="h-12 w-12 text-purple-600" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Вход в систему
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Используйте предопределенные учетные записи для тестирования
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Запомнить меня
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-purple-600 hover:text-purple-500">
                Забыли пароль?
              </a>
            </div>
          </div>

          <BaseButton type="submit" class="w-full" :disabled="userStore.loading">
            {{ userStore.loading ? 'Вход...' : 'Войти' }}
          </BaseButton>

          <div v-if="userStore.error" class="text-red-600 text-sm text-center">
            {{ userStore.error }}
          </div>
        </form>

        <!-- Predefined User Profiles -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Или войдите как
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <button
              @click="loginAsSpecialist"
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span>Специалист</span>
              <span class="ml-2 text-xs bg-green-800 px-2 py-1 rounded">Тест</span>
            </button>

            <button
              @click="loginAsClient"
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span>Клиент</span>
              <span class="ml-2 text-xs bg-blue-800 px-2 py-1 rounded">Тест</span>
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
import { useUserStore } from '@/stores/user'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MayaLogoIcon from '@/components/icons/MayaLogoIcon.vue'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const handleSubmit = async () => {
  await userStore.login(form.value.email, form.value.password)

  if (userStore.isAuthenticated) {
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/dashboard')
  }
}

// Predefined login methods for testing
const loginAsSpecialist = async () => {
  await userStore.login('specialist@example.com', 'password')
  if (userStore.isAuthenticated) {
    // Update user type to specialist
    if (userStore.currentUser) {
      userStore.currentUser.userType = 'specialist'
      userStore.currentUser.firstName = 'Анна'
      userStore.currentUser.lastName = 'Смирнова'
      userStore.currentUser.name = 'Анна Смирнова'
    }
    router.push('/dashboard')
  }
}

const loginAsClient = async () => {
  await userStore.login('client@example.com', 'password')
  if (userStore.isAuthenticated) {
    // Update user type to client
    if (userStore.currentUser) {
      userStore.currentUser.userType = 'client'
      userStore.currentUser.firstName = 'Иван'
      userStore.currentUser.lastName = 'Петров'
      userStore.currentUser.name = 'Иван Петров'
    }
    router.push('/dashboard')
  }
}
</script>