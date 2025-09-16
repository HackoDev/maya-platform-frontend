import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ControlledToggle from '@/components/ui/ControlledToggle.vue'
import type { ControlledToggleProps, ControlledToggleExposed } from '@/components/ui/ControlledToggle.vue'

describe('ControlledToggle', () => {
  let wrapper: VueWrapper<any>

  const defaultProps: ControlledToggleProps = {
    modelValue: false,
    disabled: false,
    confirmationRequired: true,
    srText: 'Toggle setting',
    ariaDescribedby: undefined,
  }

  beforeEach(() => {
    wrapper = mount(ControlledToggle, {
      props: defaultProps,
    })
  })

  describe('Component Rendering', () => {
    it('should render correctly with default props', () => {
      expect(wrapper.find('[role="switch"]').exists()).toBe(true)
      expect(wrapper.find('[aria-checked="false"]').exists()).toBe(true)
      expect(wrapper.find('.bg-gray-300').exists()).toBe(true)
    })

    it('should render with correct aria attributes', () => {
      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.attributes('aria-checked')).toBe('false')
      expect(toggle.find('.sr-only').text()).toBe('Toggle setting')
    })

    it('should render with custom sr-text', async () => {
      await wrapper.setProps({ srText: 'Custom toggle text' })
      expect(wrapper.find('.sr-only').text()).toBe('Custom toggle text')
    })

    it('should render with aria-describedby when provided', async () => {
      await wrapper.setProps({ ariaDescribedby: 'toggle-description' })
      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.attributes('aria-describedby')).toBe('toggle-description')
    })
  })

  describe('Visual State Updates', () => {
    it('should update visual state when modelValue changes', async () => {
      // Initially false
      expect(wrapper.find('.bg-gray-300').exists()).toBe(true)
      expect(wrapper.find('[aria-checked="false"]').exists()).toBe(true)

      // Update to true
      await wrapper.setProps({ modelValue: true })
      expect(wrapper.find('.bg-green-500').exists()).toBe(true)
      expect(wrapper.find('[aria-checked="true"]').exists()).toBe(true)
    })

    it('should show correct icons based on state', async () => {
      // Off state - should show X icon
      const offIcon = wrapper.find('path[d*="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"]')
      expect(offIcon.exists()).toBe(true)

      // On state - should show checkmark icon
      await wrapper.setProps({ modelValue: true })
      const onIcon = wrapper.find('path[d*="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414z"]')
      expect(onIcon.exists()).toBe(true)
    })

    it('should apply disabled styles when disabled', async () => {
      await wrapper.setProps({ disabled: true })
      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.classes()).toContain('disabled:opacity-50')
      expect(toggle.classes()).toContain('disabled:cursor-not-allowed')
    })
  })

  describe('Event Prevention and Handling', () => {
    it('should prevent default click behavior', async () => {
      const mockPreventDefault = vi.fn()
      const mockStopPropagation = vi.fn()

      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click', {
        preventDefault: mockPreventDefault,
        stopPropagation: mockStopPropagation,
      })

      expect(mockPreventDefault).toHaveBeenCalled()
      expect(mockStopPropagation).toHaveBeenCalled()
    })

    it('should emit toggle-requested event with correct value on click', async () => {
      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click')

      expect(wrapper.emitted('toggle-requested')).toBeTruthy()
      expect(wrapper.emitted('toggle-requested')?.[0]).toEqual([true]) // Should emit opposite of current value
    })

    it('should emit toggle-requested with false when current value is true', async () => {
      await wrapper.setProps({ modelValue: true })
      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click')

      expect(wrapper.emitted('toggle-requested')?.[0]).toEqual([false])
    })

    it('should not emit events when disabled', async () => {
      await wrapper.setProps({ disabled: true })
      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click')

      expect(wrapper.emitted('toggle-requested')).toBeFalsy()
    })

    it('should handle space key press', async () => {
      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('keydown', { key: ' ', code: 'Space' })

      expect(wrapper.emitted('toggle-requested')).toBeTruthy()
      expect(wrapper.emitted('toggle-requested')?.[0]).toEqual([true])
    })

    it('should handle enter key press', async () => {
      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('keydown', { key: 'Enter', code: 'Enter' })

      expect(wrapper.emitted('toggle-requested')).toBeTruthy()
      expect(wrapper.emitted('toggle-requested')?.[0]).toEqual([true])
    })
  })

  describe('Confirmation Flow', () => {
    it('should emit toggle-requested when confirmationRequired is true', async () => {
      await wrapper.setProps({ confirmationRequired: true })
      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click')

      expect(wrapper.emitted('toggle-requested')).toBeTruthy()
    })

    it('should update value directly when confirmationRequired is false', async () => {
      await wrapper.setProps({ confirmationRequired: false })
      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click')

      // Should not emit toggle-requested in this case
      expect(wrapper.emitted('toggle-requested')).toBeFalsy()
      // The component should update its internal state directly
      expect(wrapper.find('[aria-checked="true"]').exists()).toBe(true)
    })
  })

  describe('Exposed Methods', () => {
    it('should expose updateValue method', () => {
      const component = wrapper.vm as ControlledToggleExposed
      expect(typeof component.updateValue).toBe('function')
    })

    it('should expose getCurrentValue method', () => {
      const component = wrapper.vm as ControlledToggleExposed
      expect(typeof component.getCurrentValue).toBe('function')
    })

    it('should update value programmatically via updateValue', async () => {
      const component = wrapper.vm as ControlledToggleExposed
      
      // Initial state should be false
      expect(component.getCurrentValue()).toBe(false)
      expect(wrapper.find('[aria-checked="false"]').exists()).toBe(true)

      // Update to true programmatically
      component.updateValue(true)
      await wrapper.vm.$nextTick()

      expect(component.getCurrentValue()).toBe(true)
      expect(wrapper.find('[aria-checked="true"]').exists()).toBe(true)
      expect(wrapper.find('.bg-green-500').exists()).toBe(true)
    })

    it('should return correct current value from getCurrentValue', async () => {
      const component = wrapper.vm as ControlledToggleExposed
      
      expect(component.getCurrentValue()).toBe(false)
      
      await wrapper.setProps({ modelValue: true })
      expect(component.getCurrentValue()).toBe(true)
    })
  })

  describe('Prop Synchronization', () => {
    it('should sync internal state with modelValue prop changes', async () => {
      const component = wrapper.vm as ControlledToggleExposed
      
      expect(component.getCurrentValue()).toBe(false)
      
      await wrapper.setProps({ modelValue: true })
      expect(component.getCurrentValue()).toBe(true)
      
      await wrapper.setProps({ modelValue: false })
      expect(component.getCurrentValue()).toBe(false)
    })

    it('should maintain internal state when programmatically updated', async () => {
      const component = wrapper.vm as ControlledToggleExposed
      
      // Programmatically update
      component.updateValue(true)
      await wrapper.vm.$nextTick()
      
      expect(component.getCurrentValue()).toBe(true)
      expect(wrapper.find('[aria-checked="true"]').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA role', () => {
      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.exists()).toBe(true)
    })

    it('should update aria-checked attribute correctly', async () => {
      let toggle = wrapper.find('[role="switch"]')
      expect(toggle.attributes('aria-checked')).toBe('false')

      await wrapper.setProps({ modelValue: true })
      toggle = wrapper.find('[role="switch"]')
      expect(toggle.attributes('aria-checked')).toBe('true')
    })

    it('should have screen reader text', () => {
      const srText = wrapper.find('.sr-only')
      expect(srText.exists()).toBe(true)
      expect(srText.text()).toBe('Toggle setting')
    })

    it('should have focus styles', () => {
      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.classes()).toContain('focus:outline-none')
      expect(toggle.classes()).toContain('focus:ring-2')
      expect(toggle.classes()).toContain('focus:ring-green-500')
    })
  })

  describe('Error Scenarios', () => {
    it('should handle undefined modelValue gracefully', async () => {
      await wrapper.setProps({ modelValue: undefined })
      // Should not crash and should default to false state
      expect(wrapper.find('[role="switch"]').exists()).toBe(true)
    })

    it('should handle rapid click events', async () => {
      const toggle = wrapper.find('[role="switch"]')
      
      // Simulate rapid clicks
      await toggle.trigger('click')
      await toggle.trigger('click')
      await toggle.trigger('click')

      // Should emit for each click
      expect(wrapper.emitted('toggle-requested')).toHaveLength(3)
    })
  })
})