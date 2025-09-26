import type { User } from '@/types'
import { usersApiService } from './users'

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

export interface ThemeUpdate {
  uiTheme: string
}

/**
 * User Service
 * Handles API calls related to user management using the UsersApiService
 */
export class UserService {
  /**
   * Update user's "Open to Offers" status
   * @param userId - The ID of the user to update
   * @param isOpenToOffers - The new status value
   * @returns Promise resolving to the updated user object
   */
  async updateUserOpenToOffers(isOpenToOffers: boolean): Promise<User> {
    try {
      return await usersApiService.updateUserOpenToOffers(isOpenToOffers)
    } catch (error) {
      console.error('Failed to update user open to offers status:', error)
      throw error
    }
  }

  /**
   * Get user profile by ID
   * @param userId - The ID of the user to fetch
   * @returns Promise resolving to the user object
   */
  async getUserProfile(userId: string): Promise<User> {
    try {
      return await usersApiService.getUserProfile(userId)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw error
    }
  }

  /**
   * Get current user profile
   * @returns Promise resolving to the current user object
   */
  async getCurrentUser(): Promise<User> {
    try {
      return await usersApiService.getCurrentUser()
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      throw error
    }
  }

  /**
   * Update user's personal information
   * @param data - Personal info data to update
   * @returns Promise resolving to the updated user object
   */
  async updatePersonalInfo(data: PersonalInfoUpdate): Promise<User> {
    try {
      return await usersApiService.updatePersonalInfo(data)
    } catch (error) {
      console.error('Failed to update personal information:', error)
      throw error
    }
  }

  /**
   * Update user's personal information (text only, no avatar)
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @returns Promise resolving to the updated user object
   */
  async updatePersonalInfoText(firstName: string, lastName: string): Promise<User> {
    try {
      return await usersApiService.updatePersonalInfoText(firstName, lastName)
    } catch (error) {
      console.error('Failed to update personal information:', error)
      throw error
    }
  }

  /**
   * Update user's avatar only
   * @param avatar - Avatar file to upload
   * @returns Promise resolving to the updated user object
   */
  async updateAvatar(avatar: File): Promise<User> {
    try {
      return await usersApiService.updateAvatar(avatar)
    } catch (error) {
      console.error('Failed to update avatar:', error)
      throw error
    }
  }

  /**
   * Update user's contact information
   * @param data - Contact info data to update
   * @returns Promise resolving to the updated user object
   */
  async updateContactInfo(data: ContactInfoUpdate): Promise<User> {
    try {
      return await usersApiService.updateContactInfo(data)
    } catch (error) {
      console.error('Failed to update contact information:', error)
      throw error
    }
  }

  /**
   * Update user's email address
   * @param data - Email update data
   * @returns Promise resolving to update result
   */
  async updateEmail(data: EmailUpdate): Promise<{ message: string; verificationRequired: boolean }> {
    try {
      return await usersApiService.updateEmail(data)
    } catch (error) {
      console.error('Failed to update email address:', error)
      throw error
    }
  }

  /**
   * Change user's password
   * @param data - Password change data
   * @returns Promise resolving to success message
   */
  async changePassword(data: PasswordChange): Promise<{ message: string }> {
    try {
      return await usersApiService.changePassword(data)
    } catch (error) {
      console.error('Failed to change password:', error)
      throw error
    }
  }

  /**
   * Update user's UI theme preference
   * @param data - Theme update data
   * @returns Promise resolving to the updated user object
   */
  async updateTheme(data: ThemeUpdate): Promise<User> {
    try {
      return await usersApiService.updateTheme(data)
    } catch (error) {
      console.error('Failed to update theme:', error)
      throw error
    }
  }
}

// Create and export default instance
export const userService = new UserService()

// Export convenience functions
export const userApi = {
  getCurrentUser: () => userService.getCurrentUser(),
  getUserProfile: (userId: string) => userService.getUserProfile(userId),
  updateUserOpenToOffers: (isOpenToOffers: boolean) => 
    userService.updateUserOpenToOffers(isOpenToOffers),
  updatePersonalInfo: (data: PersonalInfoUpdate) => 
    userService.updatePersonalInfo(data),
  updatePersonalInfoText: (firstName: string, lastName: string) => 
    userService.updatePersonalInfoText(firstName, lastName),
  updateAvatar: (avatar: File) => 
    userService.updateAvatar(avatar),
  updateContactInfo: (data: ContactInfoUpdate) => 
    userService.updateContactInfo(data),
  updateEmail: (data: EmailUpdate) => 
    userService.updateEmail(data),
  changePassword: (data: PasswordChange) => 
    userService.changePassword(data),
  updateTheme: (data: ThemeUpdate) => 
    userService.updateTheme(data),
}