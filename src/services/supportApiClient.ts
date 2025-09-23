/**
 * Support API Client
 * Extends AuthApiClient to handle support-related operations
 */

import { AuthApiClient } from './authApiClient'
import { CONTENT_TYPES } from './baseApiClient'
import type { 
  FAQ,
  SupportTicket,
  SupportMessage
} from '@/types'

/**
 * Support API Client class
 * Handles support operations with authentication
 */
export class SupportApiClient extends AuthApiClient {
  constructor(baseURL?: string) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const apiBaseURL = baseURL || ''

    // Call AuthApiClient constructor with proper parameters
    super(apiBaseURL)
    
    // Update headers for support API calls
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }


  /**
   * Get all FAQs
   */
  async getFAQs(): Promise<FAQ[]> {
    const response = await this.authenticatedRequest<FAQ[]>('GET', '/api/web/support/faq')
    return response
  }

  /**
   * Get recent support tickets (current user)
   */
  async getSupportTickets(): Promise<SupportTicket[]> {
    return this.authenticatedRequest<SupportTicket[]>('GET', '/api/web/support/tickets')
  }

  /**
   * Create a new support ticket
   */
  async createSupportTicket(message: string): Promise<SupportTicket> {
    return this.authenticatedRequest<SupportTicket>(
      'POST',
      '/api/web/support/tickets',
      { message },
      {
        headers: {
          'Content-Type': CONTENT_TYPES.JSON,
        },
      }
    )
  }

  /**
   * Get a ticket by id
   */
  async getSupportTicketById(ticketId: string): Promise<SupportTicket> {
    return this.authenticatedRequest<SupportTicket>('GET', `/api/web/support/tickets/${ticketId}`)
  }

  /**
   * Add a message to a ticket
   */
  async addSupportMessage(ticketId: string, message: string): Promise<SupportMessage> {
    return this.authenticatedRequest<SupportMessage>(
      'POST',
      `/api/web/support/tickets/${ticketId}/messages`,
      { message },
      {
        headers: {
          'Content-Type': CONTENT_TYPES.JSON,
        },
      }
    )
  }

  /**
   * Resolve a ticket
   */
  async resolveSupportTicket(ticketId: string): Promise<SupportTicket> {
    return this.authenticatedRequest<SupportTicket>(
      'PATCH',
      `/api/web/support/tickets/${ticketId}/resolve`
    )
  }
}

// Create default instance
export const supportApiClient = new SupportApiClient()

// Export convenience functions
export const supportApi = {
  // FAQ operations
  getFAQs: () => supportApiClient.getFAQs(),
  // Tickets
  getSupportTickets: () => supportApiClient.getSupportTickets(),
  createSupportTicket: (message: string) => supportApiClient.createSupportTicket(message),
  getSupportTicketById: (ticketId: string) => supportApiClient.getSupportTicketById(ticketId),
  addSupportMessage: (ticketId: string, message: string) => supportApiClient.addSupportMessage(ticketId, message),
  resolveSupportTicket: (ticketId: string) => supportApiClient.resolveSupportTicket(ticketId),
}

// Export types
export type { 
  FAQ,
  SupportTicket,
  SupportMessage
}
