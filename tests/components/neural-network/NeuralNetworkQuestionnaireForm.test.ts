import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NeuralNetworkQuestionnaireForm from '@/components/profile/NeuralNetworkQuestionnaireForm.vue'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'

// Mock the block components
vi.mock('@/components/profile/neural-network/SpecializationsBlock.vue', () => ({
  default: {
    name: 'SpecializationsBlock',
    template: '<div data-testid="specializations-block">Specializations Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

vi.mock('@/components/profile/neural-network/SuperpowerBlock.vue', () => ({
  default: {
    name: 'SuperpowerBlock',
    template: '<div data-testid="superpower-block">Superpower Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

vi.mock('@/components/profile/neural-network/AbilitiesBlock.vue', () => ({
  default: {
    name: 'AbilitiesBlock',
    template: '<div data-testid="abilities-block">Abilities Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

vi.mock('@/components/profile/neural-network/PortfolioBlock.vue', () => ({
  default: {
    name: 'PortfolioBlock',
    template: '<div data-testid="portfolio-block">Portfolio Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

vi.mock('@/components/profile/neural-network/ServicesBlock.vue', () => ({
  default: {
    name: 'ServicesBlock',
    template: '<div data-testid="services-block">Services Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

vi.mock('@/components/profile/neural-network/ExperienceBlock.vue', () => ({
  default: {
    name: 'ExperienceBlock',
    template: '<div data-testid="experience-block">Experience Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

vi.mock('@/components/profile/neural-network/TestimonialsBlock.vue', () => ({
  default: {
    name: 'TestimonialsBlock',
    template: '<div data-testid="testimonials-block">Testimonials Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

vi.mock('@/components/profile/neural-network/ContactsBlock.vue', () => ({
  default: {
    name: 'ContactsBlock',
    template: '<div data-testid="contacts-block">Contacts Block</div>',
    props: ['formState'],
    emits: ['update', 'validate']
  }
}))

describe('NeuralNetworkQuestionnaireForm', () => {
  let wrapper: VueWrapper
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = mount(NeuralNetworkQuestionnaireForm, {
      global: {
        plugins: [pinia]
      }
    })
  })

  describe('component initialization', () => {
    it('should render without crashing', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.neural-network-questionnaire-form').exists()).toBe(true)
    })

    it('should display the correct title', () => {
      expect(wrapper.find('h1').text()).toContain('Анкета нейросетевого специалиста')
    })

    it('should show progress bar', () => {
      const progressBar = wrapper.find('.bg-blue-600')
      expect(progressBar.exists()).toBe(true)
    })

    it('should render block navigation buttons', () => {
      const navButtons = wrapper.findAll('button')
      const blockButtons = navButtons.filter(button => 
        button.text().includes('1.') || 
        button.text().includes('2.') || 
        button.text().includes('8.')
      )
      expect(blockButtons.length).toBeGreaterThan(0)
    })
  })

  describe('block navigation', () => {
    it('should start with block 1 (Specializations)', () => {
      expect(wrapper.find('[data-testid="specializations-block"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="superpower-block"]').exists()).toBe(false)
    })

    it('should switch to different blocks when navigation buttons are clicked', async () => {
      // Find and click block 2 button
      const blockButtons = wrapper.findAll('button')
      const block2Button = blockButtons.find(button => button.text().includes('2.'))
      
      if (block2Button) {
        await block2Button.trigger('click')
        await wrapper.vm.$nextTick()
        
        expect(wrapper.find('[data-testid="specializations-block"]').exists()).toBe(false)
        expect(wrapper.find('[data-testid="superpower-block"]').exists()).toBe(true)
      }
    })

    it('should show "Назад" button when not on first block', async () => {
      // Navigate to block 2
      wrapper.vm.currentBlock = 2
      await wrapper.vm.$nextTick()
      
      const backButton = wrapper.find('button:contains("Назад")')
      expect(backButton.exists()).toBe(true)
      expect(backButton.attributes('disabled')).toBeFalsy()
    })

    it('should disable "Назад" button on first block', () => {
      wrapper.vm.currentBlock = 1
      const backButton = wrapper.find('button')
      const backButtons = wrapper.findAll('button').filter(btn => btn.text().includes('Назад'))
      
      if (backButtons.length > 0) {
        expect(backButtons[0].attributes('disabled')).toBeDefined()
      }
    })
  })

  describe('progress tracking', () => {
    it('should show completion percentage', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Mock some completed blocks
      store.formState.completedBlocks.add(1)
      store.formState.completedBlocks.add(2)
      
      expect(wrapper.text()).toContain('% завершено')
    })

    it('should show completed blocks with checkmarks', async () => {
      const store = useNeuralNetworkProfileStore()
      store.formState.completedBlocks.add(1)
      
      await wrapper.vm.$nextTick()
      
      // Check if completed block has different styling or checkmark
      const blockButtons = wrapper.findAll('button')
      const completedButtons = blockButtons.filter(btn => 
        btn.classes().includes('bg-green-100') || btn.text().includes('✓')
      )
      
      expect(completedButtons.length).toBeGreaterThan(0)
    })
  })

  describe('form actions', () => {
    it('should show save draft button when form is dirty', async () => {
      const store = useNeuralNetworkProfileStore()
      store.formState.isDirty = true
      
      await wrapper.vm.$nextTick()
      
      const saveButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Сохранить черновик')
      )
      expect(saveButton?.exists()).toBe(true)
    })

    it('should show submit button on last block when form is valid', async () => {
      const store = useNeuralNetworkProfileStore()
      
      // Set to last block and make form submittable
      wrapper.vm.currentBlock = 8
      store.formState.completedBlocks.add(1)
      store.formState.completedBlocks.add(2)
      store.formState.completedBlocks.add(3)
      store.formState.completedBlocks.add(8)
      
      await wrapper.vm.$nextTick()
      
      const submitButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Отправить на проверку')
      )
      expect(submitButton?.exists()).toBe(true)
    })

    it('should handle save draft action', async () => {
      const store = useNeuralNetworkProfileStore()
      const saveDraftSpy = vi.spyOn(store, 'saveDraft').mockResolvedValue()
      
      store.formState.isDirty = true
      await wrapper.vm.$nextTick()
      
      const saveButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Сохранить черновик')
      )
      
      if (saveButton) {
        await saveButton.trigger('click')
        expect(saveDraftSpy).toHaveBeenCalled()
      }
      
      saveDraftSpy.mockRestore()
    })
  })

  describe('form event handling', () => {
    it('should handle form field updates', () => {
      const store = useNeuralNetworkProfileStore()
      const updateFieldSpy = vi.spyOn(store, 'updateFormField')
      
      wrapper.vm.handleFormUpdate('specializations', 'neuralAssistants', true)
      
      expect(updateFieldSpy).toHaveBeenCalledWith('specializations', 'neuralAssistants', true)
      
      updateFieldSpy.mockRestore()
    })

    it('should handle block validation', () => {
      const store = useNeuralNetworkProfileStore()
      const validateBlockSpy = vi.spyOn(store, 'validateBlock')
      
      wrapper.vm.handleBlockValidation('1')
      
      expect(validateBlockSpy).toHaveBeenCalledWith('1')
      
      validateBlockSpy.mockRestore()
    })
  })

  describe('validation errors display', () => {
    it('should show validation errors when present', async () => {
      const store = useNeuralNetworkProfileStore()
      
      // Add some validation errors
      store.validationErrors = [
        {
          blockId: '1',
          fieldId: 'specializations',
          errorMessage: 'Выберите хотя бы одну специализацию',
          errorType: 'required'
        }
      ]
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Необходимо исправить ошибки')
      expect(wrapper.text()).toContain('Выберите хотя бы одну специализацию')
    })
  })

  describe('auto-save functionality', () => {
    it('should show last auto-save timestamp when available', async () => {
      const store = useNeuralNetworkProfileStore()
      
      store.formState.lastAutoSave = new Date().toISOString()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Последнее автосохранение')
    })
  })

  describe('utility functions', () => {
    it('should format date correctly', () => {
      const testDate = '2023-12-01T10:30:00.000Z'
      const formatted = wrapper.vm.formatDateTime(testDate)
      
      expect(formatted).toMatch(/\d{2}\.\d{2}\.\d{4}/)
      expect(formatted).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('navigation methods', () => {
    it('should handle previous block navigation', async () => {
      wrapper.vm.currentBlock = 3
      
      wrapper.vm.previousBlock()
      
      expect(wrapper.vm.currentBlock).toBe(2)
    })

    it('should not go below block 1', () => {
      wrapper.vm.currentBlock = 1
      
      wrapper.vm.previousBlock()
      
      expect(wrapper.vm.currentBlock).toBe(1)
    })

    it('should handle next block navigation with validation', () => {
      const store = useNeuralNetworkProfileStore()
      const validateBlockSpy = vi.spyOn(store, 'validateBlock').mockReturnValue([])
      
      wrapper.vm.currentBlock = 1
      wrapper.vm.nextBlock()
      
      expect(validateBlockSpy).toHaveBeenCalledWith('1')
      expect(wrapper.vm.currentBlock).toBe(2)
      
      validateBlockSpy.mockRestore()
    })

    it('should not advance to next block if validation fails', () => {
      const store = useNeuralNetworkProfileStore()
      const validateBlockSpy = vi.spyOn(store, 'validateBlock').mockReturnValue([
        { blockId: '1', fieldId: 'test', errorMessage: 'Error', errorType: 'required' }
      ])
      
      wrapper.vm.currentBlock = 1
      wrapper.vm.nextBlock()
      
      expect(wrapper.vm.currentBlock).toBe(1) // Should stay on same block
      
      validateBlockSpy.mockRestore()
    })
  })
})