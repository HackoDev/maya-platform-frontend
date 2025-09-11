import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ActionCard from '@/components/ui/ActionCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/profile/neural-network', component: { template: '<div>Neural Network</div>' } },
    { path: '/profile/change-password', component: { template: '<div>Change Password</div>' } },
  ],
})

describe('ActionCard Component', () => {
  beforeEach(() => {
    router.push('/')
  })

  describe('Rendering Tests', () => {
    it('should render title and description correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.find('h3').text()).toBe('Test Title')
      expect(wrapper.find('p').text()).toBe('Test Description')
    })

    it('should render correct icon based on icon prop', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.find('[data-testid="cpu-icon"]').exists() || wrapper.find('svg').exists()).toBe(true)
    })

    it('should render badge when provided', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
          badge: 'Test Badge',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('Test Badge')
    })

    it('should render chevron arrow for navigation cards', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
          route: '/test',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })

    it('should not render chevron arrow for action cards', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
          isAction: true,
        },
        global: {
          plugins: [router],
        },
      })

      // Should not have ChevronRightIcon
      const chevronElements = wrapper.findAll('svg').filter(el => 
        el.attributes('class')?.includes('group-hover:translate-x-1')
      )
      expect(chevronElements.length).toBe(0)
    })
  })

  describe('Color Theme Tests', () => {
    it('should apply purple theme classes correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
        },
        global: {
          plugins: [router],
        },
      })

      const cardElement = wrapper.find('.action-card')
      expect(cardElement.classes()).toContain('border-purple-200')
    })

    it('should apply green theme classes correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'key',
          color: 'green',
        },
        global: {
          plugins: [router],
        },
      })

      const cardElement = wrapper.find('.action-card')
      expect(cardElement.classes()).toContain('border-green-200')
    })

    it('should apply red theme classes correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'logout',
          color: 'red',
        },
        global: {
          plugins: [router],
        },
      })

      const cardElement = wrapper.find('.action-card')
      expect(cardElement.classes()).toContain('border-red-200')
    })
  })

  describe('Navigation Tests', () => {
    it('should navigate to route when clicked', async () => {
      const routerPushSpy = vi.spyOn(router, 'push').mockResolvedValue()

      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
          route: '/profile/neural-network',
        },
        global: {
          plugins: [router],
        },
      })

      await wrapper.find('.action-card').trigger('click')
      expect(routerPushSpy).toHaveBeenCalledWith('/profile/neural-network')

      routerPushSpy.mockRestore()
    })

    it('should emit click event for action cards', async () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'logout',
          color: 'red',
          isAction: true,
        },
        global: {
          plugins: [router],
        },
      })

      await wrapper.find('.action-card').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.length).toBe(1)
    })
  })

  describe('Keyboard Navigation Tests', () => {
    it('should handle Enter key press', async () => {
      const routerPushSpy = vi.spyOn(router, 'push').mockResolvedValue()

      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
          route: '/profile/neural-network',
        },
        global: {
          plugins: [router],
        },
      })

      await wrapper.find('.action-card').trigger('keydown.enter')
      expect(routerPushSpy).toHaveBeenCalledWith('/profile/neural-network')

      routerPushSpy.mockRestore()
    })

    it('should handle Space key press', async () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'logout',
          color: 'red',
          isAction: true,
        },
        global: {
          plugins: [router],
        },
      })

      await wrapper.find('.action-card').trigger('keydown.space')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Accessibility Tests', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
        },
        global: {
          plugins: [router],
        },
      })

      const cardElement = wrapper.find('.action-card')
      expect(cardElement.attributes('role')).toBe('button')
      expect(cardElement.attributes('aria-label')).toBe('Test Description')
      expect(cardElement.attributes('tabindex')).toBe('0')
    })

    it('should be focusable', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test',
          description: 'Test',
          icon: 'cpu',
          color: 'purple',
        },
        global: {
          plugins: [router],
        },
      })

      const cardElement = wrapper.find('.action-card')
      expect(cardElement.attributes('tabindex')).toBe('0')
    })
  })

  describe('Moderation Status Tests', () => {
    it('should display draft status correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          moderationStatus: 'draft',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('Черновик')
      expect(wrapper.text()).toContain('✏️')
    })

    it('should display pending status correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          moderationStatus: 'pending',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('На модерации')
      expect(wrapper.text()).toContain('⏳')
    })

    it('should display approved status correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          moderationStatus: 'approved',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('Одобрено')
      expect(wrapper.text()).toContain('✅')
    })

    it('should display rejected status correctly', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          moderationStatus: 'rejected',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('Отклонено')
      expect(wrapper.text()).toContain('❌')
    })

    it('should not display moderation status when not provided', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).not.toContain('Черновик')
      expect(wrapper.text()).not.toContain('На модерации')
      expect(wrapper.text()).not.toContain('Одобрено')
      expect(wrapper.text()).not.toContain('Отклонено')
    })
  })

  describe('Progress Indicator Tests', () => {
    it('should display progress bar when showProgress is true', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          showProgress: true,
          completionPercentage: 75,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('Заполнено')
      expect(wrapper.text()).toContain('75%')
    })

    it('should not display progress bar when showProgress is false', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          showProgress: false,
          completionPercentage: 75,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).not.toContain('Заполнено')
      expect(wrapper.text()).not.toContain('75%')
    })

    it('should display correct progress percentage', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          showProgress: true,
          completionPercentage: 42,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('42%')
    })

    it('should not display progress when completionPercentage is undefined', () => {
      const wrapper = mount(ActionCard, {
        props: {
          title: 'Test Title',
          description: 'Test Description',
          icon: 'cpu',
          color: 'purple',
          showProgress: true,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).not.toContain('Заполнено')
    })
  })
})