import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null)
  const userCount = computed(() => users.value.length)

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      currentUser.value = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    currentUser.value = null
    error.value = null
  }

  return {
    currentUser,
    users,
    loading,
    error,
    isAuthenticated,
    userCount,
    login,
    logout,
  }
})
