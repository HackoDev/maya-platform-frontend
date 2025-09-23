import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleFAQSection from '@/components/support/SimpleFAQSection.vue'
import CompactFAQItem from '@/components/support/CompactFAQItem.vue'
import type { SimplifiedFAQ } from '@/types'

const mockFAQs: SimplifiedFAQ[] = [
  {
    id: '1',
    question: 'What is this platform?',
    answer: 'This is a comprehensive platform for managing various tasks.'
  },
  {
    id: '2',
    question: 'How do I get started?',
    answer: 'You can get started by creating an account and following the onboarding guide.'
  },
  {
    id: '3',
    question: 'Is there customer support?',
    answer: 'Yes, we provide 24/7 customer support through multiple channels.'
  }
]

describe('SimpleFAQSection Component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(SimpleFAQSection, {
      props: {
        faqs: mockFAQs,
        loading: false,
        error: null
      }
    })
  })

  describe('Rendering', () => {
    it('should render the section title and description', () => {
      expect(wrapper.text()).toContain('Часто задаваемые вопросы')
      expect(wrapper.text()).toContain('Найдите ответы на популярные вопросы')
    })

    it('should render FAQ items when data is available', () => {
      const faqItems = wrapper.findAllComponents(CompactFAQItem)
      expect(faqItems).toHaveLength(mockFAQs.length)
    })

    it('should render FAQ items in order', () => {
      const faqItems = wrapper.findAllComponents(CompactFAQItem)
      
      expect(faqItems[0].props('faq').id).toBe('1')
      expect(faqItems[1].props('faq').id).toBe('2')
      expect(faqItems[2].props('faq').id).toBe('3')
    })

    it('should render section header icon', () => {
      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('Loading State', () => {
    it('should show loading skeleton when loading is true', async () => {
      await wrapper.setProps({ loading: true })
      
      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
      expect(wrapper.findAllComponents(CompactFAQItem)).toHaveLength(0)
    })

    it('should render multiple loading skeleton items', async () => {
      await wrapper.setProps({ loading: true })
      
      const skeletonItems = wrapper.findAll('.animate-pulse > div')
      expect(skeletonItems.length).toBeGreaterThan(0)
    })
  })

  describe('Error State', () => {
    it('should show error message when error prop is provided', async () => {
      const errorMessage = 'Failed to load FAQs'
      await wrapper.setProps({ error: errorMessage })
      
      expect(wrapper.text()).toContain('Ошибка загрузки FAQ')
      expect(wrapper.text()).toContain(errorMessage)
      expect(wrapper.findAllComponents(CompactFAQItem)).toHaveLength(0)
    })

    it('should show retry button in error state', async () => {
      await wrapper.setProps({ error: 'Network error' })
      
      const retryButton = wrapper.find('button')
      expect(retryButton.exists()).toBe(true)
      expect(retryButton.text()).toContain('Попробовать снова')
    })

    it('should emit refresh event when retry button is clicked', async () => {
      await wrapper.setProps({ error: 'Network error' })
      
      const retryButton = wrapper.find('button')
      await retryButton.trigger('click')
      
      expect(wrapper.emitted('refresh')).toBeTruthy()
      expect(wrapper.emitted('refresh')).toHaveLength(1)
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no FAQs are available', async () => {
      await wrapper.setProps({ faqs: [] })
      
      expect(wrapper.text()).toContain('Нет доступных вопросов')
      expect(wrapper.text()).toContain('FAQ раздел пока пуст')
      expect(wrapper.findAllComponents(CompactFAQItem)).toHaveLength(0)
    })

    it('should show refresh button in empty state', async () => {
      await wrapper.setProps({ faqs: [] })
      
      const refreshButton = wrapper.find('button')
      expect(refreshButton.exists()).toBe(true)
      expect(refreshButton.text()).toContain('Обновить')
    })

    it('should emit refresh event when empty state refresh button is clicked', async () => {
      await wrapper.setProps({ faqs: [] })
      
      const refreshButton = wrapper.find('button')
      await refreshButton.trigger('click')
      
      expect(wrapper.emitted('refresh')).toBeTruthy()
    })
  })

  describe('FAQ Interactions', () => {
    it('should handle FAQ toggle correctly', async () => {
      const firstFAQItem = wrapper.findComponent(CompactFAQItem)
      
      await firstFAQItem.vm.$emit('toggle')
      
      expect(wrapper.emitted('toggle-faq')).toBeTruthy()
      expect(wrapper.emitted('toggle-faq')[0]).toEqual(['1']) // First FAQ ID
    })

    it('should maintain individual FAQ expansion state', async () => {
      const faqItems = wrapper.findAllComponents(CompactFAQItem)
      
      // Toggle first FAQ
      await faqItems[0].vm.$emit('toggle')
      
      // Check that only the first FAQ is expanded
      expect(faqItems[0].props('expanded')).toBe(true)
      expect(faqItems[1].props('expanded')).toBe(false)
      expect(faqItems[2].props('expanded')).toBe(false)
    })

    it('should allow multiple FAQs to be expanded simultaneously', async () => {
      const faqItems = wrapper.findAllComponents(CompactFAQItem)
      
      // Toggle first and third FAQ
      await faqItems[0].vm.$emit('toggle')
      await faqItems[2].vm.$emit('toggle')
      
      expect(faqItems[0].props('expanded')).toBe(true)
      expect(faqItems[1].props('expanded')).toBe(false)
      expect(faqItems[2].props('expanded')).toBe(true)
    })

    it('should toggle FAQ back to collapsed state', async () => {
      const firstFAQItem = wrapper.findComponent(CompactFAQItem)
      
      // Expand
      await firstFAQItem.vm.$emit('toggle')
      expect(firstFAQItem.props('expanded')).toBe(true)
      
      // Collapse
      await firstFAQItem.vm.$emit('toggle')
      expect(firstFAQItem.props('expanded')).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toContain('Часто задаваемые вопросы')
    })

    it('should pass correct props to FAQ items', () => {
      const faqItems = wrapper.findAllComponents(CompactFAQItem)
      
      faqItems.forEach((item, index) => {
        expect(item.props('faq')).toEqual(mockFAQs[index])
        expect(item.props('expanded')).toBe(false)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle single FAQ correctly', async () => {
      const singleFAQ = [mockFAQs[0]]
      await wrapper.setProps({ faqs: singleFAQ })
      
      const faqItems = wrapper.findAllComponents(CompactFAQItem)
      expect(faqItems).toHaveLength(1)
      expect(faqItems[0].props('faq')).toEqual(singleFAQ[0])
    })

    it('should handle multiple FAQs', async () => {
      await wrapper.setProps({ faqs: mockFAQs })
      
      const faqItems = wrapper.findAllComponents(CompactFAQItem)
      expect(faqItems).toHaveLength(mockFAQs.length)
    })

    it('should handle both loading and error states gracefully', async () => {
      await wrapper.setProps({ loading: true, error: 'Some error' })
      
      // Loading should take precedence
      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
      expect(wrapper.text()).not.toContain('Ошибка загрузки FAQ')
    })

    it('should handle null/undefined error gracefully', async () => {
      await wrapper.setProps({ error: null })
      
      expect(wrapper.text()).not.toContain('Ошибка загрузки FAQ')
      expect(wrapper.findAllComponents(CompactFAQItem)).toHaveLength(mockFAQs.length)
    })
  })
})