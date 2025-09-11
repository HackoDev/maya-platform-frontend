<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Смена пароля"
        subtitle="Измените свой пароль для обеспечения безопасности аккаунта"
      />

      <div class="mt-8">
        <BaseCard>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Security Notice -->
            <div class="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700 dark:text-blue-300">
                    <strong class="font-medium">Рекомендации по безопасности:</strong>
                    Используйте надежный пароль длиной не менее 8 символов, включающий буквы, цифры и специальные символы.
                  </p>
                </div>
              </div>
            </div>

            <!-- Current Password -->
            <div>
              <label
                for="current-password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Текущий пароль
              </label>
              <BaseInput
                id="current-password"
                v-model="form.currentPassword"
                type="password"
                placeholder="Введите текущий пароль"
                :error="errors.currentPassword"
                required
              />
            </div>

            <!-- New Password -->
            <div>
              <label
                for="new-password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Новый пароль
              </label>
              <BaseInput
                id="new-password"
                v-model="form.newPassword"
                type="password"
                placeholder="Введите новый пароль"
                :error="errors.newPassword"
                required
              />
              <!-- Password Strength Indicator -->
              <div v-if="form.newPassword" class="mt-2">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="passwordStrengthClasses"
                      :style="{ width: passwordStrengthWidth }"
                    ></div>
                  </div>
                  <span class="text-xs font-medium" :class="passwordStrengthTextClasses">
                    {{ passwordStrengthText }}
                  </span>
                </div>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Пароль должен содержать минимум 8 символов
              </p>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label
                for="confirm-password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Подтвердите новый пароль
              </label>
              <BaseInput
                id="confirm-password"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Повторите новый пароль"
                :error="errors.confirmPassword"
                required
              />
              <!-- Password Match Indicator -->
              <div v-if="form.confirmPassword && form.newPassword" class="mt-2">
                <div class="flex items-center space-x-2">
                  <svg v-if="form.newPassword === form.confirmPassword" class="h-4 w-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="h-4 w-4 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs" :class="form.newPassword === form.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ form.newPassword === form.confirmPassword ? 'Пароли совпадают' : 'Пароли не совпадают' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <router-link
                to="/profile"
                class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md px-2 py-1"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Вернуться к профилю
              </router-link>

              <div class="flex items-center space-x-3">
                <BaseButton
                  type="button"
                  variant="secondary"
                  @click="resetForm"
                  :disabled="isLoading"
                >
                  Отмена
                </BaseButton>
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="isLoading"
                  :disabled="!isFormValid"
                >
                  <svg v-if="!isLoading" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2L2.257 8.257a2 2 0 010-2.828L7.515 0.172a2 2 0 012.828 0L15 5l2.257 2.257A2 2 0 0118 9z" />
                  </svg>
                  {{ isLoading ? 'Сохранение...' : 'Сменить пароль' }}
                </BaseButton>
              </div>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const router = useRouter()

const form = reactive<ChangePasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isLoading = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.newPassword
  if (!password) return 0
  
  let strength = 0
  
  // Length check
  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 25
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength += 12.5
  if (/[A-Z]/.test(password)) strength += 12.5
  if (/\d/.test(password)) strength += 12.5
  if (/[^\w\s]/.test(password)) strength += 12.5
  
  return Math.min(strength, 100)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 25) return 'Слабый'
  if (strength < 50) return 'Удовлетворительный'
  if (strength < 75) return 'Хороший'
  return 'Отличный'
})

const passwordStrengthWidth = computed(() => `${passwordStrength.value}%`)

const passwordStrengthClasses = computed(() => {
  const strength = passwordStrength.value
  if (strength < 25) return 'bg-red-500 dark:bg-red-400'
  if (strength < 50) return 'bg-yellow-500 dark:bg-yellow-400'
  if (strength < 75) return 'bg-blue-500 dark:bg-blue-400'
  return 'bg-green-500 dark:bg-green-400'
})

const passwordStrengthTextClasses = computed(() => {
  const strength = passwordStrength.value
  if (strength < 25) return 'text-red-600 dark:text-red-400'
  if (strength < 50) return 'text-yellow-600 dark:text-yellow-400'
  if (strength < 75) return 'text-blue-600 dark:text-blue-400'
  return 'text-green-600 dark:text-green-400'
})

// Form validation
const isFormValid = computed(() => {
  return form.currentPassword &&
         form.newPassword &&
         form.confirmPassword &&
         form.newPassword === form.confirmPassword &&
         form.newPassword.length >= 8 &&
         form.currentPassword !== form.newPassword &&
         !errors.currentPassword &&
         !errors.newPassword &&
         !errors.confirmPassword
})

const validateForm = (): boolean => {
  // Reset errors
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''

  let isValid = true

  // Validate current password
  if (!form.currentPassword) {
    errors.currentPassword = 'Текущий пароль обязателен'
    isValid = false
  }

  // Validate new password
  if (!form.newPassword) {
    errors.newPassword = 'Новый пароль обязателен'
    isValid = false
  } else if (form.newPassword.length < 8) {
    errors.newPassword = 'Пароль должен содержать минимум 8 символов'
    isValid = false
  }

  // Validate password confirmation
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Подтверждение пароля обязательно'
    isValid = false
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }

  // Check if new password is different from current
  if (form.currentPassword === form.newPassword) {
    errors.newPassword = 'Новый пароль должен отличаться от текущего'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement actual password change API call
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    
    // TODO: Show success message with better UX
    // For now using alert, should be replaced with toast notification
    alert('🎉 Пароль успешно изменен! Ваш аккаунт более защищен.')
    
    // Clear form for security
    resetForm()
    
    // Redirect to profile page
    router.push('/profile')
  } catch (error) {
    console.error('Error changing password:', error)
    // TODO: Show error message with better UX
    alert('⚠️ Ошибка при смене пароля. Пожалуйста, проверьте введенные данные и попробуйте еще раз.')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
}
</script>