import { ref, computed, type Ref } from 'vue'

interface PaginationOptions {
  initialPage?: number
  initialPageSize?: number
  total?: number
}

interface UsePaginationReturn {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  totalPages: Ref<number>
  hasNextPage: Ref<boolean>
  hasPreviousPage: Ref<boolean>
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  setPageSize: (size: number) => void
  setTotal: (total: number) => void
  reset: () => void
}

export function usePagination(options: PaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 10, total: initialTotal = 0 } = options

  const currentPage = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(initialTotal)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPreviousPage = computed(() => currentPage.value > 1)

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const setPageSize = (size: number) => {
    pageSize.value = size
    currentPage.value = 1 // Reset to first page when changing page size
  }

  const setTotal = (newTotal: number) => {
    total.value = newTotal
  }

  const reset = () => {
    currentPage.value = initialPage
    pageSize.value = initialPageSize
    total.value = initialTotal
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setPageSize,
    setTotal,
    reset,
  }
}
