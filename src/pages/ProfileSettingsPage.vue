<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <!-- Page Header -->
      <div class="mb-4 sm:mb-6 lg:mb-8">
        <div class="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <UserCircleIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Настройки профиля
          </h1>
        </div>
        <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Управляйте вашими личными данными и настройками аккаунта
        </p>
      </div>

      <!-- Single Content Block with Sequential Forms -->
      <div class="mt-4 sm:mt-6 lg:mt-8">
        <BaseCard class="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10 lg:space-y-12">
          <!-- Personal Information Section -->
          <div>
            <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <UserCircleIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Личная информация</h3>
            </div>

            <!-- Success/Error Messages -->
            <div
              v-if="formStates.personalInfo.successMessage"
              class="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
            >
              <p class="text-sm text-green-700 dark:text-green-300">
                {{ formStates.personalInfo.successMessage }}
              </p>
            </div>
            <div
              v-if="formStates.personalInfo.errorMessage"
              class="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ formStates.personalInfo.errorMessage }}
              </p>
            </div>

            <form @submit.prevent="submitPersonalInfo" class="space-y-4 sm:space-y-6">
              <div class="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-start w-full">
                <!-- Avatar Upload - Left Side -->
                <div v-if="userStore.currentUser?.userType !== 'admin'"
                     class="flex flex-col items-center space-y-4 sm:space-y-6 md:w-96 flex-shrink-0">
                  <div
                    class="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    <img
                      v-if="personalInfoForm.avatarPreview || userStore.currentUser?.avatar"
                      :src="personalInfoForm.avatarPreview || userStore.currentUser?.avatar || ''"
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                    <span 
                      v-else
                      class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-500 dark:text-gray-400"
                    >
                      {{ userInitials }}
                    </span>
                  </div>
                  <BaseButton
                    type="button"
                    variant="secondary"
                    size="md"
                    @click="() => avatarInput?.click()"
                    class="px-6 py-3 font-medium"
                  >
                    Изменить фото
                  </BaseButton>
                  <input
                    type="file"
                    ref="avatarInput"
                    @change="handleAvatarChange"
                    accept="image/*"
                    class="hidden"
                  />
                </div>

                <!-- Name Fields - Right Side -->
                <div class="flex-1 w-full space-y-4 sm:space-y-6">
                  <div class="w-full">
                    <label
                      for="firstName"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Имя
                    </label>
                    <BaseInput
                      id="firstName"
                      v-model="personalInfoForm.firstName"
                      type="text"
                      placeholder="Введите ваше имя"
                      :error="formStates.personalInfo.errors.firstName"
                      required
                      class="w-full"
                    />
                  </div>

                  <div class="w-full">
                    <label
                      for="lastName"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Фамилия
                    </label>
                    <BaseInput
                      id="lastName"
                      v-model="personalInfoForm.lastName"
                      type="text"
                      placeholder="Введите вашу фамилию"
                      :error="formStates.personalInfo.errors.lastName"
                      required
                      class="w-full"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="formStates.personalInfo.isLoading"
                  :disabled="!isPersonalInfoFormValid"
                >
                  {{ formStates.personalInfo.isLoading ? 'Сохранение...' : 'Сохранить' }}
                </BaseButton>
              </div>
            </form>
          </div>

          <!-- Contact Information Section -->
          <div v-if="userStore.currentUser?.userType !== 'admin'" class="pt-6 sm:pt-8">
            <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <PhoneIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Контактная информация
              </h3>
            </div>

            <!-- Success/Error Messages -->
            <div
              v-if="formStates.contactInfo.successMessage"
              class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
            >
              <p class="text-sm text-green-700 dark:text-green-300">
                {{ formStates.contactInfo.successMessage }}
              </p>
            </div>
            <div
              v-if="formStates.contactInfo.errorMessage"
              class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ formStates.contactInfo.errorMessage }}
              </p>
            </div>

            <form @submit.prevent="submitContactInfo" class="space-y-4 sm:space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Номер телефона
                  </label>
                  <BaseInput
                    id="phone"
                    v-model="contactInfoForm.phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    :error="formStates.contactInfo.errors.phone"
                  />
                </div>

                <div>
                  <label
                    for="whatsapp"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    WhatsApp <span class="text-gray-500">(необязательно)</span>
                  </label>
                  <BaseInput
                    id="whatsapp"
                    v-model="contactInfoForm.whatsapp"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    :error="formStates.contactInfo.errors.whatsapp"
                  />
                </div>

                <div>
                  <label
                    for="telegram"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Telegram <span class="text-gray-500">(необязательно)</span>
                  </label>
                  <BaseInput
                    id="telegram"
                    v-model="contactInfoForm.telegram"
                    type="text"
                    placeholder="@username"
                    :error="formStates.contactInfo.errors.telegram"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="formStates.contactInfo.isLoading"
                  :disabled="!isContactInfoFormValid"
                >
                  {{ formStates.contactInfo.isLoading ? 'Сохранение...' : 'Сохранить' }}
                </BaseButton>
              </div>
            </form>
          </div>

          <!-- Email Section -->
          <div class="pt-6 sm:pt-8">
            <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <EnvelopeIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Электронная почта</h3>
            </div>

            <!-- Success/Error Messages -->
            <div
              v-if="formStates.email.successMessage"
              class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
            >
              <p class="text-sm text-green-700 dark:text-green-300">
                {{ formStates.email.successMessage }}
              </p>
            </div>
            <div
              v-if="formStates.email.errorMessage"
              class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ formStates.email.errorMessage }}
              </p>
            </div>

            <form @submit.prevent="submitEmail" class="space-y-4 sm:space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Текущий email
                </label>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md overflow-x-auto">
                  <p class="text-gray-900 dark:text-white whitespace-nowrap min-w-0">
                    {{ userStore.currentUser?.email }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    for="newEmail"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Новый email
                  </label>
                  <BaseInput
                    id="newEmail"
                    v-model="emailForm.newEmail"
                    type="email"
                    placeholder="new.email@example.com"
                    :error="formStates.email.errors.newEmail"
                    required
                  />
                </div>

                <div>
                  <label
                    for="confirmEmail"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Подтвердите новый email
                  </label>
                  <BaseInput
                    id="confirmEmail"
                    v-model="emailForm.confirmEmail"
                    type="email"
                    placeholder="new.email@example.com"
                    :error="formStates.email.errors.confirmEmail"
                    required
                  />
                  <!-- Email Match Indicator -->
                  <div v-if="emailForm.confirmEmail && emailForm.newEmail" class="mt-2">
                    <div class="flex items-center space-x-2">
                      <CheckCircleIcon
                        v-if="emailForm.newEmail === emailForm.confirmEmail"
                        class="h-4 w-4 text-green-500 dark:text-green-400"
                      />
                      <XCircleIcon v-else class="h-4 w-4 text-red-500 dark:text-red-400" />
                      <span
                        class="text-xs"
                        :class="
                          emailForm.newEmail === emailForm.confirmEmail
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        "
                      >
                        {{
                          emailForm.newEmail === emailForm.confirmEmail
                            ? 'Email адреса совпадают'
                            : 'Email адреса не совпадают'
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="formStates.email.isLoading"
                  :disabled="!isEmailFormValid"
                >
                  {{ formStates.email.isLoading ? 'Обновление...' : 'Обновить email' }}
                </BaseButton>
              </div>
            </form>
          </div>

          <!-- Password Change Section -->
          <div class="pt-6 sm:pt-8">
            <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <KeyIcon class="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Смена пароля</h3>
            </div>

            <!-- Success/Error Messages -->
            <div
              v-if="formStates.password.successMessage"
              class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
            >
              <p class="text-sm text-green-700 dark:text-green-300">
                {{ formStates.password.successMessage }}
              </p>
            </div>
            <div
              v-if="formStates.password.errorMessage"
              class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ formStates.password.errorMessage }}
              </p>
            </div>

            <form @submit.prevent="submitPasswordChange" class="space-y-4 sm:space-y-6">
              <div>
                <label
                  for="currentPassword"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Текущий пароль
                </label>
                <BaseInput
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  placeholder="Введите текущий пароль"
                  :error="formStates.password.errors?.currentPassword"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    for="password1"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Новый пароль
                  </label>
                  <BaseInput
                    id="password1"
                    v-model="passwordForm.password1"
                    type="password"
                    placeholder="Введите новый пароль"
                    :error="formStates.password.errors?.password1"
                    required
                  />
                  <!-- Password Strength Indicator -->
                  <div v-if="passwordForm.password1" class="mt-2">
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
                    id="password2"
                    v-model="passwordForm.password2"
                    type="password"
                    placeholder="Повторите новый пароль"
                    :error="formStates.password.errors.password2"
                    required
                  />
                  <!-- Password Match Indicator -->
                  <div v-if="passwordForm.password2 && passwordForm.password1" class="mt-2">
                    <div class="flex items-center space-x-2">
                      <CheckCircleIcon
                        v-if="passwordForm.password1 === passwordForm.password2"
                        class="h-4 w-4 text-green-500 dark:text-green-400"
                      />
                      <XCircleIcon v-else class="h-4 w-4 text-red-500 dark:text-red-400" />
                      <span
                        class="text-xs"
                        :class="
                          passwordForm.password1 === passwordForm.password2
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        "
                      >
                        {{
                          passwordForm.password1 === passwordForm.password2
                            ? 'Пароли совпадают'
                            : 'Пароли не совпадают'
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="formStates.password.isLoading"
                  :disabled="!isPasswordFormValid"
                >
                  {{ formStates.password.isLoading ? 'Изменение...' : 'Изменить пароль' }}
                </BaseButton>
              </div>
            </form>
          </div>

          <!-- Theme Settings Section -->
          <div class="pt-6 sm:pt-8">
            <div class="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <SwatchIcon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Тема интерфейса</h3>
            </div>

            <!-- Success/Error Messages -->
            <div
              v-if="formStates.theme.successMessage"
              class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
            >
              <p class="text-sm text-green-700 dark:text-green-300">
                {{ formStates.theme.successMessage }}
              </p>
            </div>
            <div
              v-if="formStates.theme.errorMessage"
              class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <p class="text-sm text-red-700 dark:text-red-300">
                {{ formStates.theme.errorMessage }}
              </p>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Выберите внешний вид интерфейса. Изменения применяются мгновенно и сохраняются на сервере.
              </p>
              
              <ThemeSelector @theme-changed="handleThemeChange" />
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Back to Profile Link -->
      <div class="mt-4 sm:mt-6 lg:mt-8 text-center">
        <router-link
          to="/profile"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md px-3 py-2"
        >
          <ArrowLeftIcon class="mr-2 h-4 w-4" />
          Вернуться к профилю
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { PersonalInfoUpdate } from '@/stores/user'
import type { ThemeMode } from '@/types/theme'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  SwatchIcon,
} from '@heroicons/vue/24/outline'
import { prepareErrorResponse } from '@/types/errors'

// Types for form data
interface PersonalInfoForm {
  firstName: string
  lastName: string
  avatar: File | null
  avatarPreview: string
}

interface ContactInfoForm {
  phone: string
  whatsapp: string
  telegram: string
}

interface EmailForm {
  currentEmail: string
  newEmail: string
  confirmEmail: string
}

interface PasswordForm {
  currentPassword: string
  password1: string
  password2: string
}

interface FormState {
  isLoading: boolean
  isValid: boolean
  errors: Record<string, string[]>
  successMessage: string
  errorMessage: string
}

interface FormStates {
  personalInfo: FormState
  contactInfo: FormState
  email: FormState
  password: FormState
  theme: FormState
}

const userStore = useUserStore()

// Form data
const personalInfoForm = reactive<PersonalInfoForm>({
  firstName: userStore.currentUser?.firstName || '',
  lastName: userStore.currentUser?.lastName || '',
  avatar: null,
  avatarPreview: '',
})

const contactInfoForm = reactive<ContactInfoForm>({
  phone: userStore.currentUser?.phone || '',
  whatsapp: userStore.currentUser?.whatsapp || '',
  telegram: userStore.currentUser?.telegram || '',
})

const emailForm = reactive<EmailForm>({
  currentEmail: userStore.currentUser?.email || '',
  newEmail: '',
  confirmEmail: '',
})

const passwordForm = reactive<PasswordForm>({
  currentPassword: '',
  password1: '',
  password2: '',
})

// Form states
const formStates = reactive<FormStates>({
  personalInfo: {
    isLoading: false,
    isValid: false,
    errors: {},
    successMessage: '',
    errorMessage: '',
  },
  contactInfo: {
    isLoading: false,
    isValid: false,
    errors: {},
    successMessage: '',
    errorMessage: '',
  },
  email: {
    isLoading: false,
    isValid: false,
    errors: {},
    successMessage: '',
    errorMessage: '',
  },
  password: {
    isLoading: false,
    isValid: false,
    errors: {},
    successMessage: '',
    errorMessage: '',
  },
  theme: {
    isLoading: false,
    isValid: false,
    errors: {},
    successMessage: '',
    errorMessage: '',
  },
})

// Computed properties for user display
const userInitials = computed(() => {
  if (!userStore.currentUser) return ''
  return `${userStore.currentUser.firstName.charAt(0)}${userStore.currentUser.lastName.charAt(0)}`
})

// Password strength calculation (copied from ChangePasswordPage)
const passwordStrength = computed(() => {
  const password = passwordForm.password1
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

// Form validation
const isPersonalInfoFormValid = computed(() => {
  return personalInfoForm.firstName.trim() && personalInfoForm.lastName.trim()
})

const isContactInfoFormValid = computed(() => {
  // Contact info can be optional, form is always valid
  return true
})

const isEmailFormValid = computed(() => {
  return (
    emailForm.newEmail &&
    emailForm.confirmEmail &&
    emailForm.newEmail === emailForm.confirmEmail &&
    emailForm.newEmail !== emailForm.currentEmail &&
    /\S+@\S+\.\S+/.test(emailForm.newEmail)
  )
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.currentPassword &&
    passwordForm.password1 &&
    passwordForm.password2 &&
    passwordForm.password1 === passwordForm.password2 &&
    passwordForm.password1.length >= 8 &&
    passwordForm.currentPassword !== passwordForm.password1
  )
})

// Avatar handling
const avatarInput = ref<HTMLInputElement | null>(null)

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    personalInfoForm.avatar = file

    // Create preview
    const reader = new FileReader()
    reader.onload = e => {
      personalInfoForm.avatarPreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Form submission methods
const submitPersonalInfo = async () => {
  if (!isPersonalInfoFormValid.value) return

  formStates.personalInfo.isLoading = true
  formStates.personalInfo.errors = {}
  formStates.personalInfo.successMessage = 'Идет сохранение...'
  formStates.personalInfo.errorMessage = ''

  try {
    const updateData: PersonalInfoUpdate = {
      firstName: personalInfoForm.firstName,
      lastName: personalInfoForm.lastName,
    }
    
    if (personalInfoForm.avatar) {
      updateData.avatar = personalInfoForm.avatar
    }
    
    await userStore.updatePersonalInfo(updateData)

    formStates.personalInfo.successMessage = 'Личная информация успешно обновлена'
    personalInfoForm.avatar = null;
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при обновлении личной информации.')
    formStates.personalInfo.errorMessage = message
    formStates.personalInfo.successMessage = ''
    formStates.personalInfo.errors = errorsData || {}
    console.error('Failed to update personal info:', error)
  } finally {
    formStates.personalInfo.isLoading = false
  }
}

const submitContactInfo = async () => {
  formStates.contactInfo.isLoading = true
  formStates.contactInfo.errors = {}
  formStates.contactInfo.successMessage = 'Идет сохранение...'
  formStates.contactInfo.errorMessage = ''

  try {
    await userStore.updateContactInfo({
      phone: contactInfoForm.phone,
      whatsapp: contactInfoForm.whatsapp,
      telegram: contactInfoForm.telegram,
    })

    formStates.contactInfo.successMessage = 'Контактная информация успешно обновлена'
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при обновлении контактной информации.')
    formStates.contactInfo.errorMessage = message
    formStates.contactInfo.successMessage = ''
    formStates.contactInfo.errors = errorsData || {}
    console.error('Failed to update contact info:', error)
  } finally {
    formStates.contactInfo.isLoading = false
  }
}

const submitEmail = async () => {
  if (!isEmailFormValid.value) return

  formStates.email.isLoading = true
  formStates.email.errors = {}
  formStates.email.successMessage = 'Идет сохранение...'
  formStates.email.errorMessage = ''

  try {
    const result = await userStore.updateEmail({
      newEmail: emailForm.newEmail,
      confirmEmail: emailForm.confirmEmail,
    })

    if (result.verificationRequired) {
      formStates.email.successMessage = 'Письмо с подтверждением отправлено на новый email адрес'
    } else {
      formStates.email.successMessage = 'Email адрес успешно обновлен'
    }

    // Reset form
    emailForm.newEmail = ''
    emailForm.confirmEmail = ''
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при обновлении email адреса.')
    formStates.email.errorMessage = message
    formStates.email.successMessage = ''
    formStates.email.errors = errorsData || {}
    console.error('Failed to update email:', error)
  } finally {
    formStates.email.isLoading = false
  }
}

const submitPasswordChange = async () => {
  if (!isPasswordFormValid.value) return

  formStates.password.isLoading = true
  formStates.password.errors = {}
  formStates.password.successMessage = 'Идет сохранение...'
  formStates.password.errorMessage = ''

  try {
    await userStore.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.password1,
      confirmPassword: passwordForm.password2,
    })

    formStates.password.successMessage = 'Пароль успешно изменен'

    // Reset form for security
    passwordForm.currentPassword = ''
    passwordForm.password1 = ''
    passwordForm.password2 = ''
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при смене пароля. Проверьте введенные данные.')
    formStates.password.errorMessage = message
    formStates.password.successMessage = ''
    formStates.password.errors = errorsData || {}
    console.error(`Failed to change password: ${JSON.stringify(formStates.password.errors)}`);
  } finally {
    formStates.password.isLoading = false
  }
}

const handleThemeChange = async (theme: ThemeMode) => {
  formStates.theme.isLoading = true
  formStates.theme.errors = {}
  formStates.theme.successMessage = 'Сохранение темы...'
  formStates.theme.errorMessage = ''

  try {
    await userStore.updateTheme({ uiTheme: theme })
    formStates.theme.successMessage = 'Тема успешно сохранена'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      formStates.theme.successMessage = ''
    }, 3000)
  } catch (error) {
    const {message, data: errorsData} = prepareErrorResponse(error, 'Ошибка при сохранении темы.')
    formStates.theme.errorMessage = message
    formStates.theme.successMessage = ''
    formStates.theme.errors = errorsData || {}
    console.error('Failed to update theme:', error)
  } finally {
    formStates.theme.isLoading = false
  }
}
</script>
