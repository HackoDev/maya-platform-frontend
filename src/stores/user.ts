import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { UserService } from '@/services/user'

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

export interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
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

  const login = async (email: string, _password: string) => {
    loading.value = true
    error.value = null

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Determine user type based on email for testing purposes
      let userType: 'specialist' | 'client' = 'specialist'
      if (email === 'client@example.com') {
        userType = 'client'
      }

      currentUser.value = {
        id: '1',
        name: userType === 'specialist' ? 'Анна Смирнова' : 'Иван Петров',
        firstName: userType === 'specialist' ? 'Анна' : 'Иван',
        lastName: userType === 'specialist' ? 'Смирнова' : 'Петров',
        email,
        role: 'user',
        userType,
        isActive: true,
        isOpenToOffers: userType === 'specialist' ? false : undefined, // Only specialists have this field
        // Fake contact data for demo
        phone: userType === 'specialist' ? '+7 (916) 123-45-67' : '+7 (903) 987-65-43',
        whatsapp: userType === 'specialist' ? '+7 (916) 123-45-67' : '+7 (903) 987-65-43',
        telegram: userType === 'specialist' ? '@anna_designer' : '@ivan_employer',
        avatar: undefined,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    currentUser.value = null
    error.value = null
    
    // Clear any cached data
    users.value = []
  }

  // New action to update the isOpenToOffers flag
  const updateOpenToOffers = async (isOpenToOffers: boolean) => {
    if (!currentUser.value) return

    try {
      // Call the user service to update the status
      const updatedUser = await userService.updateUserOpenToOffers(currentUser.value.id, isOpenToOffers)
      
      // Update the local state with the response
      currentUser.value = updatedUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update open to offers status'
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
      }
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update personal info'
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
      }
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update contact info'
      throw err
    }
  }

  const updateEmail = async (data: EmailUpdate) => {
    try {
      const response = await userService.updateEmail(data)
      // Handle email verification flow
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update email'
      throw err
    }
  }

  const changePassword = async (data: PasswordChange) => {
    try {
      const response = await userService.changePassword(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to change password'
      throw err
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
    updateOpenToOffers,
    updatePersonalInfo,
    updateContactInfo,
    updateEmail,
    changePassword,
  }
})