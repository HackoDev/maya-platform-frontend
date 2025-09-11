import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ExperienceSection from '@/components/profile/ExperienceSection.vue'
import type { ExperienceSectionProps } from '@/types/specialist-profile-view'

describe('ExperienceSection', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockProps: ExperienceSectionProps = {
    experience: [
      {
        id: 'exp-1',
        client: 'Компания ABC',
        task: 'Разработка AI-ассистента для автоматизации клиентской поддержки',
        tools: ['ChatGPT', 'Node.js', 'MongoDB'],
        result: 'Сокращение времени ответа на 60%, экономия 40%人力成本',
        duration: '3 месяца',
        year: '2023',
        projectType: 'Консультация'
      },
      {
        id: 'exp-2',
        client: 'Стартап XYZ',
        task: 'Создание чат-бота для обработки заказов',
        tools: ['GPT-4', 'Python', 'PostgreSQL'],
        result: 'Увеличение обработки заказов на 50%',
        duration: '2 месяца',
        year: '2023',
        projectType: 'Полный проект'
      }
    ]
  }

  it('renders section title correctly', () => {
    const wrapper = mount(ExperienceSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Опыт работы')
  })

  it('renders all experience entries correctly', () => {
    const wrapper = mount(ExperienceSection, {
      props: mockProps
    })

    mockProps.experience.forEach(exp => {
      expect(wrapper.text()).toContain(exp.client)
      expect(wrapper.text()).toContain(exp.task)
      expect(wrapper.text()).toContain(exp.result)
    })
  })

  it('renders experience cards with correct styling', () => {
    const wrapper = mount(ExperienceSection, {
      props: mockProps
    })

    const experienceCards = wrapper.findAll('.experience-card')
    expect(experienceCards.length).toBe(mockProps.experience.length)
  })

  it('handles empty experience correctly', () => {
    const propsWithEmptyExperience: ExperienceSectionProps = {
      ...mockProps,
      experience: []
    }

    const wrapper = mount(ExperienceSection, {
      props: propsWithEmptyExperience
    })

    // Should not render any experience cards
    const experienceCards = wrapper.findAll('.experience-card')
    expect(experienceCards.length).toBe(0)
  })

  it('renders experience details correctly', () => {
    const wrapper = mount(ExperienceSection, {
      props: mockProps
    })

    // Check first experience entry details
    const firstExp = mockProps.experience[0]
    expect(wrapper.text()).toContain(firstExp.client)
    expect(wrapper.text()).toContain(firstExp.task)
    expect(wrapper.text()).toContain(firstExp.result)
  })
})