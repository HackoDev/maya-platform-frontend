import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import SpecializationsBlock from '@/components/profile/neural-network/SpecializationsBlock.vue'
import type { NeuralNetworkFormState } from '@/types/neural-network-profile'

describe('SpecializationsBlock', () => {
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
      currentBlock: 1,
      completedBlocks: new Set(),
      validationErrors: {},
      isDirty: false,
      autoSaveEnabled: true
    }

    wrapper = mount(SpecializationsBlock, {
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
      expect(wrapper.text()).toContain('Блок 1. Кто ты?')
      expect(wrapper.text()).toContain('Я специализируюсь на:')
      expect(wrapper.text()).toContain('Выберите области вашей экспертизы')
    })

    it('should render all specialization options', () => {
      expect(wrapper.text()).toContain('Нейроассистенты (AI-боты)')
      expect(wrapper.text()).toContain('Нейроворонки (продажи + автоматизация)')
      expect(wrapper.text()).toContain('Контент с помощью нейросетей')
      expect(wrapper.text()).toContain('Визуалы (обложки, графика, Reels)')
      expect(wrapper.text()).toContain('Обработка аудио и видео')
      expect(wrapper.text()).toContain('Базы промптов')
      expect(wrapper.text()).toContain('Настройка чат-ботов')
      expect(wrapper.text()).toContain('Обучение других нейросетям')
    })
  })

  describe('checkbox interactions', () => {
    it('should emit update event when checkbox is clicked', async () => {
      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.trigger('change')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      const updateEvent = wrapper.emitted('update')?.[0]
      expect(updateEvent).toEqual(['specializations', 'neuralAssistants', true])
    })

    it('should reflect checkbox state from props', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          specializations: {
            ...mockFormState.specializations,
            neuralAssistants: true
          }
        }
      })

      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      const firstCheckbox = checkboxes[0]
      expect(firstCheckbox.element.checked).toBe(true)
    })
  })

  describe('custom specializations', () => {
    it('should show add custom specialization button', () => {
      expect(wrapper.text()).toContain('Добавить специализацию')
    })

    it('should add custom specialization input when button is clicked', async () => {
      const addButton = wrapper.find('button:contains("Добавить специализацию")')
      await addButton.trigger('click')
      
      const customInputs = wrapper.findAll('input[type="text"]')
      expect(customInputs.length).toBeGreaterThan(0)
    })

    it('should emit update when custom specialization is added', async () => {
      const addButton = wrapper.find('button:contains("Добавить специализацию")')
      await addButton.trigger('click')
      
      const customInput = wrapper.find('input[type="text"]')
      await customInput.setValue('Custom AI specialization')
      await customInput.trigger('input')
      
      expect(wrapper.emitted('update')).toBeTruthy()
    })

    it('should remove custom specialization when remove button is clicked', async () => {
      // Add a custom specialization first
      wrapper.vm.customSpecializations = [{ value: 'Test specialization' }]
      await wrapper.vm.$nextTick()
      
      const removeButton = wrapper.find('button svg')?.element.closest('button')
      if (removeButton) {
        await wrapper.trigger('click', { target: removeButton })
        expect(wrapper.vm.customSpecializations).toHaveLength(0)
      }
    })
  })

  describe('validation', () => {
    it('should show validation error when no specializations are selected', async () => {
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Выберите хотя бы одну специализацию')
    })

    it('should emit validate event', async () => {
      wrapper.vm.validateBlock()
      
      expect(wrapper.emitted('validate')).toBeTruthy()
      expect(wrapper.emitted('validate')?.[0]).toEqual(['1'])
    })

    it('should not show error when at least one specialization is selected', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          specializations: {
            ...mockFormState.specializations,
            neuralAssistants: true
          }
        }
      })
      
      wrapper.vm.validateBlock()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).not.toContain('Выберите хотя бы одну специализацию')
    })
  })

  describe('selection counter', () => {
    it('should show correct selection count', () => {
      expect(wrapper.text()).toContain('Выбрано: 0 из 8 возможных')
    })

    it('should update selection count when specializations are selected', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          specializations: {
            ...mockFormState.specializations,
            neuralAssistants: true,
            neuralFunnels: true
          }
        }
      })
      
      expect(wrapper.text()).toContain('Выбрано: 2 из 8 возможных')
    })
  })

  describe('visual feedback', () => {
    it('should apply selected styling to checked specializations', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          specializations: {
            ...mockFormState.specializations,
            neuralAssistants: true
          }
        }
      })
      
      const labels = wrapper.findAll('label')
      const selectedLabel = labels.find(label => 
        label.text().includes('Нейроассистенты')
      )
      
      expect(selectedLabel?.classes()).toContain('bg-blue-50')
    })

    it('should show checkmark for selected items', async () => {
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          specializations: {
            ...mockFormState.specializations,
            neuralAssistants: true
          }
        }
      })
      
      const checkmarks = wrapper.findAll('svg')
      expect(checkmarks.length).toBeGreaterThan(0)
    })
  })

  describe('watchers', () => {
    it('should validate when form state changes', async () => {
      const validateSpy = vi.spyOn(wrapper.vm, 'validateBlock')
      
      await wrapper.setProps({
        formState: {
          ...mockFormState,
          specializations: {
            ...mockFormState.specializations,
            neuralAssistants: true
          }
        }
      })
      
      expect(validateSpy).toHaveBeenCalled()
    })
  })
})