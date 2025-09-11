import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SpecializationsSection from '@/components/profile/SpecializationsSection.vue'
import type { SpecializationsSectionProps } from '@/types/specialist-profile-view'

describe('SpecializationsSection', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mockProps: SpecializationsSectionProps = {
    specializations: [
      'Нейроассистенты (AI-боты)',
      'Нейроворонки (продажи + автоматизация)',
      'Контент с помощью нейросетей'
    ],
    abilities: [
      'Собираю нейроворонки (от лида до оплаты)',
      'Создаю персональных AI-ассистентов',
      'Пишу продающие тексты с ChatGPT'
    ]
  }

  it('renders section titles correctly', () => {
    const wrapper = mount(SpecializationsSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Специализации и навыки')
    expect(wrapper.text()).toContain('Основные специализации')
    expect(wrapper.text()).toContain('Практические навыки')
  })

  it('renders all specializations correctly', () => {
    const wrapper = mount(SpecializationsSection, {
      props: mockProps
    })

    mockProps.specializations.forEach(specialization => {
      expect(wrapper.text()).toContain(specialization)
    })
  })

  it('renders all abilities correctly', () => {
    const wrapper = mount(SpecializationsSection, {
      props: mockProps
    })

    mockProps.abilities.forEach(ability => {
      expect(wrapper.text()).toContain(ability)
    })
  })

  it('renders specialization descriptions', () => {
    const wrapper = mount(SpecializationsSection, {
      props: mockProps
    })

    // Check that descriptions are rendered for known specializations
    expect(wrapper.text()).toContain('Создание умных чат-ботов и виртуальных помощников')
    expect(wrapper.text()).toContain('Автоматизация процессов продаж с помощью ИИ')
  })

  it('renders default description for unknown specializations', () => {
    const propsWithUnknownSpecialization: SpecializationsSectionProps = {
      ...mockProps,
      specializations: [
        'Неизвестная специализация'
      ]
    }

    const wrapper = mount(SpecializationsSection, {
      props: propsWithUnknownSpecialization
    })

    expect(wrapper.text()).toContain('Экспертиза в данной области')
  })

  it('renders specialization cards with correct styling', () => {
    const wrapper = mount(SpecializationsSection, {
      props: mockProps
    })

    const specializationCards = wrapper.findAll('.specialization-card')
    expect(specializationCards.length).toBe(mockProps.specializations.length)
  })

  it('renders ability tags with correct styling', () => {
    const wrapper = mount(SpecializationsSection, {
      props: mockProps
    })

    const abilityTags = wrapper.findAll('.ability-tag')
    expect(abilityTags.length).toBe(mockProps.abilities.length)
  })

  it('renders icons for specializations and abilities', () => {
    const wrapper = mount(SpecializationsSection, {
      props: mockProps
    })

    // Check that icons are present
    const icons = wrapper.findAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })
})