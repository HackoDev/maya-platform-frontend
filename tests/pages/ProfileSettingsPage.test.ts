import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ProfileSettingsPage from '@/pages/ProfileSettingsPage.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

// Mock icons
vi.mock('@heroicons/vue/24/outline', () => ({
  UserCircleIcon: { name: 'UserCircleIcon' },
  PhoneIcon: { name: 'PhoneIcon' },
  EnvelopeIcon: { name: 'EnvelopeIcon' },
  KeyIcon: { name: 'KeyIcon' },
  ArrowLeftIcon: { name: 'ArrowLeftIcon' },
  CheckCircleIcon: { name: 'CheckCircleIcon' },
  XCircleIcon: { name: 'XCircleIcon' },
}))

// Mock components
vi.mock('@/components/common/PageHeader.vue', () => ({
  default: { name: 'PageHeader', template: '<div class="page-header">PageHeader</div>' }
}))

vi.mock('@/components/ui/BaseCard.vue', () => ({
  default: { name: 'BaseCard', template: '<div class="base-card"><slot></slot></div>' }
}))

vi.mock('@/components/ui/BaseInput.vue', () => ({
  default: { 
    name: 'BaseInput', 
    template: '<input class="base-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'type', 'placeholder', 'error', 'required'],
    emits: ['update:modelValue']
  }
}))

vi.mock('@/components/ui/BaseButton.vue', () => ({
  default: { 
    name: 'BaseButton', 
    template: '<button class="base-button" :disabled="disabled || loading"><slot></slot></button>',
    props: ['variant', 'loading', 'disabled', 'type', 'size'],
  }
}))

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'user',
  userType: 'specialist',
  isActive: true,
  isOpenToOffers: false,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
}

