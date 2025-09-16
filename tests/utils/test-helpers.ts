import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import type { Component } from 'vue'
import type { Router } from 'vue-router'

/**
 * Create a test router instance with basic routes
 */
export const createTestRouter = (routes?: any[]): Router => {
  const defaultRoutes = [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/search/specialists', name: 'search-specialists', component: { template: '<div>Search</div>' } },
    { path: '/vacancies', name: 'vacancies', component: { template: '<div>Vacancies</div>' } },
    { path: '/vacancies/:id', name: 'vacancy-detail', component: { template: '<div>Vacancy Detail</div>' } },
    { path: '/profile', name: 'profile', component: { template: '<div>Profile</div>' } },
    { path: '/support', name: 'support', component: { template: '<div>Support</div>' } },
  ]

  return createRouter({
    history: createWebHistory(),
    routes: routes || defaultRoutes,
  })
}

/**
 * Create a wrapper for Vue components with common test setup
 */
export const createWrapper = <T extends Component>(
  component: T,
  options: MountingOptions<any> = {}
): VueWrapper<any> => {
  const defaultOptions: MountingOptions<any> = {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
        }),
      ],
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
          props: ['to'],
        },
        RouterView: {
          template: '<div><slot /></div>',
        },
      },
    },
  }

  // Merge options deeply
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    global: {
      ...defaultOptions.global,
      ...options.global,
      plugins: [
        ...(defaultOptions.global?.plugins || []),
        ...(options.global?.plugins || []),
      ],
      stubs: {
        ...defaultOptions.global?.stubs,
        ...options.global?.stubs,
      },
    },
  }

  return mount(component, mergedOptions)
}

/**
 * Utility to wait for Vue's nextTick and any pending promises
 */
export const flushPromises = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

/**
 * Generate a unique ID for testing
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Mock ResizeObserver for responsive tests
 */
export const mockResizeObserver = (): void => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}

/**
 * Mock window.matchMedia for responsive tests
 */
export const mockMatchMedia = (matches = false): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

/**
 * Simulate viewport size changes for responsive testing
 */
export const setViewportSize = (width: number, height: number): void => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

/**
 * Common viewport sizes for testing
 */
export const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
  large: { width: 1440, height: 900 },
} as const

/**
 * Wait for component to finish loading/rendering
 */
export const waitForComponent = async (wrapper: VueWrapper<any>, timeout = 1000): Promise<void> => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    await flushPromises()
    await wrapper.vm.$nextTick()
    
    // Check if loading indicators are gone
    if (!wrapper.find('[data-testid="loading"]').exists() && 
        !wrapper.find('.animate-spin').exists()) {
      break
    }
    
    await new Promise(resolve => setTimeout(resolve, 50))
  }
}

/**
 * Assert that an element has specific CSS classes
 */
export const expectToHaveClasses = (element: any, classes: string[]): void => {
  classes.forEach(className => {
    expect(element.classes()).toContain(className)
  })
}

/**
 * Assert that a grid has the expected number of columns
 */
export const expectGridColumns = (wrapper: VueWrapper<any>, selector: string, expectedColumns: number): void => {
  const gridElement = wrapper.find(selector)
  expect(gridElement.exists()).toBe(true)
  
  const gridClasses = gridElement.classes()
  const columnClass = `grid-cols-${expectedColumns}`
  const hasExpectedColumns = gridClasses.some(cls => 
    cls.includes(`grid-cols-${expectedColumns}`) || 
    cls.includes(`md:grid-cols-${expectedColumns}`) ||
    cls.includes(`lg:grid-cols-${expectedColumns}`)
  )
  
  expect(hasExpectedColumns).toBe(true)
}