import { describe, it, expect } from 'vitest'
import { usePagination } from '@/composables/usePagination'

describe('usePagination', () => {
  it('initializes with correct default values', () => {
    const pagination = usePagination()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.pageSize.value).toBe(10)
    expect(pagination.total.value).toBe(0)
    expect(pagination.totalPages.value).toBe(0)
    expect(pagination.hasNextPage.value).toBe(false)
    expect(pagination.hasPreviousPage.value).toBe(false)
  })

  it('initializes with custom values', () => {
    const pagination = usePagination({
      initialPage: 2,
      initialPageSize: 20,
      total: 100,
    })

    expect(pagination.currentPage.value).toBe(2)
    expect(pagination.pageSize.value).toBe(20)
    expect(pagination.total.value).toBe(100)
    expect(pagination.totalPages.value).toBe(5)
  })

  it('calculates total pages correctly', () => {
    const pagination = usePagination({ total: 95, initialPageSize: 10 })

    expect(pagination.totalPages.value).toBe(10)
  })

  it('navigates to next page', () => {
    const pagination = usePagination({ total: 100, initialPageSize: 10 })

    pagination.nextPage()

    expect(pagination.currentPage.value).toBe(2)
  })

  it('navigates to previous page', () => {
    const pagination = usePagination({
      initialPage: 3,
      total: 100,
      initialPageSize: 10,
    })

    pagination.previousPage()

    expect(pagination.currentPage.value).toBe(2)
  })

  it('goes to specific page', () => {
    const pagination = usePagination({ total: 100, initialPageSize: 10 })

    pagination.goToPage(5)

    expect(pagination.currentPage.value).toBe(5)
  })

  it('does not go beyond valid page range', () => {
    const pagination = usePagination({ total: 100, initialPageSize: 10 })

    pagination.goToPage(15) // Beyond total pages

    expect(pagination.currentPage.value).toBe(1) // Should remain unchanged
  })

  it('resets to initial values', () => {
    const pagination = usePagination({
      initialPage: 2,
      initialPageSize: 20,
      total: 100,
    })

    pagination.goToPage(5)
    pagination.setPageSize(30)
    pagination.setTotal(200)

    pagination.reset()

    expect(pagination.currentPage.value).toBe(2)
    expect(pagination.pageSize.value).toBe(20)
    expect(pagination.total.value).toBe(100)
  })
})
