<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Welcome, {{ userStore.currentUser?.name }}</span>
            <button
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Counter Example -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">{{ counterStore.count }}</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Counter</dt>
                    <dd class="text-lg font-medium text-gray-900">
                      Count: {{ counterStore.count }} ({{ counterStore.isEven ? 'Even' : 'Odd' }})
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="mt-4 flex space-x-2">
                <button
                  class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm"
                  @click="counterStore.increment"
                >
                  +
                </button>
                <button
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  @click="counterStore.decrement"
                >
                  -
                </button>
                <button
                  class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                  @click="counterStore.reset"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <!-- User Info -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm">{{
                      userStore.currentUser?.name?.charAt(0)
                    }}</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">User Profile</dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ userStore.currentUser?.email }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm">📊</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Statistics</dt>
                    <dd class="text-lg font-medium text-gray-900">
                      Double Count: {{ counterStore.doubleCount }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCounterStore } from '@/stores/counter'

const router = useRouter()
const userStore = useUserStore()
const counterStore = useCounterStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
