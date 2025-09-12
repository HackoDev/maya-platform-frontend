import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { PencilIcon } from '@heroicons/vue/24/outline'
import VacancyCard from '@/components/vacancies/VacancyCard.vue'

describe('VacancyCard', () => {
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
    const wrapper = mount(VacancyCard, {
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
          PencilIcon
        }
      }
    })

    expect(wrapper.find('h3').text()).toBe('Test Vacancy')
    expect(wrapper.find('p').text()).toBe('Test Description')
    expect(wrapper.find('.inline-flex.items-center.px-2\\.5.py-0\\.5.rounded-full').text()).toBe('Черновик')
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(VacancyCard, {
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
          PencilIcon
        }
      }
    })

    const editButton = wrapper.find('button[aria-label="Редактировать"]')
    await editButton.trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(VacancyCard, {
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
          PencilIcon
        }
      }
    })

    const deleteButton = wrapper.find('button:text("Удалить")')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('formats date correctly', () => {
    const wrapper = mount(VacancyCard, {
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
          PencilIcon
        }
      }
    })

    // Check that the date is formatted correctly (Jan 1, 2023)
    expect(wrapper.text()).toContain('янв. 1, 2023')
  })
})