import { computed, onMounted } from 'vue'
import { useSupportStore } from '@/stores/support'
import type { FAQ, SupportTicket, SupportMessage } from '@/types'

export interface UseSupportDataReturn {
  // Data
  faqs: ReturnType<typeof computed<FAQ[]>>
  recentTickets: ReturnType<typeof computed<SupportTicket[]>>
  currentTicket: ReturnType<typeof computed<SupportTicket | null>>
  popularFAQs: ReturnType<typeof computed<FAQ[]>>
  
  // Loading states
  loading: ReturnType<typeof computed<{
    faqs: boolean
    tickets: boolean
    submission: boolean
    ticket: boolean
    messageSubmission: boolean
    resolution: boolean
  }>>
  
  // Counts
  openTicketsCount: ReturnType<typeof computed<number>>
  inProgressTicketsCount: ReturnType<typeof computed<number>>
  
  // Error state
  error: ReturnType<typeof computed<string | null>>
  
  // Actions
  refreshFAQs: () => Promise<void>
  refreshTickets: () => Promise<void>
  submitTicket: (message: string) => Promise<void>
  toggleFAQ: (faqId: string) => void
  isFAQExpanded: (faqId: string) => boolean
  searchFAQs: (query: string) => FAQ[]
  getFAQsByCategory: (category: string) => FAQ[]
  getTicketsByStatus: (status: SupportTicket['status']) => SupportTicket[]
  clearErrors: () => void
  setCurrentTicket: (ticket: SupportTicket | null) => void
  initialize: () => Promise<void>
  
  // New actions for ticket dialog
  fetchTicket: (ticketId: string) => Promise<void>
  addMessage: (ticketId: string, message: string) => Promise<SupportMessage>
  resolveTicket: (ticketId: string) => Promise<SupportTicket>
}

/**
 * Composable for managing support data and operations
 * Provides reactive access to FAQs, support tickets, and related functionality
 */
export function useSupportData(): UseSupportDataReturn {
  const supportStore = useSupportStore()

  // Reactive computed properties
  const faqs = computed(() => supportStore.faqs)
  const recentTickets = computed(() => supportStore.recentTickets)
  const currentTicket = computed(() => supportStore.currentTicket)
  const popularFAQs = computed(() => supportStore.popularFAQs)
  const loading = computed(() => supportStore.loading)
  const openTicketsCount = computed(() => supportStore.openTicketsCount)
  const inProgressTicketsCount = computed(() => supportStore.inProgressTicketsCount)
  const error = computed(() => supportStore.error)

  // Actions
  const refreshFAQs = async (): Promise<void> => {
    try {
      await supportStore.fetchFAQs()
    } catch (err) {
      console.error('Failed to refresh FAQs:', err)
      throw err
    }
  }

  const refreshTickets = async (): Promise<void> => {
    try {
      await supportStore.fetchSupportTickets()
    } catch (err) {
      console.error('Failed to refresh tickets:', err)
      throw err
    }
  }

  const submitTicket = async (message: string): Promise<void> => {
    if (!message?.trim()) {
      throw new Error('Message is required')
    }

    if (message.trim().length < 10) {
      throw new Error('Message must be at least 10 characters long')
    }

    if (message.trim().length > 1000) {
      throw new Error('Message must be less than 1000 characters')
    }

    try {
      await supportStore.submitSupportRequest(message.trim())
    } catch (err) {
      console.error('Failed to submit ticket:', err)
      throw err
    }
  }

  const toggleFAQ = (faqId: string): void => {
    supportStore.toggleFAQ(faqId)
  }

  const isFAQExpanded = (faqId: string): boolean => {
    return supportStore.isFAQExpanded(faqId)
  }

  const searchFAQs = (query: string): FAQ[] => {
    return supportStore.searchFAQs(query)
  }

  const getFAQsByCategory = (category: string): FAQ[] => {
    return supportStore.getFAQsByCategory(category)
  }

  const getTicketsByStatus = (status: SupportTicket['status']): SupportTicket[] => {
    return supportStore.getTicketsByStatus(status)
  }

  const clearErrors = (): void => {
    supportStore.clearErrors()
  }

  const setCurrentTicket = (ticket: SupportTicket | null): void => {
    supportStore.setCurrentTicket(ticket)
  }

  const initialize = async (): Promise<void> => {
    try {
      await supportStore.initialize()
    } catch (err) {
      console.error('Failed to initialize support data:', err)
      throw err
    }
  }

  const fetchTicket = async (ticketId: string): Promise<void> => {
    try {
      await supportStore.fetchTicket(ticketId)
    } catch (err) {
      console.error('Failed to fetch ticket:', err)
      throw err
    }
  }

  const addMessage = async (ticketId: string, message: string): Promise<SupportMessage> => {
    if (!message?.trim()) {
      throw new Error('Message is required')
    }

    if (message.trim().length < 5) {
      throw new Error('Message must be at least 5 characters long')
    }

    if (message.trim().length > 1000) {
      throw new Error('Message must be less than 1000 characters')
    }

    try {
      const result = await supportStore.addMessage(ticketId, message.trim())
      return result
    } catch (err) {
      console.error('Failed to add message:', err)
      throw err
    }
  }

  const resolveTicket = async (ticketId: string): Promise<SupportTicket> => {
    try {
      const result = await supportStore.resolveTicket(ticketId)
      return result
    } catch (err) {
      console.error('Failed to resolve ticket:', err)
      throw err
    }
  }

  // Auto-initialize when composable is used
  if (typeof window !== 'undefined') {
    onMounted(() => {
      if (faqs.value.length === 0 && recentTickets.value.length === 0) {
        initialize().catch(err => {
          console.error('Auto-initialization failed:', err)
        })
      }
    })
  }

  return {
    // Data
    faqs,
    recentTickets,
    currentTicket,
    popularFAQs,
    
    // Loading states
    loading,
    
    // Counts
    openTicketsCount,
    inProgressTicketsCount,
    
    // Error state
    error,
    
    // Actions
    refreshFAQs,
    refreshTickets,
    submitTicket,
    toggleFAQ,
    isFAQExpanded,
    searchFAQs,
    getFAQsByCategory,
    getTicketsByStatus,
    clearErrors,
    setCurrentTicket,
    initialize,
    
    // New actions for ticket dialog
    fetchTicket,
    addMessage,
    resolveTicket,
  }
}