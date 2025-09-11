import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FAQ, SupportTicket, SupportStoreState, SupportMessage } from '@/types'
import { 
  mockApiFAQs, 
  mockApiSupportTickets, 
  mockApiSubmitTicket,
  mockApiGetTicket,
  mockApiAddMessage,
  mockApiResolveTicket
} from '@/services/support'

export const useSupportStore = defineStore('support', () => {
  // State
  const faqs = ref<FAQ[]>([])
  const supportTickets = ref<SupportTicket[]>([])
  const currentTicket = ref<SupportTicket | null>(null)
  const expandedFAQs = ref<Set<string>>(new Set())
  
  const loading = ref({
    faqs: false,
    tickets: false,
    submission: false,
    ticket: false,
    messageSubmission: false,
    resolution: false,
  })
  
  const error = ref<string | null>(null)

  // Getters
  const recentTickets = computed(() => 
    supportTickets.value.slice(0, 5)
  )

  const popularFAQs = computed(() => 
    faqs.value.filter(faq => faq.isPopular).sort((a, b) => a.priority - b.priority)
  )

  const openTicketsCount = computed(() => 
    supportTickets.value.filter(ticket => ticket.status === 'open').length
  )

  const inProgressTicketsCount = computed(() => 
    supportTickets.value.filter(ticket => ticket.status === 'in-progress').length
  )

  // Actions
  const fetchFAQs = async (): Promise<void> => {
    try {
      loading.value.faqs = true
      error.value = null
      
      const data = await mockApiFAQs()
      faqs.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch FAQs'
      console.error('Error fetching FAQs:', err)
    } finally {
      loading.value.faqs = false
    }
  }

  const fetchSupportTickets = async (): Promise<void> => {
    try {
      loading.value.tickets = true
      error.value = null
      
      const data = await mockApiSupportTickets()
      supportTickets.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch support tickets'
      console.error('Error fetching support tickets:', err)
    } finally {
      loading.value.tickets = false
    }
  }

  const submitSupportRequest = async (message: string): Promise<void> => {
    try {
      loading.value.submission = true
      error.value = null
      
      const newTicket = await mockApiSubmitTicket(message)
      
      // Add the new ticket to the beginning of the list
      supportTickets.value.unshift(newTicket)
      
      // Update current ticket
      currentTicket.value = newTicket
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit support request'
      console.error('Error submitting support request:', err)
      throw err // Re-throw to handle in component
    } finally {
      loading.value.submission = false
    }
  }

  const toggleFAQ = (faqId: string): void => {
    if (expandedFAQs.value.has(faqId)) {
      expandedFAQs.value.delete(faqId)
    } else {
      expandedFAQs.value.add(faqId)
    }
  }

  const isFAQExpanded = (faqId: string): boolean => {
    return expandedFAQs.value.has(faqId)
  }

  const clearErrors = (): void => {
    error.value = null
  }

  const setCurrentTicket = (ticket: SupportTicket | null): void => {
    currentTicket.value = ticket
  }

  const getTicketsByStatus = (status: SupportTicket['status']): SupportTicket[] => {
    return supportTickets.value.filter(ticket => ticket.status === status)
  }

  const fetchTicket = async (ticketId: string): Promise<void> => {
    try {
      loading.value.ticket = true
      error.value = null
      
      const data = await mockApiGetTicket(ticketId)
      currentTicket.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch ticket'
      console.error('Error fetching ticket:', err)
      throw err
    } finally {
      loading.value.ticket = false
    }
  }

  const addMessage = async (ticketId: string, message: string): Promise<SupportMessage> => {
    try {
      loading.value.messageSubmission = true
      error.value = null
      
      const newMessage = await mockApiAddMessage(ticketId, message)
      
      // Update current ticket if it matches
      if (currentTicket.value && currentTicket.value.id === ticketId) {
        currentTicket.value.messages.push(newMessage)
        currentTicket.value.updatedAt = newMessage.createdAt
      }
      
      // Update ticket in the list if it exists
      const ticketIndex = supportTickets.value.findIndex(t => t.id === ticketId)
      if (ticketIndex !== -1) {
        supportTickets.value[ticketIndex].messages.push(newMessage)
        supportTickets.value[ticketIndex].updatedAt = newMessage.createdAt
      }
      
      return newMessage
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add message'
      console.error('Error adding message:', err)
      throw err
    } finally {
      loading.value.messageSubmission = false
    }
  }

  const resolveTicket = async (ticketId: string): Promise<SupportTicket> => {
    try {
      loading.value.resolution = true
      error.value = null
      
      const updatedTicket = await mockApiResolveTicket(ticketId)
      
      // Update current ticket if it matches
      if (currentTicket.value && currentTicket.value.id === ticketId) {
        currentTicket.value.status = updatedTicket.status
        currentTicket.value.resolvedAt = updatedTicket.resolvedAt
        currentTicket.value.updatedAt = updatedTicket.updatedAt
      }
      
      // Update ticket in the list if it exists
      const ticketIndex = supportTickets.value.findIndex(t => t.id === ticketId)
      if (ticketIndex !== -1) {
        supportTickets.value[ticketIndex].status = updatedTicket.status
        supportTickets.value[ticketIndex].resolvedAt = updatedTicket.resolvedAt
        supportTickets.value[ticketIndex].updatedAt = updatedTicket.updatedAt
      }
      
      return updatedTicket
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to resolve ticket'
      console.error('Error resolving ticket:', err)
      throw err
    } finally {
      loading.value.resolution = false
    }
  }

  // Initialize data on store creation
  const initialize = async (): Promise<void> => {
    await Promise.all([
      fetchFAQs(),
      fetchSupportTickets()
    ])
  }

  return {
    // State
    faqs,
    supportTickets,
    currentTicket,
    expandedFAQs,
    loading,
    error,
    
    // Getters
    recentTickets,
    popularFAQs,
    openTicketsCount,
    inProgressTicketsCount,
    
    // Actions
    fetchFAQs,
    fetchSupportTickets,
    submitSupportRequest,
    toggleFAQ,
    isFAQExpanded,
    clearErrors,
    setCurrentTicket,
    getTicketsByStatus,
    initialize,
    
    // New actions
    fetchTicket,
    addMessage,
    resolveTicket,
  }
})