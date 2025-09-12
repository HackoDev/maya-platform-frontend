<template>
  <nav
    class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex justify-between items-center h-full">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-2">
          <router-link to="/" class="flex items-center">
            <MayaLogoIcon class="h-8 w-8" />
            <div class="flex flex-col ml-2">
              <span class="text-xs font-bold text-gray-900 dark:text-white leading-tight"
                >База</span
              >
              <span class="text-xs font-bold text-gray-900 dark:text-white leading-tight"
                >Вакансий</span
              >
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex space-x-8">
          <router-link
            v-for="item in visibleNavigationItems"
            :key="item.id"
            :to="item.route"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="{
              'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': isActiveRoute(
                item.route
              ),
            }"
          >
            {{ item.label }}
          </router-link>
        </div>

        <!-- User Section -->
        <div class="flex items-center space-x-4">
          <UserProfileSection v-if="userStore.isAuthenticated" :user="userStore.currentUser" />
          <template v-else>
            <router-link
              to="/login"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Войти
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :aria-expanded="navigationStore.isMobileMenuOpen"
          @click="navigationStore.toggleMobileMenu"
        >
          <Bars3Icon v-if="!navigationStore.isMobileMenuOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <MobileNavigationMenu
      :is-open="navigationStore.isMobileMenuOpen"
      :navigation-items="visibleNavigationItems"
      :user="userStore.currentUser"
      @close="navigationStore.closeMobileMenu"
    />
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import { useNavigationStore } from '@/stores/navigation'
import UserProfileSection from './UserProfileSection.vue'
import MobileNavigationMenu from './MobileNavigationMenu.vue'
import MayaLogoIcon from '@/components/icons/MayaLogoIcon.vue'
import type { TopNavbarProps } from '@/types'

interface Props extends TopNavbarProps {
  serviceName?: string
  logoUrl?: string
  theme?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), {
  serviceName: 'Maya Platform',
  theme: 'light',
})

const route = useRoute()
const userStore = useUserStore()
const navigationStore = useNavigationStore()

// Computed properties
const visibleNavigationItems = computed(() => {
  return navigationStore.getVisibleNavigationItems().filter(item => {
    // Show all items if user is authenticated, or only non-auth required items if not
    return !item.requiresAuth || userStore.isAuthenticated
  })
})

const isActiveRoute = (path: string) => {
  return route.path === path
}

// Watch route changes to update active route in store
watch(
  () => route.path,
  newPath => {
    navigationStore.setActiveRoute(newPath)
  },
  { immediate: true }
)

// Close mobile menu when route changes
watch(
  () => route.path,
  () => {
    navigationStore.closeMobileMenu()
  }
)

onMounted(() => {
  navigationStore.setActiveRoute(route.path)
})
</script>
