/**
 * Invitation Store
 * Manages invitation state and operations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { invitationApi } from '@/services/invitationApiClient'
import type { 
  Invitation, 
  InvitationSearchFilters, 
  InvitationPaginationResponse 
} from '@/types/invitation'

export const useInvitationStore = defineStore('invitation', () => {
  // State
  const allInvitations = ref<Invitation[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const hasSearched = ref(false)
  const lastSearchResults = ref<InvitationPaginationResponse | null>(null)

  // Getters
  const canLoadMore = computed(() => {
    return lastSearchResults.value?.hasMore ?? false
  })

  const totalInvitations = computed(() => {
    return lastSearchResults.value?.total ?? 0
  })

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const addInvitations = (newInvitations: Invitation[]) => {
    allInvitations.value.push(...newInvitations)
  }

  const setInvitations = (invitations: Invitation[]) => {
    allInvitations.value = invitations
  }

  const updateInvitation = (id: string, updatedInvitation: Partial<Invitation>) => {
    const index = allInvitations.value.findIndex(invitation => invitation.id === id)
    if (index !== -1) {
      allInvitations.value[index] = { ...allInvitations.value[index], ...updatedInvitation }
    }
  }

  const removeInvitation = (id: string) => {
    const index = allInvitations.value.findIndex(invitation => invitation.id === id)
    if (index !== -1) {
      allInvitations.value.splice(index, 1)
    }
  }

  const clearSearch = () => {
    allInvitations.value = []
    hasSearched.value = false
    lastSearchResults.value = null
    error.value = null
  }

  const searchInvitations = async (filters?: InvitationSearchFilters): Promise<void> => {
    try {
      setLoading(true)
      clearError()
      
      const response = await invitationApi.searchInvitations(filters || {limit: 10, offset: 0})
      
      setInvitations(response.invitations)
      lastSearchResults.value = response
      hasSearched.value = true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search invitations'
      setError(errorMessage)
      console.error('Search invitations failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreInvitations = async (): Promise<void> => {
    if (!canLoadMore.value || loadingMore.value) return

    try {
      loadingMore.value = true
      clearError()
      
      const currentOffset = allInvitations.value.length
      const filters: InvitationSearchFilters = {
        limit: lastSearchResults.value?.pageSize || 5,
        offset: currentOffset,
      }

      const response = await invitationApi.searchInvitations(filters)
      
      addInvitations(response.invitations)
      lastSearchResults.value = {
        ...lastSearchResults.value!,
        invitations: [...lastSearchResults.value!.invitations, ...response.invitations],
        hasMore: response.hasMore,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more invitations'
      setError(errorMessage)
      console.error('Load more invitations failed:', err)
    } finally {
      loadingMore.value = false
    }
  }

  const createInvitation = async (invitationData: Partial<Invitation>): Promise<Invitation> => {
    try {
      setLoading(true)
      clearError()
      
      const newInvitation = await invitationApi.createInvitation(invitationData)
      
      // Add to the beginning of the list
      allInvitations.value.unshift(newInvitation)
      
      return newInvitation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invitation'
      setError(errorMessage)
      console.error('Create invitation failed:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshInvitations = async (): Promise<void> => {
    try {
      // Use the same filters as the last search
      const filters: InvitationSearchFilters = {
        limit: lastSearchResults.value?.pageSize || 10,
        offset: 0,
      }
      
      await searchInvitations(filters)
    } catch (err) {
      console.error('Refresh invitations failed:', err)
    }
  }

  const updateInvitationById = async (id: string, invitationData: Partial<Invitation>): Promise<Invitation> => {
    try {
      setLoading(true)
      clearError()
      
      const updatedInvitation = await invitationApi.updateInvitation(id, invitationData)
      
      updateInvitation(id, updatedInvitation)
      
      return updatedInvitation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invitation'
      setError(errorMessage)
      console.error('Update invitation failed:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteInvitationById = async (id: string): Promise<void> => {
    try {
      setLoading(true)
      clearError()
      
      await invitationApi.deleteInvitation(id)
      
      removeInvitation(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invitation'
      setError(errorMessage)
      console.error('Delete invitation failed:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    allInvitations,
    loading,
    loadingMore,
    error,
    hasSearched,
    lastSearchResults,
    
    // Getters
    canLoadMore,
    totalInvitations,
    
    // Actions
    searchInvitations,
    loadMoreInvitations,
    createInvitation,
    updateInvitationById,
    deleteInvitationById,
    refreshInvitations,
    clearSearch,
    setError,
    clearError,
  }
})

