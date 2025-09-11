import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import type { ProfileHeaderProps } from '@/types/specialist-profile-view'

describe('ProfileHeader', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockProps: ProfileHeaderProps = {
    basicInfo: {
      id: 'specialist-1',
      userId: 'user-1',
      displayName: 'Анна Иванова',
      superpower: 'Создаю AI-ассистентов для автоматизации бизнес-процессов',
      status: 'available',
      lastActive: '2024-01-15T10:30:00Z',
      rating: 4.8,
      reviewCount: 24,
      completedProjects: 45,
      responseTime: '< 1 часа'
    },
    contacts: {
      telegram: '@anna_ai_expert',
      email: 'anna@example.com'
    }
  }

  it('renders specialist name and superpower correctly', () => {
    const wrapper = mount(ProfileHeader, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Анна Иванова')
    expect(wrapper.text()).toContain('Создаю AI-ассистентов для автоматизации бизнес-процессов')
  })

  it('renders avatar with initials when no avatar URL provided', () => {
    const wrapper = mount(ProfileHeader, {
      props: mockProps
    })

    const initialsDiv = wrapper.find('div.flex.items-center.justify-center')
    expect(initialsDiv.text()).toBe('АИ')
  })

  it('renders avatar image when avatar URL provided', () => {
    const propsWithAvatar: ProfileHeaderProps = {
      ...mockProps,
      basicInfo: {
        ...mockProps.basicInfo,
        avatarUrl: 'https://example.com/avatar.jpg'
      }
    }

    const wrapper = mount(ProfileHeader, {
      props: propsWithAvatar
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
  })

  it('renders status indicator with correct color', () => {
    const wrapper = mount(ProfileHeader, {
      props: mockProps
    })

    const statusIndicator = wrapper.find('div.bg-green-500')
    expect(statusIndicator.exists()).toBe(true)
  })

  it('renders rating with correct number of stars', () => {
    const wrapper = mount(ProfileHeader, {
      props: mockProps
    })

    const filledStars = wrapper.findAll('svg.text-yellow-400')
    const emptyStars = wrapper.findAll('svg.text-white\\/30')
    
    expect(filledStars.length).toBe(4) // 4.8 rating should show 4 filled stars
    expect(emptyStars.length).toBe(1)  // and 1 empty star
  })

  it('formats last active time correctly', () => {
    const wrapper = mount(ProfileHeader, {
      props: mockProps
    })

    // Should show "активен X мин назад" for recent activity
    expect(wrapper.text()).toContain('активен')
  })

  it('renders contact buttons', () => {
    const wrapper = mount(ProfileHeader, {
      props: mockProps,
      global: {
        stubs: {
          ContactButtons: true
        }
      }
    })

    const contactButtons = wrapper.find('contact-buttons-stub')
    expect(contactButtons.exists()).toBe(true)
  })

  it('shows correct status text for available specialist', () => {
    const wrapper = mount(ProfileHeader, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Доступен для проектов')
  })

  it('shows correct status text for busy specialist', () => {
    const propsBusy: ProfileHeaderProps = {
      ...mockProps,
      basicInfo: {
        ...mockProps.basicInfo,
        status: 'busy'
      }
    }

    const wrapper = mount(ProfileHeader, {
      props: propsBusy
    })

    expect(wrapper.text()).toContain('Занят, ограниченная доступность')
  })

  it('shows correct status text for unavailable specialist', () => {
    const propsUnavailable: ProfileHeaderProps = {
      ...mockProps,
      basicInfo: {
        ...mockProps.basicInfo,
        status: 'unavailable'
      }
    }

    const wrapper = mount(ProfileHeader, {
      props: propsUnavailable
    })

    expect(wrapper.text()).toContain('Не принимает новые проекты')
  })
})