import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore, type PersonalInfoUpdate, type ContactInfoUpdate, type EmailUpdate, type PasswordChange } from '@/stores/user'
import type { User } from '@/types'

// Mock the user service
const mockUpdateUserOpenToOffers = vi.fn()
const mockGetUserProfile = vi.fn()
const mockUpdatePersonalInfo = vi.fn()
const mockUpdateContactInfo = vi.fn()
const mockUpdateEmail = vi.fn()
const mockChangePassword = vi.fn()

vi.mock('@/services/user', () => ({
  UserService: vi.fn().mockImplementation(() => ({
    updateUserOpenToOffers: mockUpdateUserOpenToOffers,
    getUserProfile: mockGetUserProfile,
    updatePersonalInfo: mockUpdatePersonalInfo,
    updateContactInfo: mockUpdateContactInfo,
    updateEmail: mockUpdateEmail,
    changePassword: mockChangePassword,
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

  describe('updatePersonalInfo', () => {
    it('should update personal information successfully', async () => {
      store.currentUser = { ...mockUser }
      
      const updateData: PersonalInfoUpdate = {
        firstName: 'Jane',
        lastName: 'Smith',
      }
      
      const updatedUser = { ...mockUser, firstName: 'Jane', lastName: 'Smith', name: 'Jane Smith' }
      mockUpdatePersonalInfo.mockResolvedValue(updatedUser)
      
      const result = await store.updatePersonalInfo(updateData)
      
      expect(store.currentUser?.firstName).toBe('Jane')
      expect(store.currentUser?.lastName).toBe('Smith')
      expect(mockUpdatePersonalInfo).toHaveBeenCalledWith(updateData)
      expect(result).toEqual(updatedUser)
    })

    it('should handle personal info update errors', async () => {
      const updateData: PersonalInfoUpdate = {
        firstName: 'Jane',
        lastName: 'Smith',
      }
      
      mockUpdatePersonalInfo.mockRejectedValue(new Error('Update failed'))
      
      await expect(store.updatePersonalInfo(updateData)).rejects.toThrow('Update failed')
      expect(store.error).toBe('Update failed')
    })
  })

  describe('updateContactInfo', () => {
    it('should update contact information successfully', async () => {
      const updateData: ContactInfoUpdate = {
        phone: '+1234567890',
        whatsapp: '+1234567890',
        telegram: '@username',
      }
      
      const result = { success: true }
      mockUpdateContactInfo.mockResolvedValue(result)
      
      const response = await store.updateContactInfo(updateData)
      
      expect(mockUpdateContactInfo).toHaveBeenCalledWith(updateData)
      expect(response).toEqual(result)
    })

    it('should handle contact info update errors', async () => {
      const updateData: ContactInfoUpdate = {
        phone: '+1234567890',
        whatsapp: '',
        telegram: '',
      }
      
      mockUpdateContactInfo.mockRejectedValue(new Error('Contact update failed'))
      
      await expect(store.updateContactInfo(updateData)).rejects.toThrow('Contact update failed')
      expect(store.error).toBe('Contact update failed')
    })
  })

  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      const updateData: EmailUpdate = {
        newEmail: 'new@example.com',
        confirmEmail: 'new@example.com',
      }
      
      const result = { message: 'Email updated', verificationRequired: true }
      mockUpdateEmail.mockResolvedValue(result)
      
      const response = await store.updateEmail(updateData)
      
      expect(mockUpdateEmail).toHaveBeenCalledWith(updateData)
      expect(response).toEqual(result)
    })

    it('should handle email update errors', async () => {
      const updateData: EmailUpdate = {
        newEmail: 'new@example.com',
        confirmEmail: 'new@example.com',
      }
      
      mockUpdateEmail.mockRejectedValue(new Error('Email update failed'))
      
      await expect(store.updateEmail(updateData)).rejects.toThrow('Email update failed')
      expect(store.error).toBe('Email update failed')
    })
  })

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const passwordData: PasswordChange = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }
      
      const result = { message: 'Password changed successfully' }
      mockChangePassword.mockResolvedValue(result)
      
      const response = await store.changePassword(passwordData)
      
      expect(mockChangePassword).toHaveBeenCalledWith(passwordData)
      expect(response).toEqual(result)
    })

    it('should handle password change errors', async () => {
      const passwordData: PasswordChange = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      }
      
      mockChangePassword.mockRejectedValue(new Error('Password change failed'))
      
      await expect(store.changePassword(passwordData)).rejects.toThrow('Password change failed')
      expect(store.error).toBe('Password change failed')
    })
  })
})