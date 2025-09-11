import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ServicesSection from '@/components/profile/ServicesSection.vue'
import type { ServicesSectionProps } from '@/types/specialist-profile-view'

describe('ServicesSection', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockProps: ServicesSectionProps = {
    services: [
      {
        name: 'Нейроассистент под ключ',
        description: 'Полная разработка и внедрение AI-ассистента',
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
      }
    ],
    specialistName: 'Анна Иванова',
    contacts: {
      telegram: '@anna_ai_expert',
      email: 'anna@example.com'
    }
  }

  it('renders section title correctly', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Услуги и цены')
  })

  it('renders all services correctly', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    mockProps.services.forEach(service => {
      expect(wrapper.text()).toContain(service.name)
    })
  })

  it('renders service descriptions when provided', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    // Check that the service with description shows it
    expect(wrapper.text()).toContain('Полная разработка и внедрение AI-ассистента')
  })

  it('formats fixed price correctly', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    expect(wrapper.text()).toMatch(/15\s*000\s*₽/)
  })

  it('formats hourly price correctly', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    expect(wrapper.text()).toMatch(/2\s*000\s*₽\/час/)
  })

  it('formats negotiable price correctly', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('от 5000')
  })

  it('renders service cards with correct styling', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    const serviceCards = wrapper.findAll('.service-card')
    expect(serviceCards.length).toBe(mockProps.services.length)
  })

  it('handles string prices correctly', () => {
    const wrapper = mount(ServicesSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('от 5000')
  })
})