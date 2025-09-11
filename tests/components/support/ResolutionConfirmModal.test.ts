import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResolutionConfirmModal from '@/components/support/ResolutionConfirmModal.vue'

describe('ResolutionConfirmModal', () => {
  const mockTicket = {
    id: 'ticket-123',
    message: 'Test ticket message',
    status: 'open',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    resolvedAt: null,
    assignedTo: 'Support Agent',
    hasUnreadMessages: false,
    messages: []
  }

  it('renders correctly with ticket information', () => {
    const wrapper = mount(ResolutionConfirmModal, {
      props: {
        ticket: mockTicket,
        loading: false
      }
    })

    expect(wrapper.text()).toContain('Подтверждение решения тикета')
    expect(wrapper.text()).toContain(mockTicket.message)
  })

  it('emits confirm event when confirm button is clicked', async () => {
    const wrapper = mount(ResolutionConfirmModal, {
      props: {
        ticket: mockTicket,
        loading: false
      }
    })

    await wrapper.find('button.bg-green-600').trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(ResolutionConfirmModal, {
      props: {
        ticket: mockTicket,
        loading: false
      }
    })

    await wrapper.find('button.dark\\:bg-gray-700').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('disables buttons when loading', async () => {
    const wrapper = mount(ResolutionConfirmModal, {
      props: {
        ticket: mockTicket,
        loading: true
      }
    })

    const confirmButton = wrapper.find('button.bg-green-600')
    const cancelButton = wrapper.find('button.dark\\:bg-gray-700')
    
    expect(confirmButton.attributes('disabled')).toBeDefined()
    expect(cancelButton.attributes('disabled')).toBeDefined()
  })
})