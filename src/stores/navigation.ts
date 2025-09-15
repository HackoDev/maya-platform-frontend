import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import type { NavigationItem, NavigationStoreState, NavigationStoreActions } from '@/types'

export const useNavigationStore = defineStore(
  'navigation',
  (): NavigationStoreState & NavigationStoreActions => {
    const isMobileMenuOpen = ref(false)
    const activeRoute = ref('')

    // Define the navigation items according to the design
    const navigationItems = ref<NavigationItem[]>([
      {
        id: 'my-profile',
        label: 'Мой профиль',
        route: '/profile',
        icon: 'user-circle',
        requiresAuth: true,
        visible: true,
      },
      {
        id: 'vacancies',
        label: 'Вакансии',
        route: '/vacancies',
        icon: 'briefcase',
        requiresAuth: true,
        visible: true,
      },
      {
        id: 'specialists',
        label: 'Специалисты',
        route: '/search/specialists',
        icon: 'magnifying-glass',
        requiresAuth: true,
        visible: true,
      },
      {
        id: 'support',
        label: 'Поддержка',
        route: '/support',
        icon: 'question-mark-circle',
        requiresAuth: true,
        visible: true,
      },
    ])

    // Computed property to get visible navigation items
    const visibleNavigationItems = computed(() => {
      return navigationItems.value.filter(item => item.visible)
    })

    // Actions
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const setActiveRoute = (route: string) => {
      activeRoute.value = route
    }

    const getVisibleNavigationItems = (): NavigationItem[] => {
      return visibleNavigationItems.value
    }

    // Update active route when route changes
    const updateActiveRoute = () => {
      const route = useRoute()
      activeRoute.value = route.path
    }

    return {
      isMobileMenuOpen,
      activeRoute,
      navigationItems,
      toggleMobileMenu,
      closeMobileMenu,
      setActiveRoute,
      getVisibleNavigationItems,
      updateActiveRoute,
    }
  }
)