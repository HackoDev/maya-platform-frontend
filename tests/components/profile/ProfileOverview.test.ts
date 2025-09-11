import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileOverview from '@/components/profile/ProfileOverview.vue'
import type { ProfileOverviewProps } from '@/types/specialist-profile-view'

describe('ProfileOverview', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockProps: ProfileOverviewProps = {
    basicInfo: {
      id: 'specialist-1',
      userId: 'user-1',
      displayName: 'Анна Иванова',
      superpower: 'Создаю AI-ассистентов для автоматизации бизнес-процессов',
      status: 'available',
      lastActive: '2024-01-15T10:30:00Z'
    },
    specializations: [
      'Нейроассистенты (AI-боты)',
      'Нейроворонки (продажи + автоматизация)',
      'Контент с помощью нейросетей',
      'Визуалы (обложки, графика, Reels)'
    ],
    abilities: [
      'Собираю нейроворонки (от лида до оплаты)',
      'Создаю персональных AI-ассистентов',
      'Пишу продающие тексты с ChatGPT',
      'Генерирую визуалы в Midjourney/DALLE',
      'Настраиваю Reels-контент с помощью AI'
    ],
    services: [
      {
        name: 'Нейроассистент под ключ',
        price: 15000,
        priceType: 'fixed',
        isCustom: false
      },
      {
        name: 'Консультация по AI',
        price: 2000,
        priceType: 'hourly',
        isCustom: false
      },
      {
        name: 'Настройка чат-ботов',
        price: 'от 5000',
        priceType: 'negotiable',
        isCustom: true
      },
      {
        name: 'Обучение/консультации',
        price: 3000,
        priceType: 'hourly',
        isCustom: false,
        description: 'Индивидуальные занятия по работе с нейросетями'
      }
    ]
  }

  it('renders quick stats correctly', () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    // Check specialization count
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('Специализаций')

    // Check abilities count
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('Навыков')

    // Check services count
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('Услуг')
  })

  it('renders top specializations and abilities', () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    // Should show first 3 specializations by default
    expect(wrapper.text()).toContain('Нейроассистенты (AI-боты)')
    expect(wrapper.text()).toContain('Нейроворонки (продажи + автоматизация)')
    expect(wrapper.text()).toContain('Контент с помощью нейросетей')

    // Should show first 4 abilities by default
    expect(wrapper.text()).toContain('Собираю нейроворонки (от лида до оплаты)')
    expect(wrapper.text()).toContain('Создаю персональных AI-ассистентов')
    expect(wrapper.text()).toContain('Пишу продающие тексты с ChatGPT')
    expect(wrapper.text()).toContain('Генерирую визуалы в Midjourney/DALLE')
  })

  it('shows "Show More" button when there are more skills', async () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    const showMoreButton = wrapper.find('button')
    expect(showMoreButton.exists()).toBe(true)
    expect(showMoreButton.text()).toContain('еще')
  })

  it('toggles all skills when "Show More" button is clicked', async () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    const showMoreButton = wrapper.find('button')
    await showMoreButton.trigger('click')

    // Should now show all specializations and abilities
    expect(wrapper.text()).toContain('Визуалы (обложки, графика, Reels)')
    expect(wrapper.text()).toContain('Настраиваю Reels-контент с помощью AI')
  })

  it('renders services with correct pricing format', () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    // Check fixed price formatting
    expect(wrapper.text()).toMatch(/15\s*000\s*₽/)

    // Check hourly price formatting
    expect(wrapper.text()).toMatch(/2\s*000\s*₽\/час/)

    // Check negotiable price formatting
    expect(wrapper.text()).toContain('от 5000')
  })

  it('shows "Show More" button for services when there are more than 3', async () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    const showMoreButton = wrapper.findAll('button').find(btn => btn.text().includes('Показать еще'))
    expect(showMoreButton).toBeDefined()
  })

  it('formats prices correctly for different price types', () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    // Fixed price
    expect(wrapper.text()).toMatch(/15\s*000\s*₽/)

    // Hourly price
    expect(wrapper.text()).toMatch(/2\s*000\s*₽\/час/)

    // Negotiable price
    expect(wrapper.text()).toContain('от 5000')
  })

  it('renders quick action buttons', () => {
    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Посмотреть услуги')
    expect(wrapper.text()).toContain('Портфолио')
    expect(wrapper.text()).toContain('Связаться')
  })

  it('scrolls to section when quick action button is clicked', async () => {
    // Mock document.getElementById and scrollIntoView
    const mockElement = { scrollIntoView: vi.fn() }
    const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any)

    const wrapper = mount(ProfileOverview, {
      props: mockProps
    })

    const servicesButton = wrapper.findAll('button').find(btn => btn.text().includes('Посмотреть услуги'))
    await servicesButton!.trigger('click')

    expect(getElementByIdSpy).toHaveBeenCalledWith('services')
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })

    getElementByIdSpy.mockRestore()
  })
})