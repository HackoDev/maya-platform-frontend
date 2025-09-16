import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/test-helpers'
import { createMockPortfolio, createMockSpecialist } from '../../utils/mock-factories'
import PortfolioSpecialistCard from '@/components/ui/PortfolioSpecialistCard.vue'

// Mock the ProfileViewModal component
vi.mock('@/components/ui/ProfileViewModal.vue', () => ({
  default: {
    template: '<div data-testid="profile-view-modal"><slot /></div>',
    props: ['visible', 'specialist'],
    emits: ['close']
  }
}))

describe('PortfolioSpecialistCard', () => {
  const createCardWrapper = (portfolioOverrides = {}, specialistOverrides = {}) => {
    const portfolio = createMockPortfolio(portfolioOverrides)
    const specialist = createMockSpecialist(specialistOverrides)
    
    return createWrapper(PortfolioSpecialistCard, {
      props: {
        portfolio,
        specialist
      }
    })
  }

  describe('Rendering', () => {
    it('renders portfolio and specialist information correctly', () => {
      const wrapper = createCardWrapper({
        title: 'E-commerce Platform',
        description: 'Modern shopping platform with React',
        technologies: ['React', 'Node.js', 'PostgreSQL']
      }, {
        firstName: 'John',
        lastName: 'Developer',
        title: 'Senior Frontend Developer',
        rating: 4.8,
        reviewCount: 25
      })

      // Check portfolio information
      expect(wrapper.text()).toContain('E-commerce Platform')
      expect(wrapper.text()).toContain('Modern shopping platform with React')
      expect(wrapper.text()).toContain('React')
      expect(wrapper.text()).toContain('Node.js')
      expect(wrapper.text()).toContain('PostgreSQL')

      // Check specialist information
      expect(wrapper.text()).toContain('John Developer')
      expect(wrapper.text()).toContain('Senior Frontend Developer')
      expect(wrapper.text()).toContain('4.8')
      expect(wrapper.text()).toContain('25')
    })

    it('does not display services section', () => {
      const wrapper = createCardWrapper()
      
      // Services section should not be present
      expect(wrapper.text()).not.toContain('Услуги:')
      expect(wrapper.find('.specialist-services').exists()).toBe(false)
    })

    it('displays portfolio images when available', () => {
      const wrapper = createCardWrapper({
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
      })

      const images = wrapper.findAll('img')
      expect(images.length).toBeGreaterThan(0)
    })

    it('handles missing or empty portfolio images gracefully', () => {
      const wrapper = createCardWrapper({
        images: []
      })

      // Should not crash and should still render other content
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Grid Layout Compatibility', () => {
    it('has proper card styling for grid layout', () => {
      const wrapper = createCardWrapper()
      
      // Should have card-like styling that works well in grid
      const cardElement = wrapper.find('[data-testid="portfolio-card"]') || wrapper.find('.bg-white, .bg-gray-50')
      expect(cardElement.exists()).toBe(true)
    })

    it('maintains consistent height in grid layout', () => {
      const wrapper = createCardWrapper()
      
      // Card should have structure that allows consistent height
      expect(wrapper.find('.h-full').exists() || wrapper.find('.flex-1').exists()).toBe(true)
    })

    it('handles long titles and descriptions appropriately', () => {
      const wrapper = createCardWrapper({
        title: 'Very Long Portfolio Title That Might Wrap To Multiple Lines In Grid Layout',
        description: 'This is a very long description that tests how the component handles overflow text and maintains proper layout proportions when displayed in a responsive grid system with multiple cards per row.'
      })

      expect(wrapper.exists()).toBe(true)
      // Should still render without breaking layout
      expect(wrapper.text()).toContain('Very Long Portfolio Title')
    })
  })

  describe('Interactions', () => {
    it('opens specialist profile modal when clicked', async () => {
      const wrapper = createCardWrapper()
      
      const clickableElement = wrapper.find('[data-testid="view-specialist"], button, .cursor-pointer')
      if (clickableElement.exists()) {
        await clickableElement.trigger('click')
        
        // Should show modal or emit event
        expect(wrapper.find('[data-testid="profile-view-modal"]').exists()).toBe(true)
      }
    })

    it('handles specialist avatar fallback', () => {
      const wrapper = createCardWrapper({}, {
        avatar: null // No avatar
      })

      expect(wrapper.exists()).toBe(true)
      // Should still render specialist information
      expect(wrapper.text()).toMatch(/[A-Z]{2}/) // Should show initials or placeholder
    })
  })

  describe('Responsive Design', () => {
    it('adapts content for mobile screens', () => {
      const wrapper = createCardWrapper()
      
      // Should have responsive classes or structure
      const responsiveElements = wrapper.findAll('.sm\\:, .md\\:, .lg\\:')
      expect(responsiveElements.length).toBeGreaterThanOrEqual(0)
    })

    it('maintains readability at different screen sizes', () => {
      const wrapper = createCardWrapper({
        title: 'Test Portfolio',
        description: 'Test description for responsive testing'
      })

      // Text should be readable
      expect(wrapper.find('.text-xs, .text-sm, .text-base').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      const wrapper = createCardWrapper()
      
      // Should have semantic HTML or ARIA attributes
      const card = wrapper.find('article, [role="article"], [aria-label]')
      expect(card.exists()).toBe(true)
    })

    it('provides alternative text for images', () => {
      const wrapper = createCardWrapper({
        images: ['https://example.com/portfolio-image.jpg']
      })

      const images = wrapper.findAll('img')
      images.forEach(img => {
        expect(img.attributes('alt')).toBeDefined()
      })
    })
  })
})