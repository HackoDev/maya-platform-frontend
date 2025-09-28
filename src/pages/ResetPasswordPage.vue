<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <KeyIcon class="h-12 w-12 text-orange-600 dark:text-orange-400" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Сброс пароля
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Введите ваш email для получения кода подтверждения
      </p>
    </div>

    <!-- Reset Password Form -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success/Error Messages -->
        <div
          v-if="formState.successMessage"
          class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
        >
          <p class="text-sm text-green-700 dark:text-green-300">
            {{ formState.successMessage }}
          </p>
        </div>
        <div
          v-if="formState.errorMessage"
          class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
        >
          <p class="text-sm text-red-700 dark:text-red-300">
            {{ formState.errorMessage }}
          </p>
        </div>

        <!-- Step 1: Enter Email -->
        <div v-if="resetForm.step === 'email'" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email адрес
            </label>
            <BaseInput
              id="email"
              v-model="resetForm.email"
              type="email"
              placeholder="your.email@example.com"
              :error="formState.errors.email"
              required
            />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              На этот адрес будет отправлен код подтверждения
            </p>
          </div>

          <BaseButton
            type="button"
            variant="primary"
            :loading="formState.isLoading"
            :disabled="!isEmailFormValid"
            @click="sendResetOTP"
            class="w-full"
          >
            {{ formState.isLoading ? 'Отправка...' : 'Отправить код' }}
          </BaseButton>
        </div>

        <!-- Step 2: Enter OTP Code -->
        <div v-if="resetForm.step === 'otp'" class="space-y-6">
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Введите код подтверждения
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Код отправлен на <strong>{{ resetForm.email }}</strong>
            </p>
          </div>

          <OTPInput
            :email="resetForm.email"
            v-model="resetForm.otpCode"
            :error-message="formState.errors.otpCode?.[0]"
            :success-message="formState.successMessage"
            :is-resending="formState.isLoading"
            @complete="verifyOTPCode"
            @resend="resendOTPCode"
            @cancel="cancelReset"
          />
        </div>

        <!-- Step 3: Enter New Password -->
        <div v-if="resetForm.step === 'password'" class="space-y-6">
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Создайте новый пароль
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Введите новый пароль для вашего аккаунта
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label
                for="newPassword"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Новый пароль
              </label>
              <BaseInput
                id="newPassword"
                v-model="resetForm.newPassword"
                type="password"
                placeholder="Введите новый пароль"
                :error="formState.errors.newPassword"
                required
              />
              <!-- Password Strength Indicator -->
              <div v-if="resetForm.newPassword" class="mt-2">
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

            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Подтвердите новый пароль
              </label>
              <BaseInput
                id="confirmPassword"
                v-model="resetForm.confirmPassword"
                type="password"
                placeholder="Повторите новый пароль"
                :error="formState.errors.confirmPassword"
                required
              />
              <!-- Password Match Indicator -->
              <div v-if="resetForm.confirmPassword && resetForm.newPassword" class="mt-2">
                <div class="flex items-center space-x-2">
                  <CheckCircleIcon
                    v-if="resetForm.newPassword === resetForm.confirmPassword"
                    class="h-4 w-4 text-green-500 dark:text-green-400"
                  />
                  <XCircleIcon v-else class="h-4 w-4 text-red-500 dark:text-red-400" />
                  <span
                    class="text-xs"
                    :class="
                      resetForm.newPassword === resetForm.confirmPassword
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    "
                  >
                    {{
                      resetForm.newPassword === resetForm.confirmPassword
                        ? 'Пароли совпадают'
                        : 'Пароли не совпадают'
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <BaseButton
            type="button"
            variant="primary"
            :loading="formState.isLoading"
            :disabled="!isPasswordFormValid"
            @click="resetPassword"
            class="w-full"
          >
            {{ formState.isLoading ? 'Сброс...' : 'Сбросить пароль' }}
          </BaseButton>
        </div>

        <!-- Step 4: Success -->
        <div v-if="resetForm.step === 'complete'" class="text-center space-y-6">
          <div class="flex justify-center">
            <CheckCircleIcon class="h-16 w-16 text-green-500 dark:text-green-400" />
          </div>
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Пароль успешно сброшен!
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Ваш пароль был успешно изменен
            </p>
          </div>

          <BaseButton
            type="button"
            variant="primary"
            @click="goToLogin"
            class="w-full"
          >
            Войти в систему
          </BaseButton>
        </div>

        <!-- Back to Login Link -->
        <div class="mt-6 text-center">
          <router-link
            to="/login"
            class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md px-3 py-2"
          >
            <ArrowLeftIcon class="mr-2 h-4 w-4" />
            Вернуться к входу
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import OTPInput from '@/components/ui/OTPInput.vue'
import {
  KeyIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import { prepareErrorResponse } from '@/types/errors'

const router = useRouter()
const userStore = useUserStore()

// Form data
interface ResetPasswordForm {
  email: string
  otpToken: string
  otpCode: string
  newPassword: string
  confirmPassword: string
  step: 'email' | 'otp' | 'password' | 'complete'
}

interface FormState {
  isLoading: boolean
  errors: Record<string, string[]>
  successMessage: string
  errorMessage: string
}

const resetForm = reactive<ResetPasswordForm>({
  email: '',
  otpToken: '',
  otpCode: '',
  newPassword: '',
  confirmPassword: '',
  step: 'email'
})

const formState = reactive<FormState>({
  isLoading: false,
  errors: {},
  successMessage: '',
  errorMessage: '',
})

// Form validation
const isEmailFormValid = computed(() => {
  return resetForm.email && /\S+@\S+\.\S+/.test(resetForm.email)
})

const isPasswordFormValid = computed(() => {
  return (
    resetForm.newPassword &&
    resetForm.confirmPassword &&
    resetForm.newPassword === resetForm.confirmPassword &&
    resetForm.newPassword.length >= 8
  )
})

// Password strength calculation
const passwordStrength = computed(() => {
  const password = resetForm.newPassword
  if (!password) return 0

  let strength = 0

  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 25
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

// Form submission methods
const sendResetOTP = async () => {
  if (!isEmailFormValid.value) return

  formState.isLoading = true
  formState.errors = {}
  formState.successMessage = 'Отправка кода...'
  formState.errorMessage = ''

  try {
    const response = await userStore.sendResetPasswordOTP(resetForm.email)
    
    resetForm.otpToken = response.token
    resetForm.step = 'otp'
    formState.successMessage = response.message
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при отправке OTP кода.')
    formState.errorMessage = message
    formState.successMessage = ''
    formState.errors = errorsData || {}
    console.error('Failed to send reset OTP:', error)
  } finally {
    formState.isLoading = false
  }
}

const verifyOTPCode = async () => {
  if (!resetForm.otpCode || resetForm.otpCode.length !== 6) return

  formState.isLoading = true
  formState.errors = {}
  formState.successMessage = 'Проверка кода...'
  formState.errorMessage = ''

  try {
    const response = await userStore.verifyResetPasswordOTP(resetForm.otpToken, resetForm.otpCode)
    
    if (response.verified) {
      resetForm.step = 'password'
      formState.successMessage = 'Код подтвержден. Теперь создайте новый пароль.'
    } else {
      formState.errorMessage = response.message
      formState.successMessage = ''
    }
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при проверке OTP кода.')
    formState.errorMessage = message
    formState.successMessage = ''
    formState.errors = errorsData || {}
    console.error('Failed to verify OTP:', error)
  } finally {
    formState.isLoading = false
  }
}

const resetPassword = async () => {
  if (!isPasswordFormValid.value) return

  formState.isLoading = true
  formState.errors = {}
  formState.successMessage = 'Сброс пароля...'
  formState.errorMessage = ''

  try {
    const response = await userStore.resetPassword(
      resetForm.otpToken,
      resetForm.newPassword,
      resetForm.confirmPassword
    )
    
    resetForm.step = 'complete'
    formState.successMessage = response.message
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при сбросе пароля.')
    formState.errorMessage = message
    formState.successMessage = ''
    formState.errors = errorsData || {}
    console.error('Failed to reset password:', error)
  } finally {
    formState.isLoading = false
  }
}

const resendOTPCode = async () => {
  formState.isLoading = true
  formState.errorMessage = ''

  try {
    const response = await userStore.sendResetPasswordOTP(resetForm.email)
    resetForm.otpToken = response.token
    formState.successMessage = 'Код отправлен повторно'
  } catch (error) {
    const {message} = prepareErrorResponse(error, 'Ошибка при повторной отправке кода.')
    formState.errorMessage = message
    console.error('Failed to resend OTP:', error)
  } finally {
    formState.isLoading = false
  }
}

const cancelReset = () => {
  resetForm.email = ''
  resetForm.otpToken = ''
  resetForm.otpCode = ''
  resetForm.newPassword = ''
  resetForm.confirmPassword = ''
  resetForm.step = 'email'
  formState.successMessage = ''
  formState.errorMessage = ''
  formState.errors = {}
}

const goToLogin = () => {
  router.push('/login')
}
</script>
