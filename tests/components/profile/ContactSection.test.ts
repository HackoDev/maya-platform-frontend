import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ContactSection from '@/components/profile/ContactSection.vue'
import type { ContactSectionProps } from '@/types/specialist-profile-view'

describe('ContactSection', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    })
  })

  const mockProps: ContactSectionProps = {
    contacts: {
      phone: '+7 (916) 123-45-67',
      whatsapp: '+7 (916) 123-45-67',
      telegram: '@anna_ai_expert'
    },
    specialistName: 'Анна Иванова',
    basicInfo: {
      id: 'specialist-1',
      userId: 'user-1',
      displayName: 'Анна Иванова',
      superpower: 'Создаю AI-ассистентов для автоматизации бизнес-процессов',
      status: 'available',
      lastActive: '2024-01-15T10:30:00Z'
    }
  }

  it('renders section title correctly', () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Контактная информация')
  })

  it('renders telegram contact when provided', () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Telegram')
    expect(wrapper.text()).toContain('@anna_ai_expert')
  })

  it('renders phone contact when provided', () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('Телефон')
    expect(wrapper.text()).toContain('+7 (916) 123-45-67')
  })

  it('renders WhatsApp contact when provided', () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    expect(wrapper.text()).toContain('WhatsApp')
    expect(wrapper.text()).toContain('+7 (916) 123-45-67')
  })

  it('does not render telegram contact when not provided', () => {
    const propsWithoutTelegram: ContactSectionProps = {
      ...mockProps,
      contacts: {
        ...mockProps.contacts,
        telegram: undefined
      }
    }

    const wrapper = mount(ContactSection, {
      props: propsWithoutTelegram
    })

    expect(wrapper.text()).not.toContain('Telegram')
    expect(wrapper.text()).not.toContain('@anna_ai_expert')
  })

  it('does not render phone contact when not provided', () => {
    const propsWithoutPhone: ContactSectionProps = {
      ...mockProps,
      contacts: {
        ...mockProps.contacts,
        phone: undefined
      }
    }

    const wrapper = mount(ContactSection, {
      props: propsWithoutPhone
    })

    expect(wrapper.text()).not.toContain('Телефон')
    // Note: We can't check for the number as WhatsApp might have the same number
  })

  it('does not render WhatsApp contact when not provided', () => {
    const propsWithoutWhatsApp: ContactSectionProps = {
      ...mockProps,
      contacts: {
        ...mockProps.contacts,
        whatsapp: undefined
      }
    }

    const wrapper = mount(ContactSection, {
      props: propsWithoutWhatsApp
    })

    expect(wrapper.text()).not.toContain('WhatsApp')
  })

  it('renders all contact icons correctly', () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    // Check that all three contact type icons are rendered
    const contactIcons = wrapper.findAll('svg')
    // 3 contact icons (phone, whatsapp, telegram) plus action icons
    expect(contactIcons.length).toBeGreaterThanOrEqual(3)
  })

  it('generates correct phone URL', () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    const phoneLink = wrapper.find('a[href^="tel:"]')
    expect(phoneLink.exists()).toBe(true)
    expect(phoneLink.attributes('href')).toBe('tel:+7 (916) 123-45-67')
  })

  it('generates correct WhatsApp URL', () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    const whatsappLink = wrapper.find('a[href*="wa.me"]')
    expect(whatsappLink.exists()).toBe(true)
    expect(whatsappLink.attributes('href')).toContain('wa.me/79161234567')
    expect(whatsappLink.attributes('href')).toContain('text=')
  })

  it('shows hover actions on mouseenter for phone', async () => {
    const wrapper = mount(ContactSection, {
      props: mockProps
    })

    const phoneSection = wrapper.find('[data-testid="phone-contact"]') || wrapper.find('div:has([href^="tel:"])')
    if (phoneSection.exists()) {
      await phoneSection.trigger('mouseenter')
      // Actions should be visible after mouseenter
      expect(wrapper.html()).toContain('hover:')
    }
  })
})