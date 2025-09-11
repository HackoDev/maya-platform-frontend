import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TopNavbar from '@/components/common/TopNavbar.vue'

// Mock all child components since they're not relevant for this test
vi.mock('@/components/common/MobileNavigationMenu.vue', () => ({
  default: {
    template: '<div />',
    props: ['isOpen', 'navigationItems', 'user']
  }
}))

vi.mock('@/components/common/UserProfileSection.vue', () => ({
  default: {
    template: '<div />',
    props: ['user']
  }
}))

vi.mock('@/components/icons/MayaLogoIcon.vue', () => ({
  default: {
    template: '<div data-testid="maya-logo-icon" />'
  }
}))

describe('TopNavbar', () => {
  it('renders without errors', () => {
    // Mount with minimal configuration to test basic rendering
    const wrapper = mount(TopNavbar, {
      global: {
        stubs: {
          'router-link': {
            template: '<a href="#"><slot /></a>'
          }
        }
      }
    })
    
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('renders the MayaLogoIcon component', () => {
    const wrapper = mount(TopNavbar, {
      global: {
        stubs: {
          'router-link': {
            template: '<a href="#"><slot /></a>'
          }
        }
      }
    })
    
    // Check that the logo icon is rendered
    expect(wrapper.find('[data-testid="maya-logo-icon"]').exists()).toBe(true)
  })
})
