import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SpecialistSearchFilters from '@/components/search/SpecialistSearchFilters.vue'
import { useUserStore } from '@/stores/user'
import { useSpecialistSearchStore } from '@/stores/specialist-search'

// Mock the user store
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn()
}))

// Mock the specialist search store
vi.mock('@/stores/specialist-search', () => ({
  useSpecialistSearchStore: vi.fn()
}))

describe('SpecialistSearchFilters', () => {
  let wrapper: any
  let mockUserStore: any
  let mockSearchStore: any

  beforeEach(() => {
    setActivePinia(createPinia())

    // Mock user store
    mockUserStore = {
      currentUser: null
    }
    vi.mocked(useUserStore).mockReturnValue(mockUserStore)

    // Mock search store
    mockSearchStore = {
      availableSkills: [],
      searchSummary: '',
      searchFilters: {
        query: '',
        skills: [],
        status: undefined,
        page: 1,
        limit: 5
      },
      loadAvailableSkills: vi.fn().mockResolvedValue([])
    }
    vi.mocked(useSpecialistSearchStore).mockReturnValue(mockSearchStore)

    wrapper = mount(SpecialistSearchFilters, {
      global: {
        plugins: [createPinia()]
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('does not show status filter for non-admin users', () => {
    mockUserStore.currentUser = { userType: 'specialist' }
    wrapper.vm.$forceUpdate()

    expect(wrapper.find('[data-testid="status-filter"]').exists()).toBe(false)
  })

  it('shows status filter for admin users', async () => {
    mockUserStore.currentUser = { userType: 'admin' }
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="status-filter"]').exists()).toBe(true)
  })

  it('emits search event with correct filters', async () => {
    const form = wrapper.find('form')
    await form.trigger('submit')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0][0]).toEqual({
      query: '',
      skills: [],
      status: undefined,
      page: 1,
      limit: 5
    })
  })

  it('emits clear event when clear button is clicked', async () => {
    const clearButton = wrapper.find('button[type="button"]')
    await clearButton.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('updates local filters when store filters change', async () => {
    // Update the mock store filters
    Object.assign(mockSearchStore.searchFilters, {
      query: 'test query',
      skills: ['skill1'],
      status: 'published',
      page: 1,
      limit: 5
    })

    // Trigger the watcher by calling initializeFilters
    wrapper.vm.initializeFilters()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.localFilters.query).toBe('test query')
    expect(wrapper.vm.localFilters.skills).toEqual(['skill1'])
    expect(wrapper.vm.localFilters.status).toBe('published')
  })

  it('shows active filters when they exist', () => {
    mockUserStore.currentUser = { userType: 'admin' }
    wrapper.vm.localFilters.query = 'test'
    wrapper.vm.localFilters.skills = ['skill1']
    wrapper.vm.localFilters.status = 'published'

    expect(wrapper.vm.hasActiveFilters).toBe(true)
  })

  it('does not show active filters when none exist', () => {
    wrapper.vm.localFilters.query = ''
    wrapper.vm.localFilters.skills = []
    wrapper.vm.localFilters.status = undefined

    expect(wrapper.vm.hasActiveFilters).toBe(false)
  })

  it('correctly formats status labels', () => {
    expect(wrapper.vm.getStatusLabel('published')).toBe('Опубликованные')
    expect(wrapper.vm.getStatusLabel('waiting')).toBe('На модерации')
    expect(wrapper.vm.getStatusLabel('unknown')).toBe('unknown')
  })
})
