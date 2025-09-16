import type { User } from '@/types'

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

// Mock API delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * User Service
 * Handles API calls related to user management
 */
export class UserService {
  /**
   * Update user's "Open to Offers" status
   * @param userId - The ID of the user to update
   * @param isOpenToOffers - The new status value
   * @returns Promise resolving to the updated user object
   */
  async updateUserOpenToOffers(userId: string, isOpenToOffers: boolean): Promise<User> {
    // Simulate API delay
    await delay(800)

    // In a real implementation, this would make an HTTP request to update the user
    // For example:
    // const response = await axios.patch(`/api/users/${userId}`, { isOpenToOffers })
    // return response.data

    // For now, we'll mock the response
    const mockUser: User = {
      id: userId,
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'user',
      userType: 'specialist',
      isActive: true,
      isOpenToOffers,
      // Mock contact data
      phone: '+7 (916) 123-45-67',
      whatsapp: '+7 (916) 123-45-67',
      telegram: '@john_specialist',
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Simulate potential API errors (10% chance of failure for demonstration)
    if (Math.random() < 0.1) {
      throw new Error('Failed to update user status. Please try again.')
    }

    return mockUser
  }

  /**
   * Get user profile by ID
   * @param userId - The ID of the user to fetch
   * @returns Promise resolving to the user object
   */
  async getUserProfile(userId: string): Promise<User> {
    // Simulate API delay
    await delay(600)

    // In a real implementation, this would make an HTTP request to fetch the user
    // For example:
    // const response = await axios.get(`/api/users/${userId}`)
    // return response.data

    // For now, we'll mock the response
    const mockUser: User = {
      id: userId,
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'user',
      userType: 'specialist',
      isActive: true,
      isOpenToOffers: false,
      // Mock contact data
      phone: '+7 (916) 123-45-67',
      whatsapp: '+7 (916) 123-45-67',
      telegram: '@john_specialist',
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return mockUser
  }

  /**
   * Update user's personal information
   * @param data - Personal info data to update
   * @returns Promise resolving to the updated user object
   */
  async updatePersonalInfo(data: PersonalInfoUpdate): Promise<User> {
    // Simulate API delay
    await delay(800)

    // In a real implementation, this would make an HTTP request
    // const formData = new FormData()
    // formData.append('firstName', data.firstName)
    // formData.append('lastName', data.lastName)
    // if (data.avatar) {
    //   formData.append('avatar', data.avatar)
    // }
    // const response = await axios.patch('/api/user/personal', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // })
    // return response.data

    // Mock the response
    const mockUser: User = {
      id: '1',
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: 'john.doe@example.com',
      role: 'user',
      userType: 'specialist',
      isActive: true,
      isOpenToOffers: false,
      // Mock contact data
      phone: '+7 (916) 123-45-67',
      whatsapp: '+7 (916) 123-45-67',
      telegram: '@john_specialist',
      avatar: data.avatar ? URL.createObjectURL(data.avatar) : undefined,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Simulate potential API errors
    if (Math.random() < 0.1) {
      throw new Error('Failed to update personal information. Please try again.')
    }

    return mockUser
  }

  /**
   * Update user's contact information
   * @param data - Contact info data to update
   * @returns Promise resolving to the updated user object
   */
  async updateContactInfo(data: ContactInfoUpdate): Promise<User> {
    // Simulate API delay
    await delay(600)

    // In a real implementation:
    // const response = await axios.patch('/api/user/contacts', data)
    // return response.data

    // Mock the response
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'user',
      userType: 'specialist',
      isActive: true,
      isOpenToOffers: false,
      // Update with provided contact data
      phone: data.phone,
      whatsapp: data.whatsapp,
      telegram: data.telegram,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Simulate potential API errors
    if (Math.random() < 0.05) {
      throw new Error('Failed to update contact information. Please try again.')
    }

    return mockUser
  }

  /**
   * Update user's email address
   * @param data - Email update data
   * @returns Promise resolving to update result
   */
  async updateEmail(data: EmailUpdate): Promise<{ message: string; verificationRequired: boolean }> {
    // Simulate API delay
    await delay(1000)

    // In a real implementation:
    // const response = await axios.patch('/api/user/email', data)
    // return response.data

    // Simulate potential API errors
    if (Math.random() < 0.1) {
      throw new Error('Failed to update email address. Please try again.')
    }

    // Mock the response
    return {
      message: 'Email verification sent to new address',
      verificationRequired: true,
    }
  }

  /**
   * Change user's password
   * @param data - Password change data
   * @returns Promise resolving to success message
   */
  async changePassword(data: PasswordChange): Promise<{ message: string }> {
    // Simulate API delay
    await delay(1200)

    // In a real implementation:
    // const response = await axios.post('/api/user/change-password', data)
    // return response.data

    // Simulate potential API errors
    if (Math.random() < 0.15) {
      throw new Error('Invalid current password or password change failed. Please try again.')
    }

    // Mock the response
    return {
      message: 'Password changed successfully',
    }
  }
}