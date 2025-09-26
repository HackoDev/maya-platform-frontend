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
          <!-- Create Vacancy Button (only visible for clients) -->
          <button
            v-if="session.isAuthenticated.value && session.currentUser.value?.userType === 'client'"
            @click="$emit('create-vacancy')"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
          >
            <PlusIcon class="h-4 w-4 mr-1" />
            Создать вакансию
          </button>

          <!-- Specialist Portfolio Status Button -->
          <button
            v-if="session.isAuthenticated.value && session.currentUser.value?.userType === 'specialist'"
            @click="goToSpecialistQuestionnaire"
            class="inline-flex items-center px-4 py-1.5 border text-sm font-semibold rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            :class="portfolioStatusButton.classes"
            title="Перейти к анкете специалиста"
          >
            <span class="inline-block h-2 w-2 rounded-full mr-2" :class="portfolioStatusButton.dot"></span>
            {{ portfolioStatusButton.text }}
          </button>
          
          <UserProfileSection v-if="session.isAuthenticated.value" :user="session.currentUser.value" />
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
      :user="session.currentUser.value"
      @close="navigationStore.closeMobileMenu"
    />
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bars3Icon, XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useGlobalSession } from '@/composables/useSession'
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

const emit = defineEmits<{
  (e: 'create-vacancy'): void
}>()

const route = useRoute()
const router = useRouter()
const session = useGlobalSession()
const navigationStore = useNavigationStore()

// Computed properties
const visibleNavigationItems = computed(() => {
  const userType = session.currentUser.value?.userType;
  return navigationStore.getVisibleNavigationItems().filter(item => {
    // check if nav item has specific user type limitation
    if (!!item.userType && item.userType !== userType) {
      return false;
    }
    // Show all items if user is authenticated, or only non-auth required items if not
    return !item.requiresAuth || session.isAuthenticated.value
  })
})

const isActiveRoute = (path: string) => {
  return route.path === path
}

// Portfolio status badge/button (specialists only)
const portfolioStatus = computed(() => session.currentUser.value?.portfolioStatus ?? null)
const portfolioStatusButton = computed(() => {
  const status = portfolioStatus.value
  if (status === 'published') {
    return {
      text: 'Анкета: опубликована',
      classes: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-600',
      dot: 'bg-white'
    }
  }
  if (status === 'draft') {
    return {
      text: 'Анкета: черновик',
      classes: 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600',
      dot: 'bg-white'
    }
  }
  if (status === 'archived') {
    return {
      text: 'Анкета: архивирована',
      classes: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-600',
      dot: 'bg-white'
    }
  }
  return {
    text: 'Анкета: не создана',
    classes: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-600',
    dot: 'bg-white'
  }
})

const goToSpecialistQuestionnaire = () => {
  router.push('/profile/neural-network')
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