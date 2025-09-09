import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface UseAsyncStateOptions<T> {
  immediate?: boolean
  resetOnExecute?: boolean
  shallow?: boolean
  delay?: number
}

interface UseAsyncStateReturn<T> {
  state: Ref<T | undefined>
  isReady: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<any>
  execute: (delay?: number, ...args: any[]) => Promise<T>
}

export function useAsyncState<T>(
  promise: (...args: any[]) => Promise<T>,
  initialState?: T,
  options: UseAsyncStateOptions<T> = {}
): UseAsyncStateReturn<T> {
  const { immediate = true, resetOnExecute = true, delay = 0 } = options

  const state = ref<T | undefined>(initialState)
  const isReady = ref(false)
  const isLoading = ref(false)
  const error = ref<any>(null)

  const execute = async (executeDelay = delay, ...args: any[]): Promise<T> => {
    if (resetOnExecute) {
      state.value = initialState
    }

    error.value = null
    isReady.value = false
    isLoading.value = true

    if (executeDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, executeDelay))
    }

    try {
      const result = await promise(...args)
      state.value = result
      isReady.value = true
      return result
    } catch (e) {
      error.value = e
      throw e
    } finally {
      isLoading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    state: state as Ref<T | undefined>,
    isReady,
    isLoading,
    error,
    execute,
  }
}
