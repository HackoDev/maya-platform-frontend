import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MobileNavigationMenu from '@/components/common/MobileNavigationMenu.vue'
import type { NavigationItem, User } from '@/types'

// Mock vue-router
const mockRouter = {
  push: vi.fn()
}

const mockRoute = {
  path: '/dashboard'
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRoute
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
  role: 'user',
  userType: 'specialist',
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

const mockNavigationItems: NavigationItem[] = [
  {
    id: '1',
    label: 'Главная',
    route: '/dashboard',
    requiresAuth: true,
    visible: true
  },
  {
    id: '2',
    label: 'Профиль',
    route: '/profile',
    requiresAuth: true,
    visible: true
  },
  {
    id: '3',
    label: 'Поддержка',
    route: '/support',
    requiresAuth: false,
    visible: true
  }
]

describe('MobileNavigationMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders menu overlay when open', () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    expect(wrapper.find('.fixed.inset-0.z-40').exists()).toBe(true)
    expect(wrapper.find('.fixed.top-0.left-0.z-50').exists()).toBe(true)
  })

  it('does not render menu when closed', () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: false,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    expect(wrapper.find('.fixed.inset-0.z-40').exists()).toBe(false)
    expect(wrapper.find('.fixed.top-0.left-0.z-50').exists()).toBe(false)
  })

  it('renders navigation items correctly', () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    mockNavigationItems.forEach(item => {
      expect(wrapper.text()).toContain(item.label)
    })
  })

  it('emits close event when overlay is clicked', async () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    const overlay = wrapper.find('.fixed.inset-0.z-40')
    await overlay.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    const closeButton = wrapper.find('button')
    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders simplified logout section without user info', () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    // Should not contain user profile information
    expect(wrapper.text()).not.toContain('John Doe')
    expect(wrapper.text()).not.toContain('Специалист')
    
    // Should contain only logout button
    const logoutButton = wrapper.find('button[class*="text-red-600"]')
    expect(logoutButton.exists()).toBe(true)
    expect(logoutButton.text()).toContain('Выйти')
  })

  it('handles logout correctly', async () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    const logoutButton = wrapper.find('button[class*="text-red-600"]')
    await logoutButton.trigger('click')

    expect(mockUserStore.logout).toHaveBeenCalled()
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })

  it('highlights active route correctly', () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    // Find the active navigation item (dashboard in this case)
    const activeItem = wrapper.find('[class*="text-blue-600"]')
    expect(activeItem.exists()).toBe(true)
  })

  it('closes menu when navigation item is clicked', async () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    const navigationLink = wrapper.find('router-link')
    await navigationLink.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('handles empty navigation items gracefully', () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: [],
        user: mockUser
      }
    })

    expect(wrapper.find('.py-4').exists()).toBe(true)
    expect(wrapper.findAll('router-link')).toHaveLength(0)
  })

  it('renders menu header correctly', () => {
    const wrapper = mount(MobileNavigationMenu, {
      props: {
        isOpen: true,
        navigationItems: mockNavigationItems,
        user: mockUser
      }
    })

    expect(wrapper.text()).toContain('Меню')
    expect(wrapper.find('button').exists()).toBe(true) // Close button
  })
})