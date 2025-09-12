import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { PencilIcon, XMarkIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import VacancyDetail from '@/components/vacancies/VacancyDetail.vue'

describe('VacancyDetail', () => {
  const mockVacancy = {
    id: '1',
    title: 'Test Vacancy',
    description: 'Test Description',
    status: 'draft' as const,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    clientId: 'client-1',
    clientName: 'Test Client',
    clientPhone: '+7 (999) 123-45-67'
  }

  it('renders vacancy information correctly', () => {
    const wrapper = mount(VacancyDetail, {
      props: {
        vacancy: mockVacancy
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          PencilIcon,
          XMarkIcon,
          UserCircleIcon
        }
      }
    })

    expect(wrapper.find('h2').text()).toBe('Test Vacancy')
    expect(wrapper.find('p').text()).toBe('Test Description')
    expect(wrapper.find('.inline-flex.items-center.px-2\\.5.py-0\\.5.rounded-full').text()).toBe('Черновик')
  })

  it('displays client information', () => {
    const wrapper = mount(VacancyDetail, {
      props: {
        vacancy: mockVacancy
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          PencilIcon,
          XMarkIcon,
          UserCircleIcon
        }
      }
    })

    expect(wrapper.text()).toContain('Test Client')
    expect(wrapper.text()).toContain('Клиент')
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(VacancyDetail, {
      props: {
        vacancy: mockVacancy
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          PencilIcon,
          XMarkIcon,
          UserCircleIcon
        }
      }
    })

    const editButton = wrapper.find('button:text("Редактировать")')
    await editButton.trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
  })

  it('emits contact event when contact button is clicked', async () => {
    const wrapper = mount(VacancyDetail, {
      props: {
        vacancy: mockVacancy
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          PencilIcon,
          XMarkIcon,
          UserCircleIcon
        }
      }
    })

    const contactButton = wrapper.find('button:text("Связаться")')
    await contactButton.trigger('click')

    expect(wrapper.emitted('contact')).toBeTruthy()
  })

  it('formats dates correctly', () => {
    const wrapper = mount(VacancyDetail, {
      props: {
        vacancy: mockVacancy
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          PencilIcon,
          XMarkIcon,
          UserCircleIcon
        }
      }
    })

    // Check that the dates are formatted correctly
    expect(wrapper.text()).toContain('Создано: 1 января 2023 г.')
  })

  it('shows appropriate action buttons based on status', async () => {
    // Test draft status
    const wrapper = mount(VacancyDetail, {
      props: {
        vacancy: { ...mockVacancy, status: 'draft' }
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          PencilIcon,
          XMarkIcon,
          UserCircleIcon
        }
      }
    })

    expect(wrapper.find('button:text("Опубликовать")').exists()).toBe(true)
    expect(wrapper.find('button:text("Закрыть вакансию")').exists()).toBe(false)
    expect(wrapper.find('button:text("Открыть повторно")').exists()).toBe(false)

    // Test published status
    await wrapper.setProps({ vacancy: { ...mockVacancy, status: 'published' } })
    expect(wrapper.find('button:text("Опубликовать")').exists()).toBe(false)
    expect(wrapper.find('button:text("Закрыть вакансию")').exists()).toBe(true)
    expect(wrapper.find('button:text("Открыть повторно")').exists()).toBe(false)

    // Test closed status
    await wrapper.setProps({ vacancy: { ...mockVacancy, status: 'closed' } })
    expect(wrapper.find('button:text("Опубликовать")').exists()).toBe(false)
    expect(wrapper.find('button:text("Закрыть вакансию")').exists()).toBe(false)
    expect(wrapper.find('button:text("Открыть повторно")').exists()).toBe(true)
  })
})