/**
 * Users API Service
 * Extends BaseApiClient to handle user management API calls
 */

import { BaseApiClient, CONTENT_TYPES } from './baseApiClient'
import { authApiClient } from './authApiClient'
import type { User } from '@/types'

// API Response interfaces
export interface UserMeResponse {
  id: number
  email: string
  userType: string
  firstName: string
  lastName: string
  isActive: boolean
  avatar: string | null
  whatsapp: string | null
  phone: string | null
  telegram: string | null
  uiTheme: string | null
  isOpenToOffers?: boolean
  lastLoginAt: string
  createdAt: string
  name: string
}

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
 * Users API Service class
 * Extends BaseApiClient to handle user management API calls
 */
export class UsersApiService extends BaseApiClient {
  constructor(baseURL?: string) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const isDev = import.meta.env.DEV
    const apiBaseURL = baseURL || 
      (isDev ? '' : import.meta.env.VITE_API_BASE_URL) || 
      (isDev ? '' : import.meta.env.VITE_BASE_URL) ||
      (isDev ? '' : 'http://127.0.0.1:8000')

    super(apiBaseURL, {
      'Cache-Control': 'no-cache',
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }

  /**
   * Set authentication token for API requests
   * @param token - Bearer token
   */
  setAuthToken(token: string): void {
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Authorization': `Bearer ${token}`,
    })
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(): void {
    const headers = this.getDefaultHeaders()
    delete headers['Authorization']
    this.setDefaultHeaders(headers)
  }

  /**
   * Initialize with stored token (for app startup)
   */
  initializeWithStoredToken(): boolean {
    const token = authApiClient.getAccessToken()
    
    if (token) {
      this.setAuthToken(token)
      return true
    }
    
    return false
  }

  /**
   * Get current authentication token from AuthApiClient
   */
  private getCurrentAuthToken(): string | null {
    return authApiClient.getAccessToken()
  }

  /**
   * Ensure authentication token is set for requests
   */
  private ensureAuthenticated(): void {
    const token = this.getCurrentAuthToken()
    if (token && !this.getDefaultHeaders()['Authorization']) {
      this.setAuthToken(token)
    }
  }

  /**
   * Get current user profile
   * Implements: GET /api/web/users/me
   * @returns Promise resolving to the current user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      this.ensureAuthenticated()
      const response = await this.get<UserMeResponse>('/api/web/users/me')
      
      // Transform API response to match our User interface
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      throw new Error('Failed to fetch user profile. Please try again.')
    }
  }

  /**
   * Update user's "Open to Offers" status
   * @param userId - The ID of the user to update
   * @param isOpenToOffers - The new status value
   * @returns Promise resolving to the updated user object
   */
  async updateUserOpenToOffers(isOpenToOffers: boolean): Promise<User> {
    try {
      this.ensureAuthenticated()
      const response = await this.patch<UserMeResponse>(`/api/web/users/me`, {
        isOpenToOffers
      })
      
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to update user open to offers status:', error)
      throw new Error('Failed to update user status. Please try again.')
    }
  }

  /**
   * Get user profile by ID
   * @param userId - The ID of the user to fetch
   * @returns Promise resolving to the user object
   */
  async getUserProfile(userId: string): Promise<User> {
    try {
      this.ensureAuthenticated()
      const response = await this.get<UserMeResponse>(`/api/web/users/${userId}`)
      
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw new Error('Failed to fetch user profile. Please try again.')
    }
  }

