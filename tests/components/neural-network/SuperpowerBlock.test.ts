import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import SuperpowerBlock from '@/components/profile/neural-network/SuperpowerBlock.vue'
import type { NeuralNetworkFormState } from '@/types/neural-network-profile'

describe('SuperpowerBlock', () => {
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
      currentBlock: 2,
      completedBlocks: new Set(),
      validationErrors: {},
      isDirty: false,
      autoSaveEnabled: true
    }

    wrapper = mount(SuperpowerBlock, {
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
      expect(wrapper.text()).toContain('Блок 2. Коротко о себе')
      expect(wrapper.text()).toContain('Твоя суперспособность или фишка')
      expect(wrapper.text()).toContain('до 200 символов')
    })

    it('should render textarea with correct placeholder', () => {
      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
      expect(textarea.attributes('placeholder')).toContain('Создаю нейроассистентов')
    })

    it('should show character counter', () => {
      expect(wrapper.text()).toContain('0/200')
    })
  })

  describe('text input functionality', () => {
    it('should emit update event when text is entered', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Test superpower description')
      await textarea.trigger('input')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      const updateEvent = wrapper.emitted('update')?.[0]
      expect(updateEvent).toEqual(['superpower', 'text', 'Test superpower description'])
    })

    it('should update character count when text is entered', async () => {
      const testText = 'This is a test superpower description'
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: testText
        }
      })
      
      expect(wrapper.text()).toContain(`${testText.length}/200`)
    })

    it('should reflect text value from props', async () => {
      const testText = 'Test superpower from props'
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: testText
        }
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe(testText)
    })
  })

  describe('character counter', () => {
    it('should show correct character count', async () => {
      const testText = 'Hello World'
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: testText
        }
      })
      
      expect(wrapper.text()).toContain(`${testText.length}/200`)
    })

    it('should show counter bar with correct width', async () => {
      const testText = 'A'.repeat(100) // 50% of 200
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: testText
        }
      })
      
      const counterBar = wrapper.find('.h-2.rounded-full')
      expect(counterBar.attributes('style')).toContain('width: 50%')
    })
  })

  describe('validation', () => {
    it('should show validation error for empty text', async () => {
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Поле обязательно для заполнения')
    })

    it('should show validation error for text too short', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: 'Short'
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Минимум 10 символов')
    })

    it('should show validation error for text too long', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: 'A'.repeat(201)
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Максимум 200 символов')
    })

    it('should show success message for valid text', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: 'This is a valid superpower description with enough characters'
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Отлично! Ваше описание соответствует требованиям')
    })

    it('should emit validate event', async () => {
      wrapper.vm.validateBlock()
      
      expect(wrapper.emitted('validate')).toBeTruthy()
      expect(wrapper.emitted('validate')?.[0]).toEqual(['2'])
    })
  })

  describe('visual feedback', () => {
    it('should apply error styling for invalid input', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: 'Short'
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).toContain('border-red-300')
    })

    it('should apply success styling for valid input', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: 'This is a valid superpower description with enough characters'
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).toContain('border-green-300')
    })

    it('should show correct counter bar color based on character count', async () => {
      // Test different character counts
      const testCases = [
        { text: '', expectedColor: 'bg-gray-300' },
        { text: 'Short', expectedColor: 'bg-red-400' },
        { text: 'This is a valid length text', expectedColor: 'bg-green-400' },
        { text: 'A'.repeat(175), expectedColor: 'bg-yellow-400' },
        { text: 'A'.repeat(195), expectedColor: 'bg-red-400' }
      ]

      for (const testCase of testCases) {
        await wrapper.setProps({
          formState: {
            ...mockFormState,
            superpower: testCase.text
          }
        })
        
        const colorClass = wrapper.vm.getCounterBarColor()
        expect(colorClass).toBe(testCase.expectedColor)
      }
    })
  })

  describe('examples and tips', () => {
    it('should show examples section', () => {
      expect(wrapper.text()).toContain('Примеры хороших описаний')
      expect(wrapper.text()).toContain('Создаю нейроассистентов')
      expect(wrapper.text()).toContain('Помогаю бизнесу автоматизировать')
    })

    it('should show tips section', () => {
      expect(wrapper.text()).toContain('Советы для создания цепляющего описания')
      expect(wrapper.text()).toContain('Укажите конкретный результат')
      expect(wrapper.text()).toContain('Используйте цифры и метрики')
    })
  })

  describe('computed properties', () => {
    it('should calculate character count correctly', async () => {
      const testText = 'Test text with specific length'
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: testText
        }
      })
      
      expect(wrapper.vm.characterCount).toBe(testText.length)
    })

    it('should determine validity correctly', async () => {
      // Invalid - empty
      await wrapper.setProps({
        formState: { ...mockFormState, superpower: '' }
      })
      expect(wrapper.vm.isValid).toBe(false)

      // Invalid - too short
      await wrapper.setProps({
        formState: { ...mockFormState, superpower: 'Short' }
      })
      expect(wrapper.vm.isValid).toBe(false)

      // Invalid - too long
      await wrapper.setProps({
        formState: { ...mockFormState, superpower: 'A'.repeat(201) }
      })
      expect(wrapper.vm.isValid).toBe(false)

      // Valid
      await wrapper.setProps({
        formState: { ...mockFormState, superpower: 'This is a valid description' }
      })
      expect(wrapper.vm.isValid).toBe(true)
    })
  })

  describe('watchers', () => {
    it('should validate when form state changes', async () => {
      const validateSpy = vi.spyOn(wrapper.vm, 'validateBlock')
      
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          superpower: 'New text'
        }
      })
      
      expect(validateSpy).toHaveBeenCalled()
    })
  })
})