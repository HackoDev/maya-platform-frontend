import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

// Mock the user service
const mockUpdateUserOpenToOffers = vi.fn()
const mockGetUserProfile = vi.fn()

vi.mock('@/services/user', () => ({
  UserService: vi.fn().mockImplementation(() => ({
    updateUserOpenToOffers: mockUpdateUserOpenToOffers,
    getUserProfile: mockGetUserProfile,
  }))
}))

const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'user',
  userType: 'specialist',
  isActive: true,
  isOpenToOffers: false,
  lastLoginAt: '2024-01-15T10:30:00Z',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
}

describe('User Store', () => {
  let store: ReturnType<typeof useUserStore>

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    
    setActivePinia(createPinia())
    store = useUserStore()
  })

  describe('updateOpenToOffers', () => {
    it('should update the isOpenToOffers status for the current user', async () => {
      // Set up the current user
      store.currentUser = { ...mockUser }
      
      // Mock the service response
      const updatedUser = { ...mockUser, isOpenToOffers: true }
      mockUpdateUserOpenToOffers.mockResolvedValue(updatedUser)

      // Call the action
      await store.updateOpenToOffers(true)

      // Verify the result
      expect(store.currentUser?.isOpenToOffers).toBe(true)
      expect(mockUpdateUserOpenToOffers).toHaveBeenCalledWith('user-1', true)
    })

    it('should handle errors when updating the isOpenToOffers status', async () => {
      // Set up the current user
      store.currentUser = { ...mockUser }
      
      // Mock the service to throw an error
      const errorMessage = 'Failed to update status'
      mockUpdateUserOpenToOffers.mockRejectedValue(new Error(errorMessage))

      // Call the action and expect it to throw
      await expect(store.updateOpenToOffers(true)).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
    })

    it('should not update if there is no current user', async () => {
      // Ensure there is no current user
      store.currentUser = null
      
      // Call the action
      await store.updateOpenToOffers(true)

      // Verify that the service was not called
      expect(mockUpdateUserOpenToOffers).not.toHaveBeenCalled()
    })
  })
})