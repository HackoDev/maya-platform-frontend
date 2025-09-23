<template>
  <div class="relative" ref="profileRef">
    <!-- Desktop User Profile with Dropdown -->
    <div class="hidden lg:block">
      <!-- Clickable User Profile Trigger -->
      <button
        @click="toggleDropdown"
        :aria-expanded="isDropdownOpen"
        aria-haspopup="true"
        aria-label="User profile menu"
        class="group flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <!-- User Avatar -->
        <img
          v-if="user?.avatar"
          :src="user.avatar"
          :alt="userDisplayName"
          class="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
        />
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
        </div>

        <!-- Dropdown Indicator -->
        <ChevronDownIcon
          class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownOpen }"
        />
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isDropdownOpen"
          role="menu"
          aria-label="User profile options"
          class="absolute top-full right-0 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 mt-1 py-1"
        >
          <button
            @click="handleSettings"
            role="menuitem"
            class="flex items-center w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
          >
            <CogIcon class="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
            Настройки
          </button>
          <button
            @click="handleLogout"
            role="menuitem"
            class="flex items-center w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
            Выход
          </button>
        </div>
      </Transition>
    </div>

    <!-- Mobile User Profile -->
    <div class="lg:hidden flex items-center space-x-2">
      <!-- User Icon -->
      <img
        v-if="user?.avatar"
        :src="user.avatar"
        :alt="userDisplayName"
        class="h-6 w-6 rounded-full object-cover"
      />
      <UserIcon v-else class="h-6 w-6 text-gray-400 dark:text-gray-300" />

      <!-- User Name -->
      <span class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-20">
        {{ user?.firstName }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon,
  CogIcon,
} from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

interface Props {
  user?: User | null
}

const props = defineProps<Props>()
const router = useRouter()
const userStore = useUserStore()

// Dropdown state
const isDropdownOpen = ref(false)
const profileRef = ref<HTMLElement>()

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

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleSettings = () => {
  closeDropdown()
  router.push('/profile/settings')
}

const handleLogout = async () => {
  closeDropdown()
  await userStore.logoutWithRedirect('/login')
}

const handleClickOutside = (event: Event) => {
  if (profileRef.value && !profileRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
