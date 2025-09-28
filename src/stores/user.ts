import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { UserService } from '@/services/user'
import { authApi, type LoginCredentials } from '@/services/authApiClient'
import { emailChangeApiClient } from '@/services/emailChangeApiClient'
import { resetPasswordApiClient } from '@/services/resetPasswordApiClient'

// Profile update interfaces
export interface PersonalInfoUpdate {
  firstName: string
  lastName: string
  avatar?: File
}

export interface ContactInfoUpdate {
  phone: string
  whatsapp: string
  telegram: string
}

export interface EmailUpdate {
  newEmail: string
  confirmEmail: string
}

export interface EmailChangeOTP {
  newEmail: string
  otpToken: string
}

export interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ThemeUpdate {
  uiTheme: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Initialize the user service
  const userService = new UserService()

  const isAuthenticated = computed(() => currentUser.value !== null)
  const userCount = computed(() => users.value.length)
  const userDisplayName = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.firstName} ${currentUser.value.lastName}`
  })
  const userInitials = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.firstName.charAt(0)}${currentUser.value.lastName.charAt(0)}`
  })
  const userTypeLabel = computed(() => {
    if (!currentUser.value) return ''
    return currentUser.value.userType === 'specialist' ? 'Специалист' : 'Клиент'
  })

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      // Use authApiClient for real authentication
      const credentials: LoginCredentials = {
        username: email,
        password: password,
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID || 'XtBXtiE3ceaBoTdeagaLvBWArAhIR5oalakmwXFu',
        grant_type: 'password'
      }

      const response = await authApi.login(credentials)
      
      // Set current user from the API response
      currentUser.value = response.user
      
      return response
    } catch (err: any) {
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // Use authApiClient logout to clear tokens
      await authApi.logout()
    } catch (err) {
      console.warn('Error during logout:', err)
    } finally {
      // Clear local state regardless of API call result
      currentUser.value = null
      error.value = null
      users.value = []
    }
  }

  const logoutWithRedirect = async (redirectPath: string = '/login') => {
    try {
      // Perform logout
      await logout()
      
      // Import router dynamically to avoid circular dependencies
      const { useRouter } = await import('vue-router')
      const router = useRouter()
      
      // Redirect to specified path
      await router.push(redirectPath)
      
    } catch (error) {
      console.error('Error during logout with redirect:', error)
      // Fallback: try to redirect anyway
      try {
        const { useRouter } = await import('vue-router')
        const router = useRouter()
        await router.push(redirectPath)
      } catch (redirectError) {
        console.error('Error during fallback redirect:', redirectError)
        // Last resort: reload the page
        window.location.href = redirectPath
      }
    }
  }

  // New action to update the isOpenToOffers flag
  const updateOpenToOffers = async (isOpenToOffers: boolean) => {
    if (!currentUser.value) return

    try {
      // Call the user service to update the status
      const updatedUser = await userService.updateUserOpenToOffers(isOpenToOffers)
      
      // Update the local state with the response
      currentUser.value = updatedUser
      // Sync with authApiClient
      authApi.updateUserData(currentUser.value)
    } catch (err) {
      throw err
    }
  }

  // New methods for profile settings
  const updatePersonalInfo = async (data: PersonalInfoUpdate) => {
    try {
      const response = await userService.updatePersonalInfo(data)
      if (currentUser.value) {
        currentUser.value.firstName = response.firstName
        currentUser.value.lastName = response.lastName
        currentUser.value.avatar = response.avatar
        // Update name field
        currentUser.value.name = `${response.firstName} ${response.lastName}`
        // Sync with authApiClient
        authApi.updateUserData(currentUser.value)
      }
      return response
    } catch (err) {
      throw err
    }
  }

  const updateContactInfo = async (data: ContactInfoUpdate) => {
    try {
      const response = await userService.updateContactInfo(data)
      // Update local state with new contact information
      if (currentUser.value) {
        currentUser.value.phone = data.phone
        currentUser.value.whatsapp = data.whatsapp
        currentUser.value.telegram = data.telegram
        // Sync with authApiClient
        authApi.updateUserData(currentUser.value)
      }
      return response
    } catch (err) {
      throw err
    }
  }

  const updateEmail = async (data: EmailUpdate) => {
    try {
      const response = await userService.updateEmail(data)
      // Handle email verification flow
      return response
    } catch (err) {
      throw err
    }
  }

  // New methods for OTP-based email change
  const sendEmailChangeOTP = async (newEmail: string) => {
    try {
      const response = await emailChangeApiClient.sendChangeEmailOTP(newEmail)
      return response
    } catch (err) {
      throw err
    }
  }

  const verifyEmailChangeOTP = async (token: string, code: string) => {
    try {
      const response = await emailChangeApiClient.verifyOTP(token, code)
      return response
    } catch (err) {
      throw err
    }
  }

  const changeEmailWithOTP = async (otpToken: string, newEmail: string) => {
    try {
      const response = await emailChangeApiClient.changeEmail(otpToken, newEmail)
      
      // Update local user data
      if (currentUser.value) {
        currentUser.value.email = response.new_email
        authApi.updateUserData(currentUser.value)
      }
      
      return response
    } catch (err) {
      throw err
    }
  }

  const changePassword = async (data: PasswordChange) => {
    try {
      const response = await userService.changePassword(data)
      return response
    } catch (err) {
      throw err
    }
  }

  // Password reset methods
  const sendResetPasswordOTP = async (email: string) => {
    try {
      const response = await resetPasswordApiClient.sendResetOTP(email)
      return response
    } catch (error) {
      console.error('Failed to send reset password OTP:', error)
      throw error
    }
  }

  const verifyResetPasswordOTP = async (token: string, code: string) => {
    try {
      const response = await resetPasswordApiClient.verifyOTP(token, code)
      return response
    } catch (error) {
      console.error('Failed to verify reset password OTP:', error)
      throw error
    }
  }

  const resetPassword = async (otpToken: string, newPassword: string, confirmPassword: string) => {
    try {
      const response = await resetPasswordApiClient.resetPassword(otpToken, newPassword, confirmPassword)
      return response
    } catch (error) {
      console.error('Failed to reset password:', error)
      throw error
    }
  }

  const updateTheme = async (data: ThemeUpdate) => {
    try {
      const response = await userService.updateTheme(data)
      // Update local state with new theme
      if (currentUser.value) {
        currentUser.value.uiTheme = data.uiTheme
        // Sync with authApiClient
        authApi.updateUserData(currentUser.value)
      }
      return response
    } catch (err) {
      throw err
    }
  }

  // Initialize with stored authentication data
  const initializeAuth = () => {
    try {
      const hasStoredToken = authApi.initialize()
      if (hasStoredToken) {
        const storedUser = authApi.getCurrentUser()
        if (storedUser) {
          currentUser.value = storedUser
        }
      }
      return hasStoredToken
    } catch (err) {
      throw err;
    }
  }

  // Sync user data with authApiClient
  const syncUserData = () => {
    const authUser = authApi.getCurrentUser()
    if (authUser && currentUser.value) {
      // Update local user data with auth data
      currentUser.value = authUser
    }
  }

  // Update user data in both store and authApiClient
  const updateUserData = (userData: Partial<User>) => {
    if (currentUser.value) {
      const updatedUser = { ...currentUser.value, ...userData }
      currentUser.value = updatedUser
      authApi.updateUserData(updatedUser)
    }
  }

  return {
    currentUser,
    users,
    loading,
    error,
    isAuthenticated,
    userCount,
    userDisplayName,
    userInitials,
    userTypeLabel,
    login,
    logout,
    logoutWithRedirect,
    updateOpenToOffers,
    updatePersonalInfo,
    updateContactInfo,
    updateEmail,
    sendEmailChangeOTP,
    verifyEmailChangeOTP,
    changeEmailWithOTP,
    changePassword,
    sendResetPasswordOTP,
    verifyResetPasswordOTP,
    resetPassword,
    updateTheme,
    initializeAuth,
    syncUserData,
    updateUserData,
  }
})