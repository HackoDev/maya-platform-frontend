import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UserProfileSection from '@/components/common/UserProfileSection.vue'
import type { User } from '@/types'

// Mock vue-router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

// Mock user store
const mockUserStore = {
  logout: vi.fn()
}

vi.mock('@/stores/user', () => ({
  useUserStore: () => mockUserStore
}))

const mockUser: User = {
  id: '1',
  name: 'Test User',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'user',
  userType: 'specialist',
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('UserProfileSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user profile with avatar and name', () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    expect(wrapper.find('img[alt="John Doe"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders user initials when no avatar provided', () => {
    const userWithoutAvatar = { ...mockUser, avatar: undefined }
    const wrapper = mount(UserProfileSection, {
      props: { user: userWithoutAvatar }
    })

    expect(wrapper.text()).toContain('JD')
  })

  it('toggles dropdown when profile button is clicked', async () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    const profileButton = wrapper.find('[aria-haspopup="true"]')
    expect(profileButton.attributes('aria-expanded')).toBe('false')
    
    await profileButton.trigger('click')
    await nextTick()
    
    expect(profileButton.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)
  })

  it('renders dropdown menu items correctly', async () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    const profileButton = wrapper.find('[aria-haspopup="true"]')
    await profileButton.trigger('click')
    await nextTick()

    const menuItems = wrapper.findAll('[role="menuitem"]')
    expect(menuItems).toHaveLength(2)
    expect(menuItems[0].text()).toContain('Настройки')
    expect(menuItems[1].text()).toContain('Выход')
  })

  it('navigates to settings page when menu item is clicked', async () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    const profileButton = wrapper.find('[aria-haspopup="true"]')
    await profileButton.trigger('click')
    await nextTick()

    const settingsButton = wrapper.findAll('[role="menuitem"]')[0]
    await settingsButton.trigger('click')
    await nextTick()

    expect(mockRouter.push).toHaveBeenCalledWith('/profile/settings')
  })

  it('logs out user and redirects when logout menu item is clicked', async () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    const profileButton = wrapper.find('[aria-haspopup="true"]')
    await profileButton.trigger('click')
    await nextTick()

    const logoutButton = wrapper.findAll('[role="menuitem"]')[1]
    await logoutButton.trigger('click')
    await nextTick()

    expect(mockUserStore.logout).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })

  it('closes dropdown when clicking outside', async () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser },
      attachTo: document.body
    })

    const profileButton = wrapper.find('[aria-haspopup="true"]')
    await profileButton.trigger('click')
    await nextTick()

    expect(wrapper.find('[role="menu"]').exists()).toBe(true)

    // Simulate clicking outside
    document.dispatchEvent(new Event('click'))
    await nextTick()

    expect(wrapper.find('[role="menu"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('closes dropdown when escape key is pressed', async () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser },
      attachTo: document.body
    })

    const profileButton = wrapper.find('[aria-haspopup="true"]')
    await profileButton.trigger('click')
    await nextTick()

    expect(wrapper.find('[role="menu"]').exists()).toBe(true)

    // Simulate escape key press
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.find('[role="menu"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    const profileButton = wrapper.find('[aria-haspopup="true"]')
    expect(profileButton.attributes('aria-label')).toBe('User profile menu')
    expect(profileButton.attributes('aria-haspopup')).toBe('true')
    expect(profileButton.attributes('aria-expanded')).toBe('false')
  })

  it('displays mobile version correctly', () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    const mobileSection = wrapper.find('.lg\\:hidden')
    expect(mobileSection.exists()).toBe(true)
    expect(mobileSection.text()).toContain('John')
  })

  it('handles user prop changes', async () => {
    const wrapper = mount(UserProfileSection, {
      props: { user: mockUser }
    })

    expect(wrapper.text()).toContain('John Doe')

    const newUser = { ...mockUser, firstName: 'Jane', lastName: 'Smith' }
    await wrapper.setProps({ user: newUser })

    expect(wrapper.text()).toContain('Jane Smith')
  })
})