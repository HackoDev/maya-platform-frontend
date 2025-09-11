import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageItem from '@/components/support/MessageItem.vue'

describe('MessageItem', () => {
  it('renders user message with correct styling', () => {
    const userMessage = {
      id: 'msg-1',
      ticketId: 'ticket-123',
      message: 'User message content',
      isFromSupport: false,
      createdAt: '2024-01-15T10:30:00Z',
      author: {
        role: 'user',
      },
    }

    const wrapper = mount(MessageItem, {
      props: {
        message: userMessage,
      },
    })

    // Check that user message has blue background
    expect(wrapper.find('.bg-blue-100').exists()).toBe(true)
    expect(wrapper.text()).toContain('User message content')
    expect(wrapper.text()).toContain('Вы')
  })

  it('renders support message with correct styling', () => {
    const supportMessage = {
      id: 'msg-2',
      ticketId: 'ticket-123',
      message: 'Support message content',
      isFromSupport: true,
      createdAt: '2024-01-15T11:30:00Z',
      author: {
        role: 'support',
      },
    }

    const wrapper = mount(MessageItem, {
      props: {
        message: supportMessage,
      },
    })

    // Check that support message has gray background
    expect(wrapper.find('.bg-gray-100').exists()).toBe(true)
    expect(wrapper.text()).toContain('Support message content')
    expect(wrapper.text()).toContain('Поддержка')
  })
})