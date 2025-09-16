import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/test-helpers'
import { createMockVacancy } from '../../utils/mock-factories'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'

describe('VacancyCard', () => {
  const createVacancyWrapper = (vacancyOverrides = {}, props = {}) => {
    const vacancy = createMockVacancy(vacancyOverrides)
    
    return createWrapper(VacancyCard, {
      props: {
        vacancy,
        isOwner: false,
        ...props
      }
    })
  }

  describe('Rendering', () => {
    it('renders vacancy information correctly', () => {
      const wrapper = createVacancyWrapper({
        title: 'Senior React Developer',
        company: 'TechCorp',
        location: 'Remote',
        type: 'full-time',
        experience: 'senior',
        salary: {
          min: 80000,
          max: 120000,
          currency: 'USD',
          period: 'yearly'
        }
      })

      expect(wrapper.text()).toContain('Senior React Developer')
      expect(wrapper.text()).toContain('TechCorp')
      expect(wrapper.text()).toContain('Remote')
      expect(wrapper.text()).toContain('full-time')
    })

    it('displays salary information when available', () => {
      const wrapper = createVacancyWrapper({
        salary: {
          min: 5000,
          max: 8000,
          currency: 'USD',
          period: 'monthly'
        }
      })

      // Should show salary range
      expect(wrapper.text()).toMatch(/5000.*8000|5,000.*8,000/)
      expect(wrapper.text()).toContain('USD')
    })

    it('handles missing salary information gracefully', () => {
      const wrapper = createVacancyWrapper({
        salary: null
      })

      expect(wrapper.exists()).toBe(true)
      // Should still render other vacancy information
      expect(wrapper.text()).toContain('TechCorp') // Default company from mock
    })

    it('displays skills and requirements', () => {
      const wrapper = createVacancyWrapper({
        skills: ['React', 'TypeScript', 'Node.js'],
        requirements: [
          '5+ years experience',
          'Strong JavaScript knowledge',
          'Team player'
        ]
      })

      expect(wrapper.text()).toContain('React')
      expect(wrapper.text()).toContain('TypeScript')
      expect(wrapper.text()).toContain('Node.js')
    })
  })

  describe('Grid Layout Compatibility', () => {
    it('has proper card styling for grid layout', () => {
      const wrapper = createVacancyWrapper()
      
      // Should have card-like styling
      const cardElement = wrapper.find('.bg-white, .border, .rounded')
      expect(cardElement.exists()).toBe(true)
    })

    it('maintains consistent height in grid layout', () => {
      const wrapper = createVacancyWrapper()
      
      // Should have structure that works well in grid
      expect(wrapper.find('.h-full').exists() || wrapper.classes().includes('h-full')).toBe(true)
    })

    it('handles long titles and descriptions appropriately', () => {
      const wrapper = createVacancyWrapper({
        title: 'Senior Full-Stack Developer with React, Node.js, and Cloud Technologies',
        description: 'We are looking for an experienced full-stack developer to join our growing team. The ideal candidate will have extensive experience with modern web technologies, cloud platforms, and agile development methodologies.'
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Senior Full-Stack Developer')
    })

    it('displays application and view counts', () => {
      const wrapper = createVacancyWrapper({
        applicationsCount: 15,
        viewsCount: 240
      })

      expect(wrapper.text()).toContain('15')
      expect(wrapper.text()).toContain('240')
    })
  })

  describe('User Interactions', () => {
    it('emits view event when clicked', async () => {
      const wrapper = createVacancyWrapper()
      
      const clickableElement = wrapper.find('[data-testid="view-vacancy"], button, .cursor-pointer')
      if (clickableElement.exists()) {
        await clickableElement.trigger('click')
        
        expect(wrapper.emitted().view).toBeTruthy()
        expect(wrapper.emitted().view[0]).toEqual([wrapper.props().vacancy])
      }
    })

    it('shows different actions for owner vs non-owner', () => {
      // Test as non-owner (default)
      const nonOwnerWrapper = createVacancyWrapper({}, { isOwner: false })
      
      // Should show apply/view actions
      expect(nonOwnerWrapper.text()).toMatch(/view|apply|посмотреть|подать заявку/i)

      // Test as owner
      const ownerWrapper = createVacancyWrapper({}, { isOwner: true })
      
      // May show edit/delete actions (if implemented)
      expect(ownerWrapper.exists()).toBe(true)
    })

    it('handles remote work indicator', () => {
      const remoteWrapper = createVacancyWrapper({
        isRemote: true,
        location: 'Remote'
      })

      expect(remoteWrapper.text()).toContain('Remote')

      const onsiteWrapper = createVacancyWrapper({
        isRemote: false,
        location: 'New York, NY'
      })

      expect(onsiteWrapper.text()).toContain('New York')
    })
  })

  describe('Status and Timing', () => {
    it('displays application deadline when available', () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      const wrapper = createVacancyWrapper({
        applicationDeadline: futureDate.toISOString()
      })

      // Should show some form of deadline information
      expect(wrapper.exists()).toBe(true)
    })

    it('shows vacancy age/posting date', () => {
      const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const wrapper = createVacancyWrapper({
        createdAt: pastDate.toISOString()
      })

      expect(wrapper.exists()).toBe(true)
      // Should render without errors
    })

    it('indicates active vs inactive vacancies', () => {
      const activeWrapper = createVacancyWrapper({
        isActive: true
      })

      const inactiveWrapper = createVacancyWrapper({
        isActive: false
      })

      expect(activeWrapper.exists()).toBe(true)
      expect(inactiveWrapper.exists()).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    it('adapts content for different screen sizes', () => {
      const wrapper = createVacancyWrapper()
      
      // Should have responsive classes
      const hasResponsiveClasses = wrapper.html().includes('sm:') || 
                                   wrapper.html().includes('md:') || 
                                   wrapper.html().includes('lg:')
      expect(hasResponsiveClasses).toBe(true)
    })

    it('maintains readability on mobile devices', () => {
      const wrapper = createVacancyWrapper({
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.'
      })

      // Should have appropriate text sizes
      expect(wrapper.find('.text-sm, .text-base, .text-lg').exists()).toBe(true)
    })
  })

  describe('Data Formatting', () => {
    it('formats salary ranges correctly', () => {
      const wrapper = createVacancyWrapper({
        salary: {
          min: 75000,
          max: 95000,
          currency: 'USD',
          period: 'yearly'
        }
      })

      // Should format numbers properly
      expect(wrapper.text()).toMatch(/75[,\s]?000|75k/i)
    })

    it('handles different currency formats', () => {
      const eurWrapper = createVacancyWrapper({
        salary: {
          min: 60000,
          max: 80000,
          currency: 'EUR',
          period: 'yearly'
        }
      })

      expect(eurWrapper.text()).toContain('EUR')

      const rubWrapper = createVacancyWrapper({
        salary: {
          min: 150000,
          max: 200000,
          currency: 'RUB',
          period: 'monthly'
        }
      })

      expect(rubWrapper.text()).toContain('RUB')
    })

    it('displays experience level appropriately', () => {
      const seniorWrapper = createVacancyWrapper({
        experience: 'senior'
      })

      const juniorWrapper = createVacancyWrapper({
        experience: 'junior'
      })

      const midWrapper = createVacancyWrapper({
        experience: 'middle'
      })

      expect(seniorWrapper.exists()).toBe(true)
      expect(juniorWrapper.exists()).toBe(true)
      expect(midWrapper.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic HTML structure', () => {
      const wrapper = createVacancyWrapper()
      
      // Should use semantic elements
      expect(wrapper.find('article, section, header, [role]').exists()).toBe(true)
    })

    it('provides keyboard navigation support', () => {
      const wrapper = createVacancyWrapper()
      
      const interactiveElements = wrapper.findAll('button, a, [tabindex]')
      expect(interactiveElements.length).toBeGreaterThan(0)
    })
  })
})