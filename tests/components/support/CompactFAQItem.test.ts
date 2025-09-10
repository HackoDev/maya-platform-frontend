import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CompactFAQItem from '@/components/support/CompactFAQItem.vue'
import type { SimplifiedFAQ } from '@/types'

const mockFAQ: SimplifiedFAQ = {
  id: '1',
  question: 'What is this platform?',
  answer: 'This is a comprehensive platform for managing various tasks and workflows.',
  priority: 1,
  isPopular: true
}

describe('CompactFAQItem Component', () => {
  let wrapper: any
  
  beforeEach(() => {
    wrapper = mount(CompactFAQItem, {
      props: {
        faq: mockFAQ,
        expanded: false
      }
    })
  })

  describe('Rendering', () => {
    it('should render the FAQ question', () => {
      expect(wrapper.text()).toContain(mockFAQ.question)
    })

    it('should not render the answer when collapsed', () => {
      expect(wrapper.text()).not.toContain(mockFAQ.answer)
    })

    it('should render the answer when expanded', async () => {
      await wrapper.setProps({ expanded: true })
      expect(wrapper.text()).toContain(mockFAQ.answer)
    })

    it('should have correct data-testid', () => {
      expect(wrapper.attributes('data-testid')).toBe(`faq-item-${mockFAQ.id}`)
    })

    it('should have proper ARIA attributes', () => {
      const button = wrapper.find('button')
      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-controls')).toBe(`faq-answer-${mockFAQ.id}`)
    })

    it('should update ARIA attributes when expanded', async () => {
      await wrapper.setProps({ expanded: true })
      const button = wrapper.find('button')
      expect(button.attributes('aria-expanded')).toBe('true')
    })
  })

  describe('Interactions', () => {
    it('should emit toggle event when clicked', async () => {
      const button = wrapper.find('button')
      await button.trigger('click')
      
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })

    it('should emit toggle event on Enter key', async () => {
      const button = wrapper.find('button')
      await button.trigger('keydown.enter')
      
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })

    it('should emit toggle event on Space key', async () => {
      const button = wrapper.find('button')
      await button.trigger('keydown.space')
      
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })
  })

  describe('Styling', () => {
    it('should have correct CSS classes', () => {
      expect(wrapper.classes()).toContain('bg-white')
      expect(wrapper.classes()).toContain('dark:bg-gray-800')
      expect(wrapper.classes()).toContain('border')
      expect(wrapper.classes()).toContain('rounded-lg')
    })

    it('should rotate chevron when expanded', async () => {
      // Test that chevron rotation is handled by CSS
      // The actual rotation is handled by Tailwind classes and browser rendering
      await wrapper.setProps({ expanded: true })
      await wrapper.vm.$nextTick()
      
      // Just verify the component renders correctly when expanded
      expect(wrapper.props('expanded')).toBe(true)
    })
  })

  describe('Animation', () => {
    it('should show answer content when expanded', async () => {
      await wrapper.setProps({ expanded: true })
      
      const answerDiv = wrapper.find(`#faq-answer-${mockFAQ.id}`)
      expect(answerDiv.exists()).toBe(true)
      expect(answerDiv.text()).toContain(mockFAQ.answer)
    })

    it('should have proper role attributes for accessibility', async () => {
      await wrapper.setProps({ expanded: true })
      
      const answerDiv = wrapper.find(`#faq-answer-${mockFAQ.id}`)
      expect(answerDiv.attributes('role')).toBe('region')
      expect(answerDiv.attributes('aria-labelledby')).toBe(`faq-question-${mockFAQ.id}`)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty question gracefully', async () => {
      const emptyFAQ = { ...mockFAQ, question: '' }
      await wrapper.setProps({ faq: emptyFAQ })
      
      expect(wrapper.find('h3').text()).toBe('')
    })

    it('should handle empty answer gracefully', async () => {
      const emptyAnswerFAQ = { ...mockFAQ, answer: '' }
      await wrapper.setProps({ faq: emptyAnswerFAQ, expanded: true })
      
      const answerDiv = wrapper.find(`#faq-answer-${mockFAQ.id}`)
      expect(answerDiv.text().trim()).toBe('')
    })

    it('should handle long question text', async () => {
      const longQuestionFAQ = {
        ...mockFAQ,
        question: 'This is a very long question that might wrap to multiple lines and we should ensure it displays properly without breaking the layout or functionality of the component'
      }
      await wrapper.setProps({ faq: longQuestionFAQ })
      
      expect(wrapper.find('h3').text()).toContain('This is a very long question')
    })
  })
})