<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Name Fields Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- First Name -->
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Имя *
        </label>
        <div class="mt-1">
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Введите ваше имя"
          />
        </div>
      </div>

      <!-- Last Name -->
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Фамилия *
        </label>
        <div class="mt-1">
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Введите вашу фамилию"
          />
        </div>
      </div>
    </div>

    <!-- Contact Fields Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email *
        </label>
        <div class="mt-1">
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Введите ваш email"
          />
        </div>
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Телефон *
        </label>
        <div class="mt-1">
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Введите ваш телефон"
          />
        </div>
      </div>
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Пароль *
      </label>
      <div class="mt-1">
        <input
          id="password"
          v-model="formData.password"
          type="password"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="Введите пароль"
        />
      </div>
    </div>

    <!-- Confirm Password -->
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Подтвердите пароль *
      </label>
      <div class="mt-1">
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="Подтвердите пароль"
        />
      </div>
      <div v-if="formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
        Пароли не совпадают
      </div>
    </div>

    <!-- Consent Checkbox -->
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          id="consent"
          v-model="formData.consent"
          type="checkbox"
          required
          class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
        />
      </div>
      <div class="ml-3 text-sm">
        <label for="consent" class="text-gray-700 dark:text-gray-300">
          Я согласен с 
          <a href="#" class="text-blue-600 hover:text-blue-500 underline">политикой конфиденциальности</a>
          и 
          <a href="#" class="text-blue-600 hover:text-blue-500 underline">условиями использования сервиса</a>
          *
        </label>
      </div>
    </div>

    <!-- Submit Button -->
    <div>
      <BaseButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="!isFormValid"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      >
        Завершить регистрацию
      </BaseButton>
    </div>

  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  invitationId: string
  token: string
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: RegistrationFormData): void
}

interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  consent: boolean
}

defineProps<Props>()

const emit = defineEmits<Emits>()

// Form data
const formData = ref<RegistrationFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  consent: false
})

// Computed properties
const isFormValid = computed(() => {
  return formData.value.firstName.trim() !== '' &&
         formData.value.lastName.trim() !== '' &&
         formData.value.email.trim() !== '' &&
         formData.value.phone.trim() !== '' &&
         formData.value.password !== '' &&
         formData.value.confirmPassword !== '' &&
         formData.value.password === formData.value.confirmPassword &&
         formData.value.consent === true
})

// Methods
const handleSubmit = () => {
  // Validate form
  if (!formData.value.firstName || !formData.value.lastName || !formData.value.email || !formData.value.phone || !formData.value.password || !formData.value.confirmPassword || !formData.value.consent) {
    return
  }

  // Validate password match
  if (formData.value.password !== formData.value.confirmPassword) {
    return
  }

  // Emit form data
  emit('submit', { ...formData.value })
}
</script>
