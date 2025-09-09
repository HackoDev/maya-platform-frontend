import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface UseLocalStorageOptions<T> {
  defaultValue?: T
  serializer?: {
    read: (value: string) => T
    write: (value: T) => string
  }
}

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): [Ref<T>, (value: T) => void, () => void] {
  const {
    defaultValue,
    serializer = {
      read: JSON.parse,
      write: JSON.stringify,
    },
  } = options

  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? serializer.read(storedValue) : defaultValue

  const data = ref(initialValue) as Ref<T>

  const setValue = (value: T) => {
    try {
      data.value = value
      localStorage.setItem(key, serializer.write(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    try {
      localStorage.removeItem(key)
      data.value = defaultValue as T
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  // Listen for changes in other tabs/windows
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== null) {
      try {
        data.value = serializer.read(e.newValue)
      } catch (error) {
        console.error(`Error parsing localStorage value for key "${key}":`, error)
      }
    }
  }

  onMounted(() => {
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return [data, setValue, removeValue]
}
