import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import SpecialistCard from '@/components/search/SpecialistCard.vue'
import type { SpecialistProfile } from '@/types/specialist-search'

describe('SpecialistCard', () => {
  let pinia: ReturnType<typeof createPinia>
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    // Create a mock router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/specialist/:id', name: 'SpecialistProfile', component: { template: '<div>Profile</div>' } }
      ]
    })
  })

  const mockSpecialist: SpecialistProfile = {
    id: 'specialist-1',
    userId: 'user-1',
    displayName: 'Анна Иванова',
    superpower: 'Создаю AI-ассистентов для автоматизации бизнес-процессов',
    specializations: ['Нейроассистенты (AI-боты)', 'Нейроворонки (продажи + автоматизация)'],
    abilities: ['Собираю нейроворонки (от лида до оплаты)', 'Создаю персональных AI-ассистентов'],
    services: [
      {
        name: 'Нейроассистент под ключ',
        price: 15000,
        priceType: 'fixed'
      }
    ],
    contacts: {
      telegram: '@anna_ai_expert',
      email: 'anna@example.com'
    },
    status: 'available',
    // Use a recent date for testing
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
  }

  it('renders specialist name and superpower correctly', () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      }
    })

    expect(wrapper.text()).toContain('Анна Иванова')
    expect(wrapper.text()).toContain('Создаю AI-ассистентов для автоматизации бизнес-процессов')
  })

  it('renders avatar with initials when no avatar URL provided', () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      }
    })

    const initialsDiv = wrapper.find('div.flex-shrink-0 div')
    expect(initialsDiv.text()).toBe('АИ')
  })

  it('renders avatar image when avatar URL provided', () => {
    const specialistWithAvatar: SpecialistProfile = {
      ...mockSpecialist,
      avatarUrl: 'https://example.com/avatar.jpg'
    }

    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: specialistWithAvatar
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
  })

  it('renders specializations and abilities correctly', () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      }
    })

    expect(wrapper.text()).toContain('Нейроассистенты (AI-боты)')
    expect(wrapper.text()).toContain('Нейроворонки (продажи + автоматизация)')
    expect(wrapper.text()).toContain('Собираю нейроворонки (от лида до оплаты)')
    expect(wrapper.text()).toContain('Создаю персональных AI-ассистентов')
  })

  it('limits display of abilities to first 2 items', () => {
    const specialistWithManyAbilities: SpecialistProfile = {
      ...mockSpecialist,
      abilities: [
        'Собираю нейроворонки (от лида до оплаты)',
        'Создаю персональных AI-ассистентов',
        'Пишу продающие тексты с ChatGPT',
        'Генерирую визуалы в Midjourney/DALLE',
        'Настраиваю Reels-контент с помощью AI'
      ]
    }

    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: specialistWithManyAbilities
      }
    })

    // Should show first 2 abilities
    expect(wrapper.text()).toContain('Собираю нейроворонки (от лида до оплаты)')
    expect(wrapper.text()).toContain('Создаю персональных AI-ассистентов')

    // Should not show more than 2 abilities
    expect(wrapper.text()).not.toContain('Пишу продающие тексты с ChatGPT')
  })

  it('renders services with correct pricing format', () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      }
    })

    expect(wrapper.text()).toContain('Нейроассистент под ключ')
    // Check for the price with non-breaking space
    expect(wrapper.text()).toMatch(/15\s*000\s*₽/)
  })

  it('formats last active time correctly', () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      }
    })

    // Should show "X мин назад" for recent activity
    expect(wrapper.text()).toContain('мин назад')
  })

  it('emits view-profile event when card is clicked', async () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      },
      global: {
        plugins: [router]
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('view-profile')).toBeTruthy()
    expect(wrapper.emitted('view-profile')![0]).toEqual([mockSpecialist])
  })

  it('emits view-profile event when "View Profile" button is clicked', async () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      },
      global: {
        plugins: [router]
      }
    })

    const viewProfileButton = wrapper.find('button')
    await viewProfileButton.trigger('click')

    expect(wrapper.emitted('view-profile')).toBeTruthy()
    expect(wrapper.emitted('view-profile')![0]).toEqual([mockSpecialist])
  })

  it('emits view-profile-modal event when "Quick View" button is clicked', async () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      },
      global: {
        plugins: [router]
      }
    })

    const quickViewButton = wrapper.findAll('button')[1] // Second button should be quick view
    await quickViewButton.trigger('click')

    expect(wrapper.emitted('view-profile-modal')).toBeTruthy()
    expect(wrapper.emitted('view-profile-modal')![0]).toEqual([mockSpecialist])
  })

  it('renders contact buttons with correct size', () => {
    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: mockSpecialist
      },
      global: {
        stubs: {
          ContactButtons: true
        }
      }
    })

    const contactButtons = wrapper.find('contact-buttons-stub')
    expect(contactButtons.exists()).toBe(true)
  })

  it('shows "Show more" indicator when there are more skills than displayed', () => {
    const specialistWithManySkills: SpecialistProfile = {
      ...mockSpecialist,
      specializations: [
        'Нейроассистенты (AI-боты)',
        'Нейроворонки (продажи + автоматизация)',
        'Контент с помощью нейросетей',
        'Визуалы (обложки, графика, Reels)',
        'Обработка аудио и видео'
      ],
      abilities: [
        'Собираю нейроворонки (от лида до оплаты)',
        'Создаю персональных AI-ассистентов',
        'Пишу продающие тексты с ChatGPT'
      ]
    }

    const wrapper = mount(SpecialistCard, {
      props: {
        specialist: specialistWithManySkills
      }
    })

    // Total skills: 5 specializations + 3 abilities = 8
    // Displayed: 5 specializations + 2 abilities = 7
    // Should show "+1 еще"
    expect(wrapper.text()).toContain('еще')
  })
})