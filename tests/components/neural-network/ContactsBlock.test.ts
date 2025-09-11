import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ContactsBlock from '@/components/profile/neural-network/ContactsBlock.vue'
import type { NeuralNetworkFormState } from '@/types/neural-network-profile'

describe('ContactsBlock', () => {
  let wrapper: VueWrapper
  let mockFormState: NeuralNetworkFormState

  beforeEach(() => {
    mockFormState = {
      specializations: {
        neuralAssistants: false,
        neuralFunnels: false,
        contentGeneration: false,
        visuals: false,
        audioVideoProcessing: false,
        promptBases: false,
        chatbotSetup: false,
        neuralNetworkTraining: false,
        customSpecializations: []
      },
      superpower: '',
      abilities: {
        funnelAssembly: false,
        personalAIAssistants: false,
        sellingTextsWithGPT: false,
        visualGeneration: false,
        reelsContentAI: false,
        videoProcessing: false,
        funnelAutomation: false,
        promptBases: false,
        trainingConsultations: false,
        customAbilities: []
      },
      portfolio: [],
      services: {
        predefinedServices: {
          neuralAssistantTurnkey: { selected: false, name: '', basePrice: 0 },
          neuralSalesFunnel: { selected: false, name: '', basePrice: 0 },
          promptBase: { selected: false, name: '', basePrice: 0 },
          trainingConsultation: { selected: false, name: '', basePrice: 0 }
        },
        customServices: []
      },
      experience: [],
      testimonials: {
        textTestimonials: [],
        externalLinks: [],
        files: []
      },
      contacts: {
        telegram: '',
        email: undefined,
        website: undefined,
        phone: undefined,
        whatsapp: undefined,
        discord: undefined,
        linkedin: undefined
      },
      currentBlock: 8,
      completedBlocks: new Set(),
      validationErrors: {},
      isDirty: false,
      autoSaveEnabled: true
    }

    wrapper = mount(ContactsBlock, {
      props: {
        formState: mockFormState
      }
    })
  })

  describe('component rendering', () => {
    it('should render without crashing', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should display correct title and description', () => {
      expect(wrapper.text()).toContain('Блок 8. Как тебе можно написать?')
      expect(wrapper.text()).toContain('Способы связи')
      expect(wrapper.text()).toContain('Telegram, Email или Сайт')
    })

    it('should render required contact fields', () => {
      expect(wrapper.find('input[placeholder="username"]').exists()).toBe(true) // Telegram
      expect(wrapper.find('input[type="email"]').exists()).toBe(true) // Email
      expect(wrapper.find('input[type="url"]').exists()).toBe(true) // Website
    })

    it('should render optional contact fields', () => {
      expect(wrapper.find('input[type="tel"]').exists()).toBe(true) // Phone
      expect(wrapper.text()).toContain('WhatsApp')
      expect(wrapper.text()).toContain('Discord')
      expect(wrapper.text()).toContain('LinkedIn')
    })
  })

  describe('telegram input handling', () => {
    it('should emit update event when telegram is entered', async () => {
      const telegramInput = wrapper.find('input[placeholder="username"]')
      await telegramInput.setValue('testuser')
      await telegramInput.trigger('input')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      const updateEvent = wrapper.emitted('update')?.[0]
      expect(updateEvent).toEqual(['contacts', 'telegram', '@testuser'])
    })

    it('should add @ prefix if not present', async () => {
      const telegramInput = wrapper.find('input[placeholder="username"]')
      await telegramInput.setValue('testuser')
      await telegramInput.trigger('input')
      
      const updateEvents = wrapper.emitted('update') as any[]
      const telegramUpdate = updateEvents.find(event => event[1] === 'telegram')
      expect(telegramUpdate[2]).toBe('@testuser')
    })

    it('should not duplicate @ prefix', async () => {
      const telegramInput = wrapper.find('input[placeholder="username"]')
      await telegramInput.setValue('@@testuser')
      await telegramInput.trigger('input')
      
      const updateEvents = wrapper.emitted('update') as any[]
      const telegramUpdate = updateEvents.find(event => event[1] === 'telegram')
      expect(telegramUpdate[2]).toBe('@testuser')
    })
  })

  describe('contact field updates', () => {
    it('should emit update for email field', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      await emailInput.setValue('test@example.com')
      await emailInput.trigger('input')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      const updateEvents = wrapper.emitted('update') as any[]
      const emailUpdate = updateEvents.find(event => event[1] === 'email')
      expect(emailUpdate[2]).toBe('test@example.com')
    })

    it('should emit update for website field', async () => {
      const websiteInput = wrapper.find('input[placeholder="https://your-website.com"]')
      await websiteInput.setValue('https://example.com')
      await websiteInput.trigger('input')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      const updateEvents = wrapper.emitted('update') as any[]
      const websiteUpdate = updateEvents.find(event => event[1] === 'website')
      expect(websiteUpdate[2]).toBe('https://example.com')
    })

    it('should handle optional fields correctly', async () => {
      const phoneInput = wrapper.find('input[placeholder="+7 (999) 123-45-67"]')
      await phoneInput.setValue('+7 123 456 7890')
      await phoneInput.trigger('input')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      const updateEvents = wrapper.emitted('update') as any[]
      const phoneUpdate = updateEvents.find(event => event[1] === 'phone')
      expect(phoneUpdate[2]).toBe('+7 123 456 7890')
    })
  })

  describe('validation', () => {
    it('should show validation error when no required contacts are provided', async () => {
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Укажите хотя бы один способ связи')
    })

    it('should validate telegram format', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: 'invalid-telegram'
          }
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Telegram должен начинаться с @')
    })

    it('should validate email format', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            email: 'invalid-email'
          }
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Некорректный формат email')
    })

    it('should validate website format', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            website: 'invalid-url'
          }
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Некорректный формат URL')
    })

    it('should pass validation with valid contacts', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: '@validuser',
            email: 'valid@example.com',
            website: 'https://example.com'
          }
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      // Should not show validation errors
      expect(wrapper.text()).not.toContain('Укажите хотя бы один способ связи')
      expect(wrapper.text()).not.toContain('Некорректный формат')
    })

    it('should emit validate event', async () => {
      wrapper.vm.validateBlock()
      
      expect(wrapper.emitted('validate')).toBeTruthy()
      expect(wrapper.emitted('validate')?.[0]).toEqual(['8'])
    })
  })

  describe('computed properties', () => {
    it('should count contacts correctly', async () => {
      expect(wrapper.vm.contactsCount).toBe(0)
      
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: '@user',
            email: 'test@example.com'
          }
        }
      })
      
      expect(wrapper.vm.contactsCount).toBe(2)
    })

    it('should detect if required contact exists', async () => {
      expect(wrapper.vm.hasRequiredContact).toBe(false)
      
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: '@user'
          }
        }
      })
      
      expect(wrapper.vm.hasRequiredContact).toBe(true)
    })
  })

  describe('validation helper functions', () => {
    it('should validate telegram format correctly', () => {
      expect(wrapper.vm.isValidTelegram('@validuser')).toBe(true)
      expect(wrapper.vm.isValidTelegram('@valid_user123')).toBe(true)
      expect(wrapper.vm.isValidTelegram('invalid')).toBe(false)
      expect(wrapper.vm.isValidTelegram('@a')).toBe(false) // Too short
      expect(wrapper.vm.isValidTelegram('@' + 'a'.repeat(33))).toBe(false) // Too long
    })

    it('should validate email format correctly', () => {
      expect(wrapper.vm.isValidEmail('test@example.com')).toBe(true)
      expect(wrapper.vm.isValidEmail('user.name+tag@example.co.uk')).toBe(true)
      expect(wrapper.vm.isValidEmail('invalid-email')).toBe(false)
      expect(wrapper.vm.isValidEmail('test@')).toBe(false)
      expect(wrapper.vm.isValidEmail('@example.com')).toBe(false)
    })

    it('should validate URL format correctly', () => {
      expect(wrapper.vm.isValidUrl('https://example.com')).toBe(true)
      expect(wrapper.vm.isValidUrl('http://example.com')).toBe(true)
      expect(wrapper.vm.isValidUrl('https://sub.example.com/path')).toBe(true)
      expect(wrapper.vm.isValidUrl('invalid-url')).toBe(false)
      expect(wrapper.vm.isValidUrl('example.com')).toBe(false)
    })
  })

  describe('visual feedback', () => {
    it('should apply error styling to invalid fields', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: 'invalid',
            email: 'invalid-email'
          }
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      const inputs = wrapper.findAll('input')
      const telegramInput = inputs.find(input => input.element.value === 'invalid')
      const emailInput = inputs.find(input => input.element.value === 'invalid-email')
      
      expect(telegramInput?.classes()).toContain('border-red-300')
      expect(emailInput?.classes()).toContain('border-red-300')
    })

    it('should apply success styling to valid fields', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: '@validuser',
            email: 'valid@example.com'
          }
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      const inputs = wrapper.findAll('input')
      const telegramInput = inputs.find(input => input.element.value === '@validuser')
      const emailInput = inputs.find(input => input.element.value === 'valid@example.com')
      
      expect(telegramInput?.classes()).toContain('border-green-300')
      expect(emailInput?.classes()).toContain('border-green-300')
    })
  })

  describe('contact summary', () => {
    it('should show contact summary', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: '@user',
            email: 'test@example.com'
          }
        }
      })
      
      expect(wrapper.text()).toContain('Указано способов связи: 2')
      expect(wrapper.text()).toContain('Есть обязательный способ связи')
    })

    it('should show warning when no required contacts', () => {
      expect(wrapper.text()).toContain('Нужен хотя бы один основной способ связи')
    })
  })

  describe('tips section', () => {
    it('should show contact recommendations', () => {
      expect(wrapper.text()).toContain('Рекомендации по контактам')
      expect(wrapper.text()).toContain('Telegram — самый популярный способ')
      expect(wrapper.text()).toContain('Email — подходит для официального общения')
      expect(wrapper.text()).toContain('Сайт/Портфолио — показывает профессионализм')
    })
  })

  describe('watchers', () => {
    it('should validate when form state changes', async () => {
      const validateSpy = vi.spyOn(wrapper.vm, 'validateBlock')
      
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          contacts: {
            ...mockFormState.contacts,
            telegram: '@newuser'
          }
        }
      })
      
      expect(validateSpy).toHaveBeenCalled()
    })
  })
})