import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import VacancySearch from '@/components/vacancies/VacancySearch.vue'
import { useVacancyStore } from '@/stores/vacancy'

// Mock the debounce composable
vi.mock('@/composables/useDebounce', () => ({
  useDebouncedCallback: vi.fn((callback) => callback)
}))

describe('VacancySearch Query Parameters', () => {
  let router: any
  let pinia: any

  beforeEach(() => {
    vi.useFakeTimers()
    
    // Create router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/my-vacancies', component: { template: '<div>My Vacancies</div>' } }
      ]
    })

    // Create pinia
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should initialize search query from URL parameters', async () => {
    // Navigate to route with search query
    await router.push('/my-vacancies?search=react%20developer')
    
    const wrapper = mount(VacancySearch, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'MagnifyingGlassIcon': true,
          'XMarkIcon': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Check if search input has the URL query value
    const searchInput = wrapper.find('input[id="vacancy-search"]')
    expect(searchInput.element.value).toBe('react developer')
  })

  it('should initialize status filter from URL parameters', async () => {
    // Navigate to route with status filter
    await router.push('/my-vacancies?status=published')
    
    const wrapper = mount(VacancySearch, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'MagnifyingGlassIcon': true,
          'XMarkIcon': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Check if status select has the URL query value
    const statusSelect = wrapper.find('select')
    expect(statusSelect.element.value).toBe('published')
  })

  it('should update URL when search query changes', async () => {
    const wrapper = mount(VacancySearch, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'MagnifyingGlassIcon': true,
          'XMarkIcon': true
        }
      }
    })

    const searchInput = wrapper.find('input[id="vacancy-search"]')
    
    // Type in search input
    await searchInput.setValue('vue developer')
    await searchInput.trigger('input')
    
    await wrapper.vm.$nextTick()

    // Check if URL was updated
    expect(router.currentRoute.value.query.search).toBe('vue developer')
  })

  it('should update URL when status filter changes', async () => {
    const wrapper = mount(VacancySearch, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'MagnifyingGlassIcon': true,
          'XMarkIcon': true
        }
      }
    })

    const statusSelect = wrapper.find('select')
    
    // Change status filter
    await statusSelect.setValue('draft')
    await statusSelect.trigger('change')
    
    await wrapper.vm.$nextTick()

    // Check if URL was updated
    expect(router.currentRoute.value.query.status).toBe('draft')
  })

  it('should clear URL parameters when filters are cleared', async () => {
    // Start with URL parameters
    await router.push('/my-vacancies?search=test&status=published')
    
    const wrapper = mount(VacancySearch, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'MagnifyingGlassIcon': true,
          'XMarkIcon': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Click clear button
    const clearButton = wrapper.find('button')
    await clearButton.trigger('click')
    
    await wrapper.vm.$nextTick()

    // Check if URL parameters were cleared
    expect(router.currentRoute.value.query).toEqual({})
  })

  it('should handle multiple query parameters', async () => {
    // Navigate with both search and status
    await router.push('/my-vacancies?search=frontend&status=published')
    
    const wrapper = mount(VacancySearch, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'MagnifyingGlassIcon': true,
          'XMarkIcon': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Check both values are set
    const searchInput = wrapper.find('input[id="vacancy-search"]')
    const statusSelect = wrapper.find('select')
    
    expect(searchInput.element.value).toBe('frontend')
    expect(statusSelect.element.value).toBe('published')
  })

  it('should sync with route changes', async () => {
    const wrapper = mount(VacancySearch, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'MagnifyingGlassIcon': true,
          'XMarkIcon': true
        }
      }
    })

    // Change route programmatically
    await router.push('/my-vacancies?search=new%20search')
    
    await wrapper.vm.$nextTick()

    // Check if component synced with new route
    const searchInput = wrapper.find('input[id="vacancy-search"]')
    expect(searchInput.element.value).toBe('new search')
  })
})


