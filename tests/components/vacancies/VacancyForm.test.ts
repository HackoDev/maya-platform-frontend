import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import VacancyForm from '@/components/vacancies/VacancyForm.vue'

describe('VacancyForm', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(VacancyForm, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          BaseModal: {
            template: '<div><slot name="header"></slot><slot name="default"></slot><slot name="footer"></slot></div>'
          }
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Создать вакансию')
  })

  it('renders edit mode when vacancy prop is provided', async () => {
    const vacancy = {
      id: '1',
      title: 'Test Vacancy',
      description: 'Test Description',
      status: 'draft' as const,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    }

    await wrapper.setProps({ vacancy, isOpen: true })
    expect(wrapper.find('h3').text()).toBe('Редактировать вакансию')
  })

  it('validates required fields', async () => {
    const saveButton = wrapper.find('button[type="submit"]')
    await saveButton.trigger('click')

    expect(wrapper.find('.text-red-600').exists()).toBe(true)
    expect(wrapper.emitted('save')).toBeFalsy()
  })

  it('validates title length', async () => {
    const titleInput = wrapper.find('#title')
    await titleInput.setValue('a'.repeat(101)) // 101 characters, exceeds limit

    const saveButton = wrapper.find('button[type="submit"]')
    await saveButton.trigger('click')

    expect(wrapper.find('.text-red-600').exists()).toBe(true)
    expect(wrapper.emitted('save')).toBeFalsy()
  })

  it('validates description length', async () => {
    const descriptionInput = wrapper.find('#description')
    await descriptionInput.setValue('a'.repeat(2001)) // 2001 characters, exceeds limit

    const saveButton = wrapper.find('button[type="submit"]')
    await saveButton.trigger('click')

    expect(wrapper.find('.text-red-600').exists()).toBe(true)
    expect(wrapper.emitted('save')).toBeFalsy()
  })

  it('emits save event with valid data', async () => {
    const titleInput = wrapper.find('#title')
    const descriptionInput = wrapper.find('#description')
    const statusSelect = wrapper.find('#status')

    await titleInput.setValue('Valid Title')
    await descriptionInput.setValue('Valid Description')
    await statusSelect.setValue('published')

    const saveButton = wrapper.find('button[type="submit"]')
    await saveButton.trigger('click')

    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')[0][0]).toEqual({
      title: 'Valid Title',
      description: 'Valid Description',
      status: 'published'
    })
  })
})