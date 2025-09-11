import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'

describe('Neural Network Profile System Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Complete Profile Flow', () => {
    it('should handle complete profile creation workflow', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Step 1: Fill specializations
      store.updateFormField('specializations', 'neuralAssistants', true)
      store.updateFormField('specializations', 'neuralFunnels', true)
      
      // Step 2: Fill superpower
      store.updateFormField('superpower', 'text', 'I create AI assistants that automate business processes and increase conversions by 200%')
      
      // Step 3: Fill abilities
      store.updateFormField('abilities', 'funnelAssembly', true)
      store.updateFormField('abilities', 'personalAIAssistants', true)
      
      // Step 4: Fill contacts
      store.updateFormField('contacts', 'telegram', '@testspecialist')
      store.updateFormField('contacts', 'email', 'specialist@example.com')
      store.updateFormField('contacts', 'website', 'https://aispecialist.com')
      
      // Verify form state
      expect(store.formState.specializations.neuralAssistants).toBe(true)
      expect(store.formState.specializations.neuralFunnels).toBe(true)
      expect(store.formState.superpower).toContain('AI assistants')
      expect(store.formState.abilities.funnelAssembly).toBe(true)
      expect(store.formState.abilities.personalAIAssistants).toBe(true)
      expect(store.formState.contacts.telegram).toBe('@testspecialist')
      expect(store.formState.contacts.email).toBe('specialist@example.com')
      expect(store.formState.contacts.website).toBe('https://aispecialist.com')
      
      // Verify form is dirty
      expect(store.formState.isDirty).toBe(true)
    })

    it('should validate required blocks correctly', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Initially should not be submittable
      expect(store.canSubmitProfile).toBe(false)
      
      // Fill required fields and validate each block
      store.formState.specializations.neuralAssistants = true
      const errors1 = store.validateBlock('1')
      expect(errors1).toHaveLength(0)
      
      store.formState.superpower = 'Valid superpower description with enough characters'
      const errors2 = store.validateBlock('2')
      expect(errors2).toHaveLength(0)
      
      store.formState.abilities.funnelAssembly = true
      const errors3 = store.validateBlock('3')
      expect(errors3).toHaveLength(0)
      
      store.formState.contacts.telegram = '@validuser'
      const errors8 = store.validateBlock('8')
      expect(errors8).toHaveLength(0)
      
      // Now should be submittable after completing required blocks
      store.formState.completedBlocks.add(1)
      store.formState.completedBlocks.add(2)
      store.formState.completedBlocks.add(3)
      store.formState.completedBlocks.add(8)
      
      expect(store.canSubmitProfile).toBe(true)
    })

    it('should calculate completion percentage correctly', () => {
      const store = useNeuralNetworkProfileStore()
      
      expect(store.getCompletionPercentage).toBe(0)
      
      // Complete 4 out of 8 blocks
      store.formState.completedBlocks.add(1)
      store.formState.completedBlocks.add(2)
      store.formState.completedBlocks.add(3)
      store.formState.completedBlocks.add(8)
      
      expect(store.getCompletionPercentage).toBe(50)
      
      // Complete all blocks
      for (let i = 4; i <= 7; i++) {
        store.formState.completedBlocks.add(i)
      }
      
      expect(store.getCompletionPercentage).toBe(100)
    })

    it('should handle optional blocks correctly', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Optional blocks should not prevent submission
      const portfolioErrors = store.validateBlock('4')
      const servicesErrors = store.validateBlock('5')
      const experienceErrors = store.validateBlock('6')
      const testimonialsErrors = store.validateBlock('7')
      
      expect(portfolioErrors).toHaveLength(0)
      expect(servicesErrors).toHaveLength(0)
      expect(experienceErrors).toHaveLength(0)
      expect(testimonialsErrors).toHaveLength(0)
      
      // But data can still be added
      store.formState.portfolio.push({
        id: '1',
        title: 'Test Case',
        description: 'Test portfolio case',
        type: 'text',
        content: 'Successfully automated client processes',
        result: 'Increased efficiency by 50%',
        tools: ['ChatGPT', 'Make.com'],
        createdAt: new Date().toISOString()
      })
      
      expect(store.formState.portfolio).toHaveLength(1)
      expect(store.formState.portfolio[0].title).toBe('Test Case')
    })

    it('should provide correct next incomplete block', () => {
      const store = useNeuralNetworkProfileStore()
      
      expect(store.getNextIncompleteBlock).toBe(1)
      
      store.formState.completedBlocks.add(1)
      expect(store.getNextIncompleteBlock).toBe(2)
      
      store.formState.completedBlocks.add(2)
      store.formState.completedBlocks.add(3)
      expect(store.getNextIncompleteBlock).toBe(4)
      
      // Complete all blocks
      for (let i = 4; i <= 8; i++) {
        store.formState.completedBlocks.add(i)
      }
      
      expect(store.getNextIncompleteBlock).toBeNull()
    })
  })

  describe('Data Validation', () => {
    it('should validate email formats correctly', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Valid emails
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'specialist123@ai-company.io'
      ]
      
      validEmails.forEach(email => {
        store.formState.contacts.email = email
        const errors = store.validateBlock('8')
        const emailErrors = errors.filter(e => e.fieldId === 'email')
        expect(emailErrors).toHaveLength(0)
      })
      
      // Invalid emails
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@domain.com',
        'test..test@domain.com'
      ]
      
      invalidEmails.forEach(email => {
        store.formState.contacts.telegram = '' // Clear required field
        store.formState.contacts.website = undefined
        store.formState.contacts.email = email
        const errors = store.validateBlock('8')
        const hasEmailError = errors.some(e => e.errorMessage.includes('email'))
        expect(hasEmailError).toBe(true)
      })
    })

    it('should validate telegram formats correctly', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Valid telegram handles
      const validTelegrams = [
        '@validuser',
        '@user_123',
        '@specialist_ai_expert'
      ]
      
      validTelegrams.forEach(telegram => {
        store.formState.contacts.telegram = telegram
        const errors = store.validateBlock('8')
        const telegramErrors = errors.filter(e => e.fieldId === 'telegram')
        expect(telegramErrors).toHaveLength(0)
      })
    })

    it('should validate character limits correctly', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Superpower too short
      store.formState.superpower = 'Short'
      let errors = store.validateBlock('2')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('Минимум 10 символов')
      
      // Superpower too long
      store.formState.superpower = 'A'.repeat(201)
      errors = store.validateBlock('2')
      expect(errors).toHaveLength(1)
      expect(errors[0].errorMessage).toContain('Максимум 200 символов')
      
      // Valid superpower
      store.formState.superpower = 'This is a valid superpower description with the right length'
      errors = store.validateBlock('2')
      expect(errors).toHaveLength(0)
    })
  })

  describe('Form Reset and Initialization', () => {
    it('should reset form completely', () => {
      const store = useNeuralNetworkProfileStore()
      
      // Fill some data
      store.formState.specializations.neuralAssistants = true
      store.formState.superpower = 'Test text'
      store.formState.contacts.telegram = '@test'
      store.formState.completedBlocks.add(1)
      store.formState.isDirty = true
      
      // Reset
      store.resetForm()
      
      // Verify everything is reset
      expect(store.formState.specializations.neuralAssistants).toBe(false)
      expect(store.formState.superpower).toBe('')
      expect(store.formState.contacts.telegram).toBe('')
      expect(store.formState.completedBlocks.size).toBe(0)
      expect(store.formState.isDirty).toBe(false)
      expect(store.currentProfile).toBeNull()
    })
  })
})