import type { User } from '@/types'

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
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return mockUser
  }
}