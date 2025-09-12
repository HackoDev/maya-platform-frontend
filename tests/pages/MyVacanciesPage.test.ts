import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { PlusIcon, ExclamationTriangleIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'
import MyVacanciesPage from '@/pages/MyVacanciesPage.vue'
import { useVacancyStore } from '@/stores/vacancy'

// Mock the components that are dynamically imported
vi.mock('@/components/vacancies/VacancySearch.vue', () => ({
  default: {
    template: '<div>Mock VacancySearch</div>'
  }
}))

vi.mock('@/components/vacancies/VacancyList.vue', () => ({
  default: {
    template: '<div>Mock VacancyList <button @click="$emit(\'create\')">Create</button><button @click="$emit(\'edit\', {})">Edit</button><button @click="$emit(\'delete\', \'1\')">Delete</button></div>',
    emits: ['create', 'edit', 'delete']
  }
}))

vi.mock('@/components/vacancies/VacancyForm.vue', () => ({
  default: {
    template: '<div>Mock VacancyForm</div>',
    props: ['isOpen', 'vacancy']
  }
}))

vi.mock('@/components/ui/ConfirmDialog.vue', () => ({
  default: {
    template: '<div>Mock ConfirmDialog</div>',
    props: ['isOpen', 'title', 'message', 'confirmText', 'cancelText']
  }
}))

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/vacancies',
      name: 'MyVacancies',
      component: MyVacanciesPage
    }
  ]
})

describe('MyVacanciesPage', () => {
  let wrapper: any
  let vacancyStore: ReturnType<typeof useVacancyStore>

  beforeEach(() => {
    wrapper = mount(MyVacanciesPage, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          }),
          router
        ],
        components: {
          PlusIcon,
          ExclamationTriangleIcon,
          BriefcaseIcon
        }
      }
    })

    vacancyStore = useVacancyStore()
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Мои вакансии')
  })

  it('calls fetchVacancies on mount', () => {
    expect(vacancyStore.fetchVacancies).toHaveBeenCalled()
  })

  it('opens vacancy form when create button is clicked', async () => {
    const createButton = wrapper.find('button:text("Создать вакансию")')
    await createButton.trigger('click')

    expect(vacancyStore.openVacancyForm).toHaveBeenCalled()
  })

  it('handles edit vacancy event', async () => {
    const mockVacancy = {
      id: '1',
      title: 'Test Vacancy',
      description: 'Test Description',
      status: 'draft',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    }

    const vacancyList = wrapper.findComponent({ name: 'VacancyList' })
    vacancyList.vm.$emit('edit', mockVacancy)

    expect(vacancyStore.openVacancyForm).toHaveBeenCalledWith(mockVacancy)
  })

  it('handles delete vacancy event with confirmation', async () => {
    const vacancyId = '1'
    
    const vacancyList = wrapper.findComponent({ name: 'VacancyList' })
    vacancyList.vm.$emit('delete', vacancyId)

    // Check that confirm dialog is shown
    expect(wrapper.vm.showConfirmDialog).toBe(true)
    expect(wrapper.vm.pendingDeleteId).toBe(vacancyId)
  })

  it('handles save vacancy event for new vacancy', async () => {
    const vacancyData = {
      title: 'New Vacancy',
      description: 'New Description',
      status: 'draft'
    }

    // Mock the store method to resolve
    vi.spyOn(vacancyStore, 'createVacancy').mockResolvedValue({
      id: 'new-1',
      ...vacancyData,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    })

    const vacancyForm = wrapper.findComponent({ name: 'VacancyForm' })
    vacancyForm.vm.$emit('save', vacancyData)

    expect(vacancyStore.createVacancy).toHaveBeenCalledWith(vacancyData)
  })

  it('handles save vacancy event for existing vacancy', async () => {
    const mockVacancy = {
      id: '1',
      title: 'Existing Vacancy',
      description: 'Existing Description',
      status: 'draft',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      clientId: 'client-1',
      clientName: 'Test Client',
      clientPhone: '+7 (999) 123-45-67'
    }

    // Set selected vacancy to simulate editing
    vacancyStore.selectedVacancy = mockVacancy

    const vacancyData = {
      title: 'Updated Vacancy',
      description: 'Updated Description',
      status: 'published'
    }

    // Mock the store method to resolve
    vi.spyOn(vacancyStore, 'updateVacancy').mockResolvedValue({
      ...mockVacancy,
      ...vacancyData,
      updatedAt: '2023-01-02'
    })

    const vacancyForm = wrapper.findComponent({ name: 'VacancyForm' })
    vacancyForm.vm.$emit('save', vacancyData)

    expect(vacancyStore.updateVacancy).toHaveBeenCalledWith('1', vacancyData)
  })
})