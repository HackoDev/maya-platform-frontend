import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileViewModal from '@/components/ui/ProfileViewModal.vue'

describe('ProfileViewModal', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockProps = {
    isOpen: true,
    title: 'Test Profile',
    subtitle: 'Test Subtitle',
    size: 'lg' as const,
    backdrop: 'blur' as const,
    showShare: true,
    closable: true
  }

  it('renders nothing when isOpen is false', () => {
    const wrapper = mount(ProfileViewModal, {
      props: {
        ...mockProps,
        isOpen: false
      },
      slots: {
        default: '<div>Modal Content</div>'
      }
    })

    // When isOpen is false, the component should render nothing
    expect(wrapper.text()).toBe('')
  })

  it('emits close event when handleClose is called', async () => {
    const wrapper = mount(ProfileViewModal, {
      props: mockProps,
      slots: {
        default: '<div>Modal Content</div>'
      }
    })

    // Call the handleClose method directly
    await (wrapper.vm as any).handleClose()
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close event when closable is false', async () => {
    const wrapper = mount(ProfileViewModal, {
      props: {
        ...mockProps,
        closable: false
      },
      slots: {
        default: '<div>Modal Content</div>'
      }
    })

    // Call the handleClose method directly
    await (wrapper.vm as any).handleClose()
    
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('emits share event when handleShare is called', async () => {
    const wrapper = mount(ProfileViewModal, {
      props: mockProps,
      slots: {
        default: '<div>Modal Content</div>'
      }
    })

    // Call the handleShare method directly
    await (wrapper.vm as any).handleShare()
    
    expect(wrapper.emitted('share')).toBeTruthy()
  })

  it('applies correct size classes based on size prop', () => {
    const wrapper = mount(ProfileViewModal, {
      props: {
        ...mockProps,
        size: 'full'
      },
      slots: {
        default: '<div>Modal Content</div>'
      }
    })

    // Check that the sizeClasses computed property returns the correct value
    const vm = wrapper.vm as any
    expect(vm.sizeClasses).toContain('w-screen')
    expect(vm.sizeClasses).toContain('h-screen')
  })

  it('applies correct backdrop classes based on backdrop prop', () => {
    const wrapper = mount(ProfileViewModal, {
      props: {
        ...mockProps,
        backdrop: 'dark'
      },
      slots: {
        default: '<div>Modal Content</div>'
      }
    })

    // Check that the backdropClasses computed property returns the correct value
    const vm = wrapper.vm as any
    expect(vm.backdropClasses).toContain('bg-black/75')
  })

  it('manages body scroll when isOpen changes', async () => {
    // Mock document methods
    const mockBodyStyle = { overflow: '', paddingRight: '' }
    Object.defineProperty(document, 'body', {
      value: {
        style: mockBodyStyle,
        appendChild: vi.fn(),
        removeChild: vi.fn()
      },
      writable: true
    })

    const wrapper = mount(ProfileViewModal, {
      props: mockProps,
      slots: {
        default: '<div>Modal Content</div>'
      }
    })

    // Check that body scroll is disabled when modal opens
    expect(mockBodyStyle.overflow).toBe('hidden')

    // Update props to close modal
    await wrapper.setProps({ isOpen: false })
    
    // Check that body scroll is restored when modal closes
    expect(mockBodyStyle.overflow).toBe('')
  })
})