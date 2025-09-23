import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FAQItem from '@/components/support/FAQItem.vue'
import type { FAQ } from '@/types'

const mockFAQ: FAQ = {
  id: '1',
  question: 'How do I create an account?',
  answer: 'Click the registration button in the top right corner of the page.',
}

describe('FAQItem Component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FAQItem, {
      props: {
        faq: mockFAQ,
        expanded: false,
      },
    })
  })

  describe('Rendering', () => {
    it('should render FAQ question correctly', () => {
      expect(wrapper.text()).toContain(mockFAQ.question)
    })


    it('should display chevron icon', () => {
      const chevronIcon = wrapper.find('svg')
      expect(chevronIcon.exists()).toBe(true)
    })
  })

  describe('Expansion State', () => {
    it('should not show answer when collapsed', () => {
      const answerDiv = wrapper.find('[data-testid=\"faq-answer-1\"]')
      expect(answerDiv.isVisible()).toBe(false)
    })

    it('should show answer when expanded', async () => {
      await wrapper.setProps({ expanded: true })
      
      const answerDiv = wrapper.find('[data-testid=\"faq-answer-1\"]')
      expect(answerDiv.isVisible()).toBe(true)
      expect(answerDiv.text()).toContain(mockFAQ.answer)
    })

    it('should rotate chevron when expanded', async () => {
      await wrapper.setProps({ expanded: true })
      
      const chevronIcon = wrapper.find('.rotate-180')
      expect(chevronIcon.exists()).toBe(true)
    })

    it('should show helpful actions when expanded', async () => {
      await wrapper.setProps({ expanded: true })
      
      const helpfulSection = wrapper.find('button[aria-label*=\"Ответ полезен\"]')
      const notHelpfulSection = wrapper.find('button[aria-label*=\"Ответ не полезен\"]')
      
      expect(helpfulSection.exists()).toBe(true)
      expect(notHelpfulSection.exists()).toBe(true)
    })
  })

  describe('Interactions', () => {
    it('should emit toggle event when clicked', async () => {
      const button = wrapper.find('button[aria-expanded]')
      
      await button.trigger('click')
      
      expect(wrapper.emitted().toggle).toBeTruthy()
      expect(wrapper.emitted().toggle).toHaveLength(1)
    })

    it('should emit helpful event when helpful button clicked', async () => {
      await wrapper.setProps({ expanded: true })
      
      const helpfulButton = wrapper.find('button[aria-label*=\"Ответ полезен\"]')
      await helpfulButton.trigger('click')
      
      expect(wrapper.emitted().helpful).toBeTruthy()
      expect(wrapper.emitted().helpful[0]).toEqual([true])
    })

    it('should emit helpful event when not helpful button clicked', async () => {
      await wrapper.setProps({ expanded: true })
      
      const notHelpfulButton = wrapper.find('button[aria-label*=\"Ответ не полезен\"]')
      await notHelpfulButton.trigger('click')
      
      expect(wrapper.emitted().helpful).toBeTruthy()
      expect(wrapper.emitted().helpful[0]).toEqual([false])
    })

    it('should handle keyboard navigation', async () => {
      const button = wrapper.find('button[aria-expanded]')
      
      await button.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted().toggle).toBeTruthy()
      
      await button.trigger('keydown', { key: ' ' })
      expect(wrapper.emitted().toggle).toHaveLength(2)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const button = wrapper.find('button[aria-expanded]')
      expect(button.attributes('aria-expanded')).toBe('false')
      expect(button.attributes('aria-controls')).toBe('faq-answer-1')
    })

    it('should update aria-expanded when expanded changes', async () => {
      const button = wrapper.find('button[aria-expanded]')
      
      await wrapper.setProps({ expanded: true })
      expect(button.attributes('aria-expanded')).toBe('true')
    })

    it('should have proper role and labelling for answer section', async () => {
      await wrapper.setProps({ expanded: true })
      
      const answerSection = wrapper.find('[data-testid=\"faq-answer-1\"]')
      expect(answerSection.attributes('role')).toBe('region')
      expect(answerSection.attributes('aria-labelledby')).toBe('faq-question-1')
    })
  })


  describe('Answer Formatting', () => {
    it('should format answer with basic HTML', async () => {
      const faqWithFormatting = {
        ...mockFAQ,
        answer: 'This is **bold** text and *italic* text.',
      }
      
      await wrapper.setProps({ 
        faq: faqWithFormatting,
        expanded: true 
      })
      
      const answerContent = wrapper.find('[data-testid=\"faq-answer-1\"] p')
      expect(answerContent.html()).toContain('<strong>bold</strong>')
      expect(answerContent.html()).toContain('<em>italic</em>')
    })

    it('should handle line breaks in answer', async () => {
      const faqWithLineBreaks = {
        ...mockFAQ,
        answer: 'Line 1\nLine 2',
      }
      
      await wrapper.setProps({ 
        faq: faqWithLineBreaks,
        expanded: true 
      })
      
      const answerContent = wrapper.find('[data-testid=\"faq-answer-1\"] p')
      expect(answerContent.html()).toContain('<br>')
    })
  })
})