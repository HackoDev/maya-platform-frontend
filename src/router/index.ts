import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Lazy-loaded pages
const HomePage = () => import('@/pages/HomePage.vue')
// DashboardPage removed as part of Home page enhancement
const LoginPage = () => import('@/pages/LoginPage.vue')
const ProfilePage = () => import('@/pages/ProfilePage.vue')
const ProfileSettingsPage = () => import('@/pages/ProfileSettingsPage.vue')
const SearchSpecialistsPage = () => import('@/pages/SearchSpecialistsPage.vue')
const SupportPage = () => import('@/pages/SupportPage.vue')
const SupportTicketDialogPage = () => import('@/pages/SupportTicketDialogPage.vue')
const NeuralNetworkProfilePage = () => import('@/pages/NeuralNetworkProfilePage.vue')
const SpecialistProfileViewPage = () => import('@/pages/SpecialistProfileViewPage.vue')
const MyVacanciesPage = () => import('@/pages/MyVacanciesPage.vue')
const AllVacanciesPage = () => import('@/pages/AllVacanciesPage.vue')
const VacancyDetailPage = () => import('@/pages/VacancyDetailPage.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Home',
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      title: 'Login',
      requiresAuth: false,
      hideForAuth: true,
    },
  },
  // Dashboard route removed as part of Home page enhancement
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      title: 'Мой профиль',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings',
    name: 'ProfileSettings',
    component: ProfileSettingsPage,
    meta: {
      title: 'Настройки профиля',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/neural-network',
    name: 'NeuralNetworkProfile',
    component: NeuralNetworkProfilePage,
    meta: {
      title: 'Анкета специалиста',
      requiresAuth: true,
      clientDenied: true,
    },
  },
  {
    path: '/vacancies',
    name: 'AllVacancies',
    component: AllVacanciesPage,
    meta: {
      title: 'Все вакансии',
      requiresAuth: true,
      clientDenied: true,
      fallbackRedirect: 'MyVacancies'
    },
  },
  {
    path: '/profile/vacancies',
    name: 'MyVacancies',
    component: MyVacanciesPage,
    meta: {
      title: 'Мои вакансии',
      requiresAuth: true,
      specialistDenied: true,
      fallbackRedirect: 'AllVacancies'
    },
  },
  {
    path: '/profile/vacancies/:id',
    name: 'VacancyDetail',
    component: VacancyDetailPage,
    props: true,
    meta: {
      title: 'Детали вакансии',
      requiresAuth: true,
      specialistDenied: true,
      fallbackRedirect: 'MyVacancies'
    },
  },
  {
    path: '/vacancies/:id',
    name: 'VacancyDetailPublic',
    component: VacancyDetailPage,
    props: true,
    meta: {
      title: 'Детали вакансии',
      requiresAuth: true,
    },
  },
  {
    path: '/search/specialists',
    name: 'SearchSpecialists',
    component: SearchSpecialistsPage,
    meta: {
      title: 'Поиск специалиста',
      requiresAuth: true,
      specialistDenied: true,
      fallbackRedirect: 'NeuralNetworkProfile'
    },
  },
  {
    path: '/specialist/:id',
    name: 'SpecialistProfile',
    component: SpecialistProfileViewPage,
    props: true,
    meta: {
      title: 'Профиль специалиста',
      requiresAuth: true,
      specialistDenied: true,
      fallbackRedirect: 'NeuralNetworkProfile'
    },
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportPage,
    meta: {
      title: 'Поддержка',
      requiresAuth: true,
    },
  },
  {
    path: '/support/tickets/:id',
    name: 'SupportTicketDialog',
    component: SupportTicketDialogPage,
    props: true,
    meta: {
      title: 'Support Ticket',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      title: 'Page Not Found',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Redirect authenticated users away from login
  if (to.meta.hideForAuth && userStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  // Redirect specialist to home page if they are trying to access a specialist denied pages
  if (to.meta.specialistDenied && userStore.currentUser?.userType === 'specialist') {
    next({ name: (to.meta.fallbackRedirect || 'Home') as string })
    return
  }

  // Redirect client to home page if they are trying to access a client denied pages
  if (to.meta.clientDenied && userStore.currentUser?.userType === 'client') {
    next({ name: (to.meta.fallbackRedirect || 'Home') as string })
    return
  }

  next()
})

// Update document title
router.afterEach(to => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | ${import.meta.env.VITE_APP_TITLE || 'Maya Platform'}`
  }
})

export default router