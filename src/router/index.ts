import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Lazy-loaded pages
const HomePage = () => import('@/pages/HomePage.vue')
const AboutPage = () => import('@/pages/AboutPage.vue')
const DashboardPage = () => import('@/pages/DashboardPage.vue')
const LoginPage = () => import('@/pages/LoginPage.vue')
const ProfilePage = () => import('@/pages/ProfilePage.vue')
const ChangePasswordPage = () => import('@/pages/ChangePasswordPage.vue')
const SearchSpecialistsPage = () => import('@/pages/SearchSpecialistsPage.vue')
const SupportPage = () => import('@/pages/SupportPage.vue')
const SupportTicketDialogPage = () => import('@/pages/SupportTicketDialogPage.vue')
const NeuralNetworkProfilePage = () => import('@/pages/NeuralNetworkProfilePage.vue')
const SpecialistProfileViewPage = () => import('@/pages/SpecialistProfileViewPage.vue')
const MyVacanciesPage = () => import('@/pages/MyVacanciesPage.vue')
const VacancyDetailPage = () => import('@/pages/VacancyDetailPage.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Home',
      requiresAuth: false,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: {
      title: 'About',
      requiresAuth: false,
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
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
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
    path: '/profile/change-password',
    name: 'ChangePassword',
    component: ChangePasswordPage,
    meta: {
      title: 'Смена пароля',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/neural-network',
    name: 'NeuralNetworkProfile',
    component: NeuralNetworkProfilePage,
    meta: {
      title: 'Анкета нейросетевого специалиста',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/vacancies',
    name: 'MyVacancies',
    component: MyVacanciesPage,
    meta: {
      title: 'Мои вакансии',
      requiresAuth: true,
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
    },
  },
  {
    path: '/search/specialists',
    name: 'SearchSpecialists',
    component: SearchSpecialistsPage,
    meta: {
      title: 'Поиск специалиста',
      requiresAuth: true,
    },
  },
  {
    path: '/specialist/:id',
    name: 'SpecialistProfile',
    component: SpecialistProfileViewPage,
    props: true,
    meta: {
      title: 'Профиль специалиста',
      requiresAuth: false,
    },
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportPage,
    meta: {
      title: 'Поддержка',
      requiresAuth: false,
    },
  },
  {
    path: '/support/tickets/:id',
    name: 'SupportTicketDialog',
    component: SupportTicketDialogPage,
    props: true,
    meta: {
      title: 'Support Ticket',
      requiresAuth: false,
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
    next({ name: 'Dashboard' })
    return
  }

  // Check if user is trying to access vacancies page but is not a client
  if (to.name === 'MyVacancies' && userStore.currentUser?.userType !== 'client') {
    next({ name: 'Profile' })
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