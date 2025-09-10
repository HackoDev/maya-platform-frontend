import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSupportData } from '@/composables/useSupportData'
import { useSupportStore } from '@/stores/support'

// Mock the support store
vi.mock('@/stores/support', () => ({
  useSupportStore: vi.fn(),
}))

describe('useSupportData Composable', () => {
  let mockStore: any
  
  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Create mock store with all required methods and properties
    mockStore = {
      faqs: [],
      recentTickets: [],
      currentTicket: null,
      popularFAQs: [],
      loading: { faqs: false, tickets: false, submission: false },
      openTicketsCount: 0,
      inProgressTicketsCount: 0,
      error: null,
      fetchFAQs: vi.fn().mockResolvedValue(undefined),
      fetchSupportTickets: vi.fn().mockResolvedValue(undefined),
      submitSupportRequest: vi.fn().mockResolvedValue(undefined),
      toggleFAQ: vi.fn(),
      isFAQExpanded: vi.fn().mockReturnValue(false),
      searchFAQs: vi.fn().mockReturnValue([]),
      getFAQsByCategory: vi.fn().mockReturnValue([]),
      getTicketsByStatus: vi.fn().mockReturnValue([]),
      clearErrors: vi.fn(),
      setCurrentTicket: vi.fn(),
      initialize: vi.fn().mockResolvedValue(undefined),
    }
    
    vi.mocked(useSupportStore).mockReturnValue(mockStore)
  })

  describe('Data Access', () => {
    it('should provide reactive access to store data', () => {
      const { faqs, recentTickets, currentTicket, popularFAQs, loading, error } = useSupportData()

      expect(faqs.value).toEqual(mockStore.faqs)
      expect(recentTickets.value).toEqual(mockStore.recentTickets)
      expect(currentTicket.value).toEqual(mockStore.currentTicket)
      expect(popularFAQs.value).toEqual(mockStore.popularFAQs)
      expect(loading.value).toEqual(mockStore.loading)
      expect(error.value).toEqual(mockStore.error)
    })

    it('should provide reactive access to counts', () => {
      const { openTicketsCount, inProgressTicketsCount } = useSupportData()

      expect(openTicketsCount.value).toBe(mockStore.openTicketsCount)
      expect(inProgressTicketsCount.value).toBe(mockStore.inProgressTicketsCount)
    })
  })

  describe('Actions', () => {
    it('should call store methods for data refresh', async () => {
      const { refreshFAQs, refreshTickets } = useSupportData()

      await refreshFAQs()
      expect(mockStore.fetchFAQs).toHaveBeenCalled()

      await refreshTickets()
      expect(mockStore.fetchSupportTickets).toHaveBeenCalled()
    })

    it('should handle refresh errors', async () => {
      const { refreshFAQs } = useSupportData()
      const error = new Error('Network error')
      mockStore.fetchFAQs.mockRejectedValue(error)

      await expect(refreshFAQs()).rejects.toThrow('Network error')
    })

    describe('submitTicket', () => {
      it('should submit valid ticket', async () => {
        const { submitTicket } = useSupportData()
        const message = 'This is a valid test message that is long enough'

        await submitTicket(message)

        expect(mockStore.submitSupportRequest).toHaveBeenCalledWith(message)
      })

      it('should validate message requirements', async () => {
        const { submitTicket } = useSupportData()

        // Test empty message
        await expect(submitTicket('')).rejects.toThrow('Message is required')
        await expect(submitTicket('   ')).rejects.toThrow('Message is required')

        // Test message too short
        await expect(submitTicket('short')).rejects.toThrow('Message must be at least 10 characters long')

        // Test message too long
        const longMessage = 'a'.repeat(1001)
        await expect(submitTicket(longMessage)).rejects.toThrow('Message must be less than 1000 characters')
      })

      it('should trim message before submission', async () => {
        const { submitTicket } = useSupportData()
        const message = '  This is a valid test message with spaces  '

        await submitTicket(message)

        expect(mockStore.submitSupportRequest).toHaveBeenCalledWith(message.trim())
      })

      it('should handle submission errors', async () => {
        const { submitTicket } = useSupportData()
        const error = new Error('Submission failed')
        mockStore.submitSupportRequest.mockRejectedValue(error)

        await expect(submitTicket('Valid message here')).rejects.toThrow('Submission failed')
      })
    })

    describe('FAQ Management', () => {
      it('should toggle FAQ expansion', () => {
        const { toggleFAQ } = useSupportData()

        toggleFAQ('faq-1')

        expect(mockStore.toggleFAQ).toHaveBeenCalledWith('faq-1')
      })

      it('should check FAQ expansion status', () => {
        const { isFAQExpanded } = useSupportData()
        mockStore.isFAQExpanded.mockReturnValue(true)

        const result = isFAQExpanded('faq-1')

        expect(mockStore.isFAQExpanded).toHaveBeenCalledWith('faq-1')
        expect(result).toBe(true)
      })

      it('should search FAQs', () => {
        const { searchFAQs } = useSupportData()
        const mockResults = [{ id: '1', question: 'Test' }]
        mockStore.searchFAQs.mockReturnValue(mockResults)

        const result = searchFAQs('test query')

        expect(mockStore.searchFAQs).toHaveBeenCalledWith('test query')
        expect(result).toEqual(mockResults)
      })

      it('should filter FAQs by category', () => {
        const { getFAQsByCategory } = useSupportData()
        const mockResults = [{ id: '1', category: 'general' }]
        mockStore.getFAQsByCategory.mockReturnValue(mockResults)

        const result = getFAQsByCategory('general')

        expect(mockStore.getFAQsByCategory).toHaveBeenCalledWith('general')
        expect(result).toEqual(mockResults)
      })
    })

    describe('Ticket Management', () => {
      it('should filter tickets by status', () => {
        const { getTicketsByStatus } = useSupportData()
        const mockResults = [{ id: '1', status: 'open' }]
        mockStore.getTicketsByStatus.mockReturnValue(mockResults)

        const result = getTicketsByStatus('open')

        expect(mockStore.getTicketsByStatus).toHaveBeenCalledWith('open')
        expect(result).toEqual(mockResults)
      })

      it('should set current ticket', () => {
        const { setCurrentTicket } = useSupportData()
        const ticket = { id: '1', message: 'Test ticket' }

        setCurrentTicket(ticket as any)

        expect(mockStore.setCurrentTicket).toHaveBeenCalledWith(ticket)
      })
    })

    describe('Error Management', () => {
      it('should clear errors', () => {
        const { clearErrors } = useSupportData()

        clearErrors()

        expect(mockStore.clearErrors).toHaveBeenCalled()
      })
    })

    describe('Initialization', () => {
      it('should initialize data', async () => {
        const { initialize } = useSupportData()

        await initialize()

        expect(mockStore.initialize).toHaveBeenCalled()
      })

      it('should handle initialization errors', async () => {
        const { initialize } = useSupportData()
        const error = new Error('Initialization failed')
        mockStore.initialize.mockRejectedValue(error)

        await expect(initialize()).rejects.toThrow('Initialization failed')
      })
    })
  })
})