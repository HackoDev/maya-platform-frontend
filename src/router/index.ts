import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useGlobalSession } from '@/composables/useSession'
import { useUserStore } from '@/stores/user'

// Lazy-loaded pages
const HomePage = () => import('@/pages/HomePage.vue')
// DashboardPage removed as part of Home page enhancement
const LoginPage = () => import('@/pages/LoginPage.vue')
const ResetPasswordPage = () => import('@/pages/ResetPasswordPage.vue')
const ProfilePage = () => import('@/pages/ProfilePage.vue')
const ProfileSettingsPage = () => import('@/pages/ProfileSettingsPage.vue')
const SearchSpecialistsPage = () => import('@/pages/SearchSpecialistsPage.vue')
const SupportPage = () => import('@/pages/SupportPage.vue')
const SupportTicketDialogPage = () => import('@/pages/SupportTicketDialogPage.vue')
const NeuralNetworkProfilePage = () => import('@/pages/NeuralNetworkProfilePage.vue')
const SpecialistProfileViewSimplePage = () => import('@/pages/SpecialistProfileViewSimplePage.vue')
const MyVacanciesPage = () => import('@/pages/MyVacanciesPage.vue')
const AllVacanciesPage = () => import('@/pages/AllVacanciesPage.vue')
const VacancyDetailPage = () => import('@/pages/VacancyDetailPage.vue')
const AllInvitationsPage = () => import('@/pages/AllInvitationsPage.vue')
const InviteRegistrationPage = () => import('@/pages/InviteRegistrationPage.vue')
const ServiceInfoPage = () => import('@/pages/ServiceInfoPage.vue')

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
    path: '/service-info',
    name: 'ServiceInfo',
    component: ServiceInfoPage,
    meta: {
      title: 'О сервисе и согласия',
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
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage,
    meta: {
      title: 'Сброс пароля',
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
      specialistDenied: false,
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
    path: '/invitations',
    name: 'AllInvitations',
    component: AllInvitationsPage,
    meta: {
      title: 'Приглашения в систему',
      requiresAuth: true,
      clientDenied: true,
      specialistDenied: true,
      fallbackRedirect: 'Home'
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
    component: SpecialistProfileViewSimplePage,
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
    path: '/invite/:id',
    name: 'InviteRegistration',
    component: InviteRegistrationPage,
    props: true,
    meta: {
      title: 'Регистрация по приглашению',
      requiresAuth: false,
      hideForAuth: true,
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
router.beforeEach(async (to, _from, next) => {
  try {
    const session = useGlobalSession()

    // Wait for session initialization if it's still loading
    if (session.isLoading.value) {
      console.log('⏳ Waiting for session initialization...')
      
      // Wait for session to be initialized using a Promise with timeout
      try {
        await new Promise<void>((resolve) => {
          let attempts = 0
          const maxAttempts = 50 // 5 seconds max wait time (50 * 100ms)
          
          const checkInitialization = () => {
            attempts++
            
            if (!session.isLoading.value) {
              resolve()
            } else if (attempts >= maxAttempts) {
              console.warn('⚠️ Session initialization timeout, proceeding anyway')
              resolve() // Proceed anyway to avoid blocking navigation
            } else {
              // Still loading, check again in 100ms
              setTimeout(checkInitialization, 100)
            }
          }
          checkInitialization()
        })
      } catch (error) {
        console.error('❌ Error waiting for session initialization:', error)
        // Proceed anyway to avoid blocking navigation
      }
    }

    // If authenticated and route requires auth, ensure fresh user (with 30s TTL) before proceeding
    if (session.isAuthenticated.value && to.meta.requiresAuth) {
      try {
        const userStore = useUserStore()
        await userStore.ensureFreshCurrentUser()
        session.syncWithUserStore()
      } catch (_e) {
        // non-fatal; proceed with navigation
      }
    }

    // Session is initialized, handle navigation
    handleNavigation(to, next, session)
  } catch (error) {
    console.error('❌ Navigation guard error:', error)
    // Ensure next is always called, even on error
    next()
  }
})

function handleNavigation(to: any, next: any, session: any) {
  try {
    // Check if route requires authentication
    if (to.meta.requiresAuth && !session.isAuthenticated.value) {
      console.log('🔒 Route requires authentication, redirecting to login')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // Redirect authenticated users away from login
    if (to.meta.hideForAuth && session.isAuthenticated.value) {
      console.log('👤 User is authenticated, redirecting from login page')
      next({ name: 'Home' })
      return
    }

    // Redirect specialist to home page if they are trying to access a specialist denied pages
    if (to.meta.specialistDenied && session.currentUser.value?.userType === 'specialist') {
      console.log('🚫 Specialist denied access, redirecting')
      next({ name: (to.meta.fallbackRedirect || 'Home') as string })
      return
    }

    // Redirect specialist to home page if they are trying to access a specialist denied pages
    if (!session?.currentUser?.value?.generalConsentAccepted && (!['ServiceInfo', 'Login', 'ResetPassword', 'InviteRegistration'].includes(to.name))) {
      console.log('🚫 Terms not accepted, redirecting - ')
      next({ name: 'ServiceInfo' })
      return
    }

    // Redirect client to home page if they are trying to access a client denied pages
    if (to.meta.clientDenied && session.currentUser.value?.userType === 'client') {
      console.log('🚫 Client denied access, redirecting')
      next({ name: (to.meta.fallbackRedirect || 'Home') as string })
      return
    }

    // Allow navigation
    next()
  } catch (error) {
    console.error('❌ Error in handleNavigation:', error)
    // Ensure next is always called, even on error
    next()
  }
}

// Update document title
router.afterEach(to => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | ${import.meta.env.VITE_APP_TITLE || 'MayaWork'}`
  }
})

export default router