  /**
   * Update user's personal information
   * @param data - Personal info data to update
   * @returns Promise resolving to the updated user object
   */
  async updatePersonalInfo(data: PersonalInfoUpdate): Promise<User> {
    try {
      this.ensureAuthenticated()
      
      // If avatar is provided, upload it separately using dedicated endpoint
      if (data.avatar) {
        // First update personal info (text data)
        await this.patch<UserMeResponse>('/api/web/users/me', {
          firstName: data.firstName,
          lastName: data.lastName,
        })

        const avatarResponse = await this.updateAvatar(data.avatar)
        // Return the updated user data from avatar response (which should include the new avatar)
        return avatarResponse
      }
      // For text-only updates, use JSON
      const response = await this.patch<UserMeResponse>('/api/web/users/me', {
        firstName: data.firstName,
        lastName: data.lastName,
      })
      
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to update personal information:', error)
      throw error;
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
      this.ensureAuthenticated()
      
      const response = await this.patch<UserMeResponse>('/api/web/users/me', {
        firstName,
        lastName,
      })
      
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to update personal information:', error)
      throw new Error('Failed to update personal information. Please try again.')
    }
  }

  /**
   * Update user's avatar only
   * @param avatar - Avatar file to upload
   * @returns Promise resolving to the updated user object
   */
  async updateAvatar(avatar: File): Promise<User> {
    try {
      this.ensureAuthenticated()
      
      const formData = new FormData()
      formData.append('avatar', avatar)

      const response = await this.patch<UserMeResponse>('/api/web/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to update avatar:', error)
      throw new Error('Failed to update avatar. Please try again.')
    }
  }

  /**
   * Update user's contact information
   * @param data - Contact info data to update
   * @returns Promise resolving to the updated user object
   */
  async updateContactInfo(data: ContactInfoUpdate): Promise<User> {
    try {
      this.ensureAuthenticated()
      const response = await this.patch<UserMeResponse>('/api/web/users/me', {
        phone: data.phone,
        whatsapp: data.whatsapp,
        telegram: data.telegram,
      })
      
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to update contact information:', error)
      throw error;
    }
  }

  /**
   * Update user's email address
   * @param data - Email update data
   * @returns Promise resolving to update result
   */
  async updateEmail(data: EmailUpdate): Promise<{ message: string; verificationRequired: boolean }> {
    try {
      this.ensureAuthenticated()
      const response = await this.patch<{ message: string; verificationRequired: boolean }>('/api/web/users/me/email', {
        newEmail: data.newEmail,
        confirmEmail: data.confirmEmail,
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to update email address:', error)
      throw new Error('Failed to update email address. Please try again.')
    }
  }

  /**
   * Change user's password
   * @param data - Password change data
   * @returns Promise resolving to success message
   */
  async changePassword(data: PasswordChange): Promise<{ message: string }> {
    try {
      this.ensureAuthenticated()
      const response = await this.post<{ message: string }>('/api/web/users/me/change-password', {
        currentPassword: data.currentPassword,
        password1: data.newPassword,
        password2: data.confirmPassword,
      })
      
      return response.data
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
      this.ensureAuthenticated()
      const response = await this.patch<UserMeResponse>('/api/web/users/me', {
        uiTheme: data.uiTheme,
      })
      
      return this.transformUserResponse(response.data)
    } catch (error) {
      console.error('Failed to update theme:', error)
      throw new Error('Failed to update theme preference. Please try again.')
    }
  }

  /**
   * Transform API response to match our User interface
   * @param apiUser - User data from API
   * @returns Transformed User object
   */
  private transformUserResponse(apiUser: UserMeResponse): User {
    return {
      id: apiUser.id,
      name: apiUser.name,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      email: apiUser.email,
      avatar: apiUser.avatar,
      userType: apiUser.userType,
      isActive: apiUser.isActive,
      isOpenToOffers: apiUser.isOpenToOffers ?? false,
      uiTheme: apiUser.uiTheme,
      phone: apiUser.phone,
      whatsapp: apiUser.whatsapp,
      telegram: apiUser.telegram,
      lastLoginAt: apiUser.lastLoginAt,
      createdAt: apiUser.createdAt,
      updatedAt: new Date().toISOString(), // Use current time as fallback
    }
  }
}

// Create and export default instance
export const usersApiService = new UsersApiService()


// Note: Types are already exported above with their declarations
