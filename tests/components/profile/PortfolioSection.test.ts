import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PortfolioSection from '@/components/profile/PortfolioSection.vue'
import type { PortfolioSectionProps } from '@/types/specialist-profile-view'

describe('PortfolioSection', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockProps: PortfolioSectionProps = {
    portfolio: [
      {
        id: 'case-1',
        title: 'AI-ассистент для e-commerce',
        description: 'Разработка чат-бота для автоматизации консультаций клиентов',
        type: 'bot',
        content: 'https://example.com/bot',
        result: 'Сокращение времени ответа на 70%, увеличение конверсии на 25%',
        tools: ['ChatGPT', 'Node.js'],
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'case-2',
        title: 'Генерация визуалов для соцсетей',
        description: 'Создание контента для Instagram и TikTok с помощью Midjourney',
        type: 'visual',
        content: 'https://example.com/visuals',
        result: 'Увеличение вовлеченности на 40%',
        tools: ['Midjourney', 'Photoshop'],
        createdAt: '2024-01-10T10:30:00Z'
      }
    ],
    specialistName: 'Анна Иванова'
  }

  it('renders section title correctly', () => {
    const wrapper = mount(PortfolioSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Портфолио')
  })

  it('renders all portfolio cases correctly', () => {
    const wrapper = mount(PortfolioSection, {
      props: mockProps
    })

    mockProps.portfolio.forEach(portfolioCase => {
      expect(wrapper.text()).toContain(portfolioCase.title)
      expect(wrapper.text()).toContain(portfolioCase.description)
      expect(wrapper.text()).toContain(portfolioCase.result)
    })
  })

  it('renders portfolio cards with correct styling', () => {
    const wrapper = mount(PortfolioSection, {
      props: mockProps
    })

    const portfolioCards = wrapper.findAll('.portfolio-card')
    expect(portfolioCards.length).toBe(mockProps.portfolio.length)
  })

  it('handles empty portfolio correctly', () => {
    const propsWithEmptyPortfolio: PortfolioSectionProps = {
      ...mockProps,
      portfolio: []
    }

    const wrapper = mount(PortfolioSection, {
      props: propsWithEmptyPortfolio
    })

    // Should not render any portfolio cards
    const portfolioCards = wrapper.findAll('.portfolio-card')
    expect(portfolioCards.length).toBe(0)
  })

  it('renders portfolio case details correctly', () => {
    const wrapper = mount(PortfolioSection, {
      props: mockProps
    })

    // Check first portfolio case details
    const firstCase = mockProps.portfolio[0]
    expect(wrapper.text()).toContain(firstCase.title)
    expect(wrapper.text()).toContain(firstCase.description)
    expect(wrapper.text()).toContain(firstCase.result)
  })
})