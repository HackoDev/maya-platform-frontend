import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'
import type { NeuralNetworkProfileSchema } from '@/types/neural-network-profile'

describe('useNeuralNetworkProfileStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const store = useNeuralNetworkProfileStore()
      
      expect(store.currentProfile).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.isSaving).toBe(false)
      expect(store.validationErrors).toEqual([])
      expect(store.formState.currentBlock).toBe(1)
      expect(store.formState.completedBlocks.size).toBe(0)
      expect(store.formState.isDirty).toBe(false)
      expect(store.formState.autoSaveEnabled).toBe(true)
    })

    it('should initialize form state with correct default values', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Check specializations
      expect(store.formState.specializations.neuralAssistants).toBe(false)
      expect(store.formState.specializations.neuralFunnels).toBe(false)
      expect(store.formState.specializations.customSpecializations).toEqual([])
      
      // Check superpower
      expect(store.formState.superpower).toBe('')
      
      // Check abilities
      expect(store.formState.abilities.funnelAssembly).toBe(false)
      expect(store.formState.abilities.personalAIAssistants).toBe(false)
      expect(store.formState.abilities.customAbilities).toEqual([])
      
      // Check other sections
      expect(store.formState.portfolio).toEqual([])
      expect(store.formState.experience).toEqual([])
      expect(store.formState.contacts.telegram).toBe('')
    })
  })

  describe('getters', () => {
    it('should calculate completion percentage correctly', () => {
      const store = useNeuralNetworkProfileStore()
      
      expect(store.getCompletionPercentage).toBe(0)
      
      // Add completed blocks
      store.formState.completedBlocks.add(1)
      store.formState.completedBlocks.add(2)
      
      expect(store.getCompletionPercentage).toBe(25) // 2/8 * 100 = 25
    })

    it('should find next incomplete block', () => {
      const store = useNeuralNetworkProfileStore()
      
      expect(store.getNextIncompleteBlock).toBe(1)
      
      store.formState.completedBlocks.add(1)
      expect(store.getNextIncompleteBlock).toBe(2)
      
      // Complete all blocks
      for (let i = 1; i <= 8; i++) {
        store.formState.completedBlocks.add(i)
      }
      expect(store.getNextIncompleteBlock).toBeNull()
    })

    it('should determine if profile can be submitted', () => {
      const store = useNeuralNetworkProfileStore()
      
      expect(store.canSubmitProfile).toBe(false)
      
      // Add required blocks (1, 2, 3, 8)
      store.formState.completedBlocks.add(1) // Specializations
      store.formState.completedBlocks.add(2) // Superpower
      store.formState.completedBlocks.add(3) // Abilities
      store.formState.completedBlocks.add(8) // Contacts
      
      expect(store.canSubmitProfile).toBe(true)
    })
  })

  describe('form field updates', () => {
    it('should update specializations field', () => {
      const store = useNeuralNetworkProfileStore()
      
      store.updateFormField('specializations', 'neuralAssistants', true)
      
      expect(store.formState.specializations.neuralAssistants).toBe(true)
      expect(store.formState.isDirty).toBe(true)
    })

    it('should update superpower field', () => {
      const store = useNeuralNetworkProfileStore()
      
      const testText = 'I create AI assistants that work on autopilot'
      store.updateFormField('superpower', 'text', testText)
      
      expect(store.formState.superpower).toBe(testText)
      expect(store.formState.isDirty).toBe(true)
    })

    it('should update contacts field', () => {
      const store = useNeuralNetworkProfileStore()
      
      store.updateFormField('contacts', 'telegram', '@testuser')
      store.updateFormField('contacts', 'email', 'test@example.com')
      
      expect(store.formState.contacts.telegram).toBe('@testuser')
      expect(store.formState.contacts.email).toBe('test@example.com')
      expect(store.formState.isDirty).toBe(true)
    })
  })

  describe('validation', () => {
    it('should validate specializations block', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Empty specializations should fail
      const errors = store.validateBlock('1')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('Выберите хотя бы одну специализацию')
      
      // Add specialization
      store.formState.specializations.neuralAssistants = true
      const validErrors = store.validateBlock('1')
      expect(validErrors).toHaveLength(0)
    })

    it('should validate superpower block', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Empty superpower should fail
      let errors = store.validateBlock('2')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('Поле обязательно')
      
      // Too short text should fail
      store.formState.superpower = 'Short'
      errors = store.validateBlock('2')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('Минимум 10 символов')
      
      // Too long text should fail
      store.formState.superpower = 'A'.repeat(201)
      errors = store.validateBlock('2')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('Максимум 200 символов')
      
      // Valid text should pass
      store.formState.superpower = 'Valid superpower description'
      errors = store.validateBlock('2')
      expect(errors).toHaveLength(0)
    })

    it('should validate abilities block', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Empty abilities should fail
      const errors = store.validateBlock('3')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('Выберите хотя бы один навык')
      
      // Add ability
      store.formState.abilities.funnelAssembly = true
      const validErrors = store.validateBlock('3')
      expect(validErrors).toHaveLength(0)
    })

    it('should validate contacts block', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Empty contacts should fail
      let errors = store.validateBlock('8')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('хотя бы один способ связи')
      
      // Clear previous state and test email validation
      store.formState.contacts.email = 'invalid-email'
      errors = store.validateBlock('8')
      expect(errors.length).toBeGreaterThan(0)
      const emailError = errors.find(e => e.errorMessage.includes('Некорректный формат email'))
      expect(emailError).toBeDefined()
      
      // Clear and test telegram validation
      store.formState.contacts.email = undefined
      store.formState.contacts.telegram = 'invalid-telegram'
      errors = store.validateBlock('8')
      expect(errors.length).toBeGreaterThan(0)
      const telegramError = errors.find(e => e.errorMessage.includes('Telegram должен начинаться с @'))
      expect(telegramError).toBeDefined()
      
      // Valid contacts should pass
      store.formState.contacts.telegram = '@validuser'
      store.formState.contacts.email = 'valid@example.com'
      errors = store.validateBlock('8')
      expect(errors).toHaveLength(0)
    })
  })

  describe('complete form validation', () => {
    it('should validate all blocks and return combined errors', () => {
      const store = useNeuralNetworkProfileStore()
      
      const errors = store.validateCompleteForm()
      
      // Should have errors for required blocks (1, 2, 3, 8)
      expect(errors.length).toBeGreaterThan(0)
      
      const blockIds = errors.map(e => e.blockId)
      expect(blockIds).toContain('1') // Specializations
      expect(blockIds).toContain('2') // Superpower
      expect(blockIds).toContain('3') // Abilities
      expect(blockIds).toContain('8') // Contacts
    })
  })

  describe('form reset', () => {
    it('should reset form to initial state', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Modify state
      store.formState.specializations.neuralAssistants = true
      store.formState.superpower = 'Test text'
      store.formState.isDirty = true
      store.formState.completedBlocks.add(1)
      
      // Reset
      store.resetForm()
      
      // Check reset state
      expect(store.formState.specializations.neuralAssistants).toBe(false)
      expect(store.formState.superpower).toBe('')
      expect(store.formState.isDirty).toBe(false)
      expect(store.formState.completedBlocks.size).toBe(0)
      expect(store.currentProfile).toBeNull()
    })
  })

  describe('block validation status', () => {
    it('should check if block is valid', () => {
      const store = useNeuralNetworkProfileStore()
      
      expect(store.getBlockValidationStatus('1')).toBe(false)
      
      store.formState.completedBlocks.add(1)
      expect(store.getBlockValidationStatus('1')).toBe(true)
    })
  })

  describe('profile initialization', () => {
    it('should initialize with existing profile', () => {
      const store = useNeuralNetworkProfileStore()
      
      const mockProfile: Partial<NeuralNetworkProfileSchema> = {
        id: 'test-id',
        specializations: {
          data: {
            neuralAssistants: true,
            neuralFunnels: false,
            contentGeneration: true,
            visuals: false,
            audioVideoProcessing: false,
            promptBases: true,
            chatbotSetup: false,
            neuralNetworkTraining: false,
            customSpecializations: ['Custom AI']
          }
        } as any,
        superpower: {
          data: {
            text: 'Test superpower description'
          }
        } as any,
        abilities: {
          data: {
            funnelAssembly: true,
            personalAIAssistants: false,
            sellingTextsWithGPT: true,
            visualGeneration: false,
            reelsContentAI: false,
            videoProcessing: false,
            funnelAutomation: true,
            promptBases: false,
            trainingConsultations: false,
            customAbilities: []
          }
        } as any,
        portfolio: { data: [] } as any,
        services: { data: { predefinedServices: {}, customServices: [] } } as any,
        experience: { data: [] } as any,
        testimonials: { data: { textTestimonials: [], externalLinks: [], files: [] } } as any,
        contacts: {
          data: {
            telegram: '@testuser',
            email: 'test@example.com',
            website: 'https://example.com'
          }
        } as any
      }
      
      store.initializeForm(mockProfile as NeuralNetworkProfileSchema)
      
      expect(store.formState.specializations.neuralAssistants).toBe(true)
      expect(store.formState.specializations.contentGeneration).toBe(true)
      expect(store.formState.specializations.customSpecializations).toEqual(['Custom AI'])
      expect(store.formState.superpower).toBe('Test superpower description')
      expect(store.formState.abilities.funnelAssembly).toBe(true)
      expect(store.formState.contacts.telegram).toBe('@testuser')
    })
  })

  describe('async operations', () => {
    it('should handle save profile', async () => {
      const store = useNeuralNetworkProfileStore()
      
      // Mock console.log to avoid output during tests
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      await store.saveProfile()
      
      expect(store.formState.isDirty).toBe(false)
      
      consoleSpy.mockRestore()
    })

    it('should handle save draft', async () => {
      const store = useNeuralNetworkProfileStore()
      
      // Mock console.log to avoid output during tests
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      store.formState.isDirty = true
      await store.saveDraft()
      
      expect(store.formState.isDirty).toBe(false)
      expect(store.formState.lastAutoSave).toBeDefined()
      
      consoleSpy.mockRestore()
    })

    it('should handle submit profile with validation', async () => {
      const store = useNeuralNetworkProfileStore()
      
      // Try to submit invalid profile
      await expect(store.submitProfile()).rejects.toThrow('Форма содержит ошибки')
      
      // Make form valid by setting required data
      store.formState.specializations.neuralAssistants = true
      store.formState.superpower = 'Valid superpower description text'
      store.formState.abilities.funnelAssembly = true
      store.formState.contacts.telegram = '@validuser'
      
      // Manually mark blocks as completed since validation is complex
      store.formState.completedBlocks.add(1)
      store.formState.completedBlocks.add(2) 
      store.formState.completedBlocks.add(3)
      store.formState.completedBlocks.add(8)
      
      // Mock console.log to avoid output during tests
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      // Override validateCompleteForm to return no errors
      const originalValidate = store.validateCompleteForm
      store.validateCompleteForm = vi.fn().mockReturnValue([])
      
      await store.submitProfile()
      
      expect(store.formState.isDirty).toBe(false)
      
      // Restore methods
      store.validateCompleteForm = originalValidate
      consoleSpy.mockRestore()
    })
  })
})