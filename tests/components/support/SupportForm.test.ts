import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SupportForm from '@/components/support/SupportForm.vue'

describe('SupportForm Component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(SupportForm, {
      props: {
        visible: false,
        loading: false,
        error: null,
      },
    })
  })

  describe('Visibility Toggle', () => {
    it('should show toggle button', () => {
      const toggleButton = wrapper.find('button[aria-expanded]')
      expect(toggleButton.exists()).toBe(true)
      expect(toggleButton.text()).toContain('Задать вопрос')
    })

    it('should emit toggle event when button clicked', async () => {
      const toggleButton = wrapper.find('button[aria-expanded]')
      
      await toggleButton.trigger('click')
      
      expect(wrapper.emitted().toggle).toBeTruthy()
      expect(wrapper.emitted().toggle).toHaveLength(1)
    })

    it('should change button text when visible', async () => {
      await wrapper.setProps({ visible: true })
      
      const toggleButton = wrapper.find('button[aria-expanded]')
      expect(toggleButton.text()).toContain('Скрыть форму')
    })

    it('should show form when visible is true', async () => {
      await wrapper.setProps({ visible: true })
      
      const form = wrapper.find('#support-form')
      expect(form.isVisible()).toBe(true)
    })

    it('should hide form when visible is false', () => {
      const form = wrapper.find('#support-form')
      expect(form.isVisible()).toBe(false)
    })
  })

  describe('Form Validation', () => {
    beforeEach(async () => {
      await wrapper.setProps({ visible: true })
    })

    it('should validate required message field', async () => {
      const form = wrapper.find('form')
      const textarea = wrapper.find('#support-message')
      const submitButton = wrapper.find('button[type=\"submit\"]')

      // Submit without message
      await form.trigger('submit')
      
      expect(wrapper.emitted().submit).toBeFalsy()
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should validate minimum message length', async () => {
      const textarea = wrapper.find('#support-message')
      
      await textarea.setValue('short')
      await textarea.trigger('blur')
      
      expect(wrapper.text()).toContain('Сообщение должно содержать минимум 10 символов')
    })

    it('should validate maximum message length', async () => {
      const textarea = wrapper.find('#support-message')
      const longMessage = 'a'.repeat(1001)
      
      await textarea.setValue(longMessage)
      await textarea.trigger('blur')
      
      expect(wrapper.text()).toContain('Сообщение не должно превышать 1000 символов')
    })

    it('should show character count', async () => {
      const textarea = wrapper.find('#support-message')
      
      await textarea.setValue('Hello')
      
      expect(wrapper.text()).toContain('5/1000 символов')
    })

    it('should enable submit button when form is valid', async () => {
      const textarea = wrapper.find('#support-message')
      const submitButton = wrapper.find('button[type=\"submit\"]')
      
      await textarea.setValue('This is a valid message that is long enough')
      
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })

    it('should clear validation error when user types', async () => {
      const textarea = wrapper.find('#support-message')
      
      // Trigger validation error
      await textarea.setValue('short')
      await textarea.trigger('blur')
      expect(wrapper.text()).toContain('Сообщение должно содержать минимум 10 символов')
      
      // Clear error by typing
      await textarea.setValue('This is now a longer message')
      expect(wrapper.text()).not.toContain('Сообщение должно содержать минимум 10 символов')
    })
  })

  describe('Form Submission', () => {
    beforeEach(async () => {
      await wrapper.setProps({ visible: true })
    })

    it('should emit submit event with message', async () => {
      const form = wrapper.find('form')
      const textarea = wrapper.find('#support-message')
      const message = 'This is a valid support message'
      
      await textarea.setValue(message)
      await form.trigger('submit')
      
      expect(wrapper.emitted().submit).toBeTruthy()
      expect(wrapper.emitted().submit[0]).toEqual([message])
    })

    it('should trim message before submission', async () => {
      const form = wrapper.find('form')
      const textarea = wrapper.find('#support-message')
      const message = '  This is a valid support message  '
      
      await textarea.setValue(message)
      await form.trigger('submit')
      
      expect(wrapper.emitted().submit[0]).toEqual([message.trim()])
    })

    it('should show loading state during submission', async () => {
      await wrapper.setProps({ loading: true })
      
      const submitButton = wrapper.find('button[type=\"submit\"]')
      expect(submitButton.text()).toContain('Отправка...')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should show success message after submission', async () => {
      const form = wrapper.find('form')
      const textarea = wrapper.find('#support-message')
      
      await textarea.setValue('Valid message here')
      await form.trigger('submit')
      
      // Simulate successful submission by checking for success state
      await wrapper.vm.$nextTick()
      
      // Check if form was reset
      expect(textarea.element.value).toBe('')
    })

    it('should not submit invalid form', async () => {
      const form = wrapper.find('form')
      const textarea = wrapper.find('#support-message')
      
      await textarea.setValue('short')
      await form.trigger('submit')
      
      expect(wrapper.emitted().submit).toBeFalsy()
    })
  })

  describe('Error Handling', () => {
    beforeEach(async () => {
      await wrapper.setProps({ visible: true })
    })

    it('should display error message when error prop is set', async () => {
      const errorMessage = 'Submission failed'
      await wrapper.setProps({ error: errorMessage })
      
      expect(wrapper.text()).toContain('Ошибка отправки')
      expect(wrapper.text()).toContain(errorMessage)
    })

    it('should hide success message when error occurs', async () => {
      // First simulate success
      await wrapper.vm.$nextTick()
      wrapper.vm.showSuccessMessage = true
      await wrapper.vm.$nextTick()
      
      // Then set error
      await wrapper.setProps({ error: 'Some error' })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.showSuccessMessage).toBe(false)
    })
  })

  describe('Form Actions', () => {
    beforeEach(async () => {
      await wrapper.setProps({ visible: true })
    })

    it('should emit cancel event when cancel button clicked', async () => {
      const cancelButton = wrapper.find('button:not([type=\"submit\"]):not([aria-expanded])')
      
      await cancelButton.trigger('click')
      
      expect(wrapper.emitted().cancel).toBeTruthy()
    })

    it('should reset form when cancelled', async () => {
      const textarea = wrapper.find('#support-message')
      const cancelButton = wrapper.find('button:not([type=\"submit\"]):not([aria-expanded])')
      
      await textarea.setValue('Some message')
      await cancelButton.trigger('click')
      
      expect(textarea.element.value).toBe('')
    })
  })

  describe('Tips Section', () => {
    beforeEach(async () => {
      await wrapper.setProps({ visible: true })
    })

    it('should display helpful tips', () => {
      expect(wrapper.text()).toContain('Советы для быстрого решения:')
      expect(wrapper.text()).toContain('Опишите проблему максимально подробно')
      expect(wrapper.text()).toContain('Укажите, какие действия вы уже предпринимали')
      expect(wrapper.text()).toContain('Приложите скриншоты, если это поможет')
      expect(wrapper.text()).toContain('Укажите браузер и устройство, если проблема техническая')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for form toggle', () => {
      const toggleButton = wrapper.find('button[aria-expanded]')
      expect(toggleButton.attributes('aria-expanded')).toBe('false')
      expect(toggleButton.attributes('aria-controls')).toBe('support-form')
    })

    it('should update aria-expanded when visibility changes', async () => {
      const toggleButton = wrapper.find('button[aria-expanded]')
      
      await wrapper.setProps({ visible: true })
      expect(toggleButton.attributes('aria-expanded')).toBe('true')
    })

    it('should have proper labelling for form elements', async () => {
      await wrapper.setProps({ visible: true })
      
      const textarea = wrapper.find('#support-message')
      const label = wrapper.find('label[for=\"support-message\"]')
      
      expect(label.exists()).toBe(true)
      expect(label.text()).toContain('Сообщение')
      expect(textarea.attributes('id')).toBe('support-message')
    })

    it('should have proper region labelling', async () => {
      await wrapper.setProps({ visible: true })
      
      const formRegion = wrapper.find('#support-form')
      expect(formRegion.attributes('role')).toBe('region')
      expect(formRegion.attributes('aria-labelledby')).toBe('support-form-title')
    })
  })

  describe('Success Message', () => {
    beforeEach(async () => {
      await wrapper.setProps({ visible: true })
    })

    it('should show success message after successful submission', async () => {
      // Simulate successful submission
      wrapper.vm.showSuccessMessage = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Сообщение отправлено!')
      expect(wrapper.text()).toContain('Ваше обращение получено. Мы ответим в течение 24 часов.')
    })

    it('should hide success message when form is hidden', async () => {
      wrapper.vm.showSuccessMessage = true
      await wrapper.vm.$nextTick()
      
      await wrapper.setProps({ visible: false })
      
      expect(wrapper.vm.showSuccessMessage).toBe(false)
    })
  })
})