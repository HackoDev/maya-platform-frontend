import { ref, type Ref } from 'vue'

interface ApiState<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
}

interface UseApiOptions {
  immediate?: boolean
}

export function useApi<T>(options: UseApiOptions = {}): ApiState<T> & {
  execute: (apiCall: () => Promise<T>) => Promise<void>
  reset: () => void
} {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (apiCall: () => Promise<T>) => {
    loading.value = true
    error.value = null

    try {
      data.value = await apiCall()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('API Error:', err)
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    execute,
    reset,
  }
}
