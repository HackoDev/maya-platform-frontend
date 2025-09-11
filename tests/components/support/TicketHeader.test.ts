import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TicketHeader from '@/components/support/TicketHeader.vue'

describe('TicketHeader', () => {
  const mockTicket = {
    id: 'ticket-123',
    message: 'Test ticket message',
    status: 'open',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    hasUnreadMessages: false,
    messages: [],
  }

  it('renders ticket ID correctly', () => {
    const wrapper = mount(TicketHeader, {
      props: {
        ticket: mockTicket,
      },
    })

    expect(wrapper.text()).toContain('Тикет #123')
  })

  it('displays correct status badge', () => {
    const wrapper = mount(TicketHeader, {
      props: {
        ticket: mockTicket,
      },
    })

    expect(wrapper.find('.bg-blue-100').exists()).toBe(true)
    expect(wrapper.text()).toContain('Открыт')
  })

  it('shows ticket message', () => {
    const wrapper = mount(TicketHeader, {
      props: {
        ticket: mockTicket,
      },
    })

    expect(wrapper.text()).toContain('Test ticket message')
  })
})