describe('ProfileSettingsPage', () => {
  let wrapper: any
  let userStore: any
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/profile', component: { template: '<div>Profile</div>' } },
        { path: '/profile/settings', component: ProfileSettingsPage },
      ]
    })

    userStore = useUserStore()
    userStore.currentUser = mockUser

    // Mock store methods
    userStore.updatePersonalInfo = vi.fn().mockResolvedValue(mockUser)
    userStore.updateContactInfo = vi.fn().mockResolvedValue(mockUser)
    userStore.updateEmail = vi.fn().mockResolvedValue({ verificationRequired: true })
    userStore.changePassword = vi.fn().mockResolvedValue({ message: 'Password changed' })

    wrapper = mount(ProfileSettingsPage, {
      global: {
        plugins: [router]
      }
    })
  })

  describe('Component Rendering', () => {
    it('should render the page header', () => {
      expect(wrapper.find('.page-header').exists()).toBe(true)
    })

    it('should render all four form sections', () => {
      const cards = wrapper.findAll('.base-card')
      expect(cards).toHaveLength(4)
    })

    it('should render personal info form with correct fields', () => {
      const personalInfoInputs = wrapper.findAll('input[type="text"]')
      expect(personalInfoInputs.length).toBeGreaterThanOrEqual(2) // firstName and lastName
    })

    it('should render contact info form with correct fields', () => {
      const phoneInputs = wrapper.findAll('input[type="tel"]')
      expect(phoneInputs.length).toBeGreaterThanOrEqual(2) // phone and whatsapp
    })

    it('should render email form with correct fields', () => {
      const emailInputs = wrapper.findAll('input[type="email"]')
      expect(emailInputs.length).toBeGreaterThanOrEqual(2) // newEmail and confirmEmail
    })

    it('should render password form with correct fields', () => {
      const passwordInputs = wrapper.findAll('input[type="password"]')
      expect(passwordInputs.length).toBeGreaterThanOrEqual(3) // current, new, confirm passwords
    })
  })

  describe('Personal Info Form', () => {
    it('should validate first name requirement', async () => {
      const firstNameInput = wrapper.find('input[id="firstName"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await firstNameInput.setValue('')
      await wrapper.vm.$nextTick()
      
      expect(submitButton.element.disabled).toBe(true)
    })

    it('should validate last name requirement', async () => {
      const lastNameInput = wrapper.find('input[id="lastName"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await lastNameInput.setValue('')
      await wrapper.vm.$nextTick()
      
      expect(submitButton.element.disabled).toBe(true)
    })

    it('should submit personal info independently', async () => {
      const form = wrapper.find('form')
      const firstNameInput = wrapper.find('input[id="firstName"]')
      const lastNameInput = wrapper.find('input[id="lastName"]')
      
      await firstNameInput.setValue('Jane')
      await lastNameInput.setValue('Smith')
      await wrapper.vm.$nextTick()
      
      await form.trigger('submit.prevent')
      
      expect(userStore.updatePersonalInfo).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        avatar: null
      })
    })

    it('should handle avatar upload', async () => {
      const fileInput = wrapper.find('input[type="file"]')
      const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' })
      
      // Create a mock FileReader
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onload: null,
        result: 'data:image/jpeg;base64,mockdata'
      }
      
      global.FileReader = vi.fn(() => mockFileReader) as any
      
      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })
      
      await fileInput.trigger('change')
      
      // Simulate FileReader onload
      if (mockFileReader.onload) {
        mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mockdata' } } as any)
      }
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.personalInfoForm.avatar).toBe(file)
      expect(wrapper.vm.personalInfoForm.avatarPreview).toBe('data:image/jpeg;base64,mockdata')
    })
  })

  describe('Contact Info Form', () => {
    it('should allow optional fields', async () => {
      const phoneInput = wrapper.find('input[id="phone"]')
      const whatsappInput = wrapper.find('input[id="whatsapp"]')
      const telegramInput = wrapper.find('input[id="telegram"]')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await phoneInput.setValue('')
      await whatsappInput.setValue('')
      await telegramInput.setValue('')
      await wrapper.vm.$nextTick()
      
      expect(submitButton.element.disabled).toBe(false)
    })

    it('should submit contact info independently', async () => {
      const contactForm = wrapper.findAll('form')[1] // Second form is contact info
      const phoneInput = wrapper.find('input[id="phone"]')
      const whatsappInput = wrapper.find('input[id="whatsapp"]')
      const telegramInput = wrapper.find('input[id="telegram"]')
      
      await phoneInput.setValue('+1234567890')
      await whatsappInput.setValue('+1234567890')
      await telegramInput.setValue('@telegram')
      await wrapper.vm.$nextTick()
      
      await contactForm.trigger('submit.prevent')
      
      expect(userStore.updateContactInfo).toHaveBeenCalledWith({
        phone: '+1234567890',
        whatsapp: '+1234567890',
        telegram: '@telegram'
      })
    })
  })

  describe('Email Form', () => {
    it('should display current email', () => {
      const currentEmailDisplay = wrapper.find('p')
      expect(currentEmailDisplay.text()).toContain(mockUser.email)
    })

    it('should validate email format', async () => {
      const newEmailInput = wrapper.find('input[id="newEmail"]')
      const confirmEmailInput = wrapper.find('input[id="confirmEmail"]')
      
      await newEmailInput.setValue('invalid-email')
      await confirmEmailInput.setValue('invalid-email')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.isEmailFormValid).toBe(false)
    })

    it('should validate email confirmation match', async () => {
      const newEmailInput = wrapper.find('input[id="newEmail"]')
      const confirmEmailInput = wrapper.find('input[id="confirmEmail"]')
      
      await newEmailInput.setValue('new@example.com')
      await confirmEmailInput.setValue('different@example.com')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.isEmailFormValid).toBe(false)
    })

    it('should handle email verification flow', async () => {
      const emailForm = wrapper.findAll('form')[2] // Third form is email
      const newEmailInput = wrapper.find('input[id="newEmail"]')
      const confirmEmailInput = wrapper.find('input[id="confirmEmail"]')
      
      await newEmailInput.setValue('new@example.com')
      await confirmEmailInput.setValue('new@example.com')
      await wrapper.vm.$nextTick()
      
      await emailForm.trigger('submit.prevent')
      
      expect(userStore.updateEmail).toHaveBeenCalledWith({
        newEmail: 'new@example.com',
        confirmEmail: 'new@example.com'
      })
    })
  })

  describe('Password Form', () => {
    it('should validate password strength', async () => {
      const newPasswordInput = wrapper.find('input[id="newPassword"]')
      
      await newPasswordInput.setValue('weak')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.passwordStrengthText).toBe('Слабый')
      
      await newPasswordInput.setValue('StrongPassword123!')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.passwordStrengthText).toBe('Отличный')
    })

    it('should validate password confirmation', async () => {
      const newPasswordInput = wrapper.find('input[id="newPassword"]')
      const confirmPasswordInput = wrapper.find('input[id="confirmPassword"]')
      
      await newPasswordInput.setValue('password123')
      await confirmPasswordInput.setValue('different123')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.isPasswordFormValid).toBe(false)
    })

    it('should submit password change independently', async () => {
      const passwordForm = wrapper.findAll('form')[3] // Fourth form is password
      const currentPasswordInput = wrapper.find('input[id="currentPassword"]')
      const newPasswordInput = wrapper.find('input[id="newPassword"]')
      const confirmPasswordInput = wrapper.find('input[id="confirmPassword"]')
      
      await currentPasswordInput.setValue('oldpassword')
      await newPasswordInput.setValue('newpassword123')
      await confirmPasswordInput.setValue('newpassword123')
      await wrapper.vm.$nextTick()
      
      await passwordForm.trigger('submit.prevent')
      
      expect(userStore.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123'
      })
    })
  })

  describe('Form States and Loading', () => {
    it('should show loading state during form submission', async () => {
      // Mock a delayed response
      userStore.updatePersonalInfo = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )
      
      const form = wrapper.find('form')
      const submitButton = wrapper.find('button[type="submit"]')
      
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.formStates.personalInfo.isLoading).toBe(true)
      expect(submitButton.text()).toContain('Сохранение...')
    })

    it('should show success messages after successful submission', async () => {
      const form = wrapper.find('form')
      const firstNameInput = wrapper.find('input[id="firstName"]')
      const lastNameInput = wrapper.find('input[id="lastName"]')
      
      await firstNameInput.setValue('Jane')
      await lastNameInput.setValue('Smith')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()
      
      // Wait for async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.formStates.personalInfo.successMessage).toBe('Личная информация успешно обновлена')
    })

    it('should handle API errors gracefully', async () => {
      userStore.updatePersonalInfo = vi.fn().mockRejectedValue(new Error('API Error'))
      
      const form = wrapper.find('form')
      const firstNameInput = wrapper.find('input[id="firstName"]')
      const lastNameInput = wrapper.find('input[id="lastName"]')
      
      await firstNameInput.setValue('Jane')
      await lastNameInput.setValue('Smith')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()
      
      // Wait for async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.formStates.personalInfo.errorMessage).toBe('Ошибка при обновлении личной информации')
    })
  })

  describe('Navigation', () => {
    it('should render back to profile link', () => {
      const backLink = wrapper.find('a[href="/profile"]')
      expect(backLink.exists()).toBe(true)
      expect(backLink.text()).toContain('Вернуться к профилю')
    })
  })

  describe('Computed Properties', () => {
    it('should compute user initials correctly', () => {
      expect(wrapper.vm.userInitials).toBe('JD')
    })

    it('should validate forms correctly', () => {
      wrapper.vm.personalInfoForm.firstName = 'Jane'
      wrapper.vm.personalInfoForm.lastName = 'Smith'
      expect(wrapper.vm.isPersonalInfoFormValid).toBe(true)
      
      wrapper.vm.emailForm.newEmail = 'new@example.com'
      wrapper.vm.emailForm.confirmEmail = 'new@example.com'
      wrapper.vm.emailForm.currentEmail = 'old@example.com'
      expect(wrapper.vm.isEmailFormValid).toBe(true)
      
      wrapper.vm.passwordForm.currentPassword = 'old'
      wrapper.vm.passwordForm.newPassword = 'newpassword123'
      wrapper.vm.passwordForm.confirmPassword = 'newpassword123'
      expect(wrapper.vm.isPasswordFormValid).toBe(true)
    })
  })
})