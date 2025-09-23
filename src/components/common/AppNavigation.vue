<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-primary-600">Maya Platform</span>
          </router-link>

          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="
                isActiveRoute(item.to)
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="userStore.isAuthenticated">
            <span class="text-sm text-gray-700">{{ userStore.currentUser?.name }}</span>
            <button
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              @click="handleLogout"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
]

const isActiveRoute = (path: string) => {
  return route.path === path
}

const handleLogout = async () => {
  await userStore.logoutWithRedirect('/login')
}
</script>
