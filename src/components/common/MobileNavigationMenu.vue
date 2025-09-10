<template>
  <!-- Mobile menu overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Mobile menu panel -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-in-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300 ease-in-out"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 
             shadow-xl transform lg:hidden"
    >
      <!-- Menu Header -->
      <div
        class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <span class="text-lg font-semibold text-gray-900 dark:text-white"> Меню </span>
        <button
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 
                 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-100 
                 dark:hover:bg-gray-700 transition-colors"
          @click="$emit('close')"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Navigation Items -->
      <div class="py-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.id"
          :to="item.route"
          class="flex items-center px-4 py-3 text-base font-medium 
                 text-gray-700 dark:text-gray-300 hover:text-gray-900 
                 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 
                 border-l-4 border-transparent hover:border-blue-500 transition-colors"
          :class="{ 
            'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-500': 
            isActiveRoute(item.route) 
          }"
          @click="$emit('close')"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Logout Section (Simplified) -->
      <div
        class="absolute bottom-0 left-0 right-0 p-4 border-t 
               border-gray-200 dark:border-gray-700"
      >
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center px-4 py-3 
                 text-sm font-medium text-red-600 dark:text-red-400 
                 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 
                 dark:hover:bg-red-900/30 rounded-md transition-colors 
                 duration-150 focus:outline-none focus:ring-2 
                 focus:ring-red-500 focus:ring-offset-2"
        >
          <ArrowRightOnRectangleIcon class="h-4 w-4 mr-2" />
          Выйти
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import type { NavigationItem, User } from '@/types'

interface Props {
  isOpen: boolean
  navigationItems: NavigationItem[]
  user?: User | null
}

interface Emits {
  close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isActiveRoute = (path: string) => {
  return route.path === path
}

const handleLogout = () => {
  userStore.logout()
  emit('close')
  router.push('/login')
}
</script>