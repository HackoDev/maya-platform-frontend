<template>
  <div class="relative">
    <!-- Desktop User Profile -->
    <div class="hidden lg:flex items-center space-x-3">
      <!-- User Avatar -->
      <img
        v-if="user?.avatar"
        :src="user.avatar"
        :alt="userDisplayName"
        class="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
      >
      <div
        v-else
        class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
      >
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ userInitials }}
        </span>
      </div>

      <!-- User Info -->
      <div class="flex flex-col">
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ userDisplayName }}
        </span>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                     bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          {{ userTypeLabel }}
        </span>
      </div>

      <!-- Logout Button -->
      <button
        class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 
               dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
               rounded-md transition-colors"
        title="Выйти из системы"
        @click="handleLogout"
      >
        <ArrowRightOnRectangleIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Mobile User Profile -->
    <div class="lg:hidden flex items-center space-x-2">
      <!-- User Icon -->
      <img
        v-if="user?.avatar"
        :src="user.avatar"
        :alt="userDisplayName"
        class="h-6 w-6 rounded-full object-cover"
      >
      <UserIcon v-else class="h-6 w-6 text-gray-400 dark:text-gray-300" />

      <!-- User Name -->
      <span class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-20">
        {{ user?.firstName }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

interface Props {
  user?: User | null
}

const props = defineProps<Props>()
const router = useRouter()
const userStore = useUserStore()

const userDisplayName = computed(() => {
  if (!props.user) return ''
  return `${props.user.firstName} ${props.user.lastName}`
})

const userInitials = computed(() => {
  if (!props.user) return ''
  return `${props.user.firstName.charAt(0)}${props.user.lastName.charAt(0)}`
})

const userTypeLabel = computed(() => {
  if (!props.user) return ''
  return props.user.userType === 'specialist' ? 'Специалист' : 'Клиент'
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>