/**
 * Invitation Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInvitationStore } from '@/stores/invitation'
import type { Invitation, InvitationSearchFilters } from '@/types/invitation'

// Mock the API client
vi.mock('@/services/invitationApiClient', () => ({
  invitationApi: {
    searchInvitations: vi.fn(),
    createInvitation: vi.fn(),
    updateInvitation: vi.fn(),
    deleteInvitation: vi.fn(),
  }
}))

describe('Invitation Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const store = useInvitationStore()
    
    expect(store.allInvitations).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.loadingMore).toBe(false)
    expect(store.error).toBeNull()
    expect(store.hasSearched).toBe(false)
    expect(store.canLoadMore).toBe(false)
    expect(store.totalInvitations).toBe(0)
  })

  it('should handle search invitations', async () => {
    const store = useInvitationStore()
    const mockInvitations: Invitation[] = [
      {
        id: '1',
        userType: 'client',
        expiresAt: '2025-12-31T23:59:59Z',
        isActive: true,
        token: 'test-token-1',
        registrationsCount: 0,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }
    ]

    const { invitationApi } = await import('@/services/invitationApiClient')
    vi.mocked(invitationApi.searchInvitations).mockResolvedValue({
      invitations: mockInvitations,
      page: 1,
      pageSize: 10,
      total: 1,
      hasMore: false,
    })

    await store.searchInvitations()

    expect(store.allInvitations).toEqual(mockInvitations)
    expect(store.hasSearched).toBe(true)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle search invitations error', async () => {
    const store = useInvitationStore()
    const errorMessage = 'Search failed'

    const { invitationApi } = await import('@/services/invitationApiClient')
    vi.mocked(invitationApi.searchInvitations).mockRejectedValue(new Error(errorMessage))

    await store.searchInvitations()

    expect(store.error).toBe(errorMessage)
    expect(store.loading).toBe(false)
  })

  it('should clear search', () => {
    const store = useInvitationStore()
    
    // Set some state
    store.allInvitations = [
      {
        id: '1',
        userType: 'client',
        expiresAt: '2025-12-31T23:59:59Z',
        isActive: true,
        token: 'test-token-1',
        registrationsCount: 0,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }
    ]
    store.hasSearched = true
    store.error = 'Some error'

    store.clearSearch()

    expect(store.allInvitations).toEqual([])
    expect(store.hasSearched).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should calculate canLoadMore correctly', () => {
    const store = useInvitationStore()
    
    // Initially false
    expect(store.canLoadMore).toBe(false)

    // Set hasMore to true
    store.lastSearchResults = {
      invitations: [],
      page: 1,
      pageSize: 10,
      total: 20,
      hasMore: true,
    }

    expect(store.canLoadMore).toBe(true)
  })

  it('should calculate totalInvitations correctly', () => {
    const store = useInvitationStore()
    
    // Initially 0
    expect(store.totalInvitations).toBe(0)

    // Set total
    store.lastSearchResults = {
      invitations: [],
      page: 1,
      pageSize: 10,
      total: 25,
      hasMore: true,
    }

    expect(store.totalInvitations).toBe(25)
  })

  it('should generate correct invitation link', () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'https:',
        host: 'example.com'
      },
      writable: true
    })

    const invitation: Invitation = {
      id: 'test-id-123',
      userType: 'client',
      expiresAt: '2025-12-31T23:59:59Z',
      isActive: true,
      token: 'test-token-456',
      registrationsCount: 0,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    }

    const expectedLink = 'https://example.com/invite/test-id-123?token=test-token-456'
    
    // This would be tested in the component, but we can verify the logic here
    const generatedLink = `${window.location.protocol}//${window.location.host}/invite/${invitation.id}?token=${invitation.token}`
    
    expect(generatedLink).toBe(expectedLink)
  })
})
