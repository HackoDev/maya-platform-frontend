/**
 * Support module types
 * Defines interfaces for support-related functionality
 */

// FAQ interface (matches the API response exactly)
export interface FAQ {
  id: string
  question: string
  answer: string
}

// Simplified FAQ interface for redesigned components (same as FAQ now)
export interface SimplifiedFAQ {
  id: string
  question: string
  answer: string
}

export interface SupportMessage {
  id: string
  ticketId: string
  message: string
  isFromSupport: boolean
  createdAt: string
  author: {
    role: 'user' | 'support' | 'admin'
  }
}

export interface SupportTicket {
  id: string
  message: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  assignedTo?: string
  hasUnreadMessages: boolean
  messages: SupportMessage[]
}

export interface SupportFormData {
  message: string
}

// Support store interfaces
export interface SupportStoreState {
  faqs: FAQ[]
  supportTickets: SupportTicket[]
  currentTicket: SupportTicket | null
  expandedFAQs: Set<string>
  loading: {
    faqs: boolean
    tickets: boolean
    submission: boolean
    ticket: boolean
    messageSubmission: boolean
    resolution: boolean
  }
  error: string | null
}

export interface SupportStoreActions {
  fetchFAQs(): Promise<void>
  fetchSupportTickets(): Promise<void>
  submitSupportRequest(message: string): Promise<void>
  toggleFAQ(faqId: string): void
  clearErrors(): void
  setCurrentTicket(ticket: SupportTicket | null): void
  
  // New actions
  fetchTicket(ticketId: string): Promise<void>
  addMessage(ticketId: string, message: string): Promise<SupportMessage>
  resolveTicket(ticketId: string): Promise<SupportTicket>
}
