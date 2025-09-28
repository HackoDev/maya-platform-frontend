<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Halogen Effect -->
      <div 
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-0 animate-halogen-glow"
        :class="isAnimationComplete ? 'opacity-0' : 'opacity-30'"
      >
        <div class="w-full h-full bg-gradient-radial from-cyan-400/20 via-blue-500/10 to-transparent rounded-full blur-xl"></div>
      </div>

      <!-- Animated Rays -->
      <div 
        v-for="ray in rays" 
        :key="ray.id"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        :style="ray.style"
      >
        <div 
          class="w-px h-32 bg-gradient-to-b from-cyan-400/60 via-blue-300/40 to-transparent opacity-0 animate-ray-appear"
          :style="{ animationDelay: ray.delay }"
        ></div>
      </div>

      <!-- Scanning Lines -->
      <div 
        v-for="line in scanningLines" 
        :key="line.id"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        :style="line.style"
      >
        <div 
          class="w-64 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 animate-scan-line"
          :style="{ animationDelay: line.delay }"
        ></div>
      </div>
    </div>

    <!-- Logo and Title -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center">
        <MayaLogoIcon 
          class="h-12 w-12 text-purple-600 opacity-0 animate-logo-appear" 
          :class="isAnimationComplete ? 'opacity-100' : 'opacity-0'"
        />
      </div>
      <h2 
        class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white opacity-0 animate-title-appear"
        :class="isAnimationComplete ? 'opacity-100' : 'opacity-0'"
      >
        Вход в систему
      </h2>
      <p 
        class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 opacity-0 animate-subtitle-appear"
        :class="isAnimationComplete ? 'opacity-100' : 'opacity-0'"
      >
        Используйте предопределенные учетные записи для тестирования
      </p>
    </div>

    <!-- Login Form -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div 
        class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 relative overflow-hidden"
        :class="[
          isAnimationComplete ? 'opacity-100' : 'opacity-0',
          isLoginSuccessful ? 'animate-form-hide' : 'animate-form-appear'
        ]"
      >
        <!-- Login Form -->
        <form 
          v-if="!isLoginSuccessful"
          class="space-y-6 transition-all duration-500"
          :class="isLoginSuccessful ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'"
          @submit.prevent="handleSubmit"
        >
          <BaseInput v-model="form.email" type="email" label="Адрес электронной почты" required />

          <BaseInput v-model="form.password" type="password" label="Пароль" required />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.remember"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Запомнить меня
              </label>
            </div>

            <div class="text-sm">
              <router-link
                to="/reset-password"
                class="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Забыли пароль?
              </router-link>
            </div>
          </div>

          <BaseButton type="submit" class="w-full" :disabled="session.isLoading.value">
            {{ session.isLoading.value ? 'Вход...' : 'Войти' }}
          </BaseButton>

          <div v-if="session.error.value" class="text-red-600 dark:text-red-400 text-sm text-center">
            {{ session.error.value }}
          </div>
        </form>

        <!-- Welcome Message -->
        <div 
          v-if="isLoginSuccessful"
          class="text-center space-y-6 animate-welcome-appear"
        >
          <!-- Success Icon -->
          <div class="flex justify-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-success-pulse shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <!-- Welcome Message -->
          <div class="space-y-3 animate-welcome-content">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Добро пожаловать!
            </h3>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Привет, {{ session.currentUser.value?.name || 'Пользователь' }}!
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Вы успешно вошли в систему
            </p>
          </div>

          <!-- Loading indicator -->
          <div class="flex justify-center">
            <div class="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalSession } from '@/composables/useSession'
import { authApi } from '@/services/authApiClient'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MayaLogoIcon from '@/components/icons/MayaLogoIcon.vue'

const router = useRouter()
const session = useGlobalSession()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

// Animation state
const isAnimationComplete = ref(false)
const isLoginSuccessful = ref(false)

// Timeout reference for cleanup
let redirectTimeout: number | null = null

// Generate rays data
const rays = computed(() => {
  const rayCount = 12
  const rays = []
  
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * 360) / rayCount
    const delay = `${i * 0.1}s`
    
    rays.push({
      id: i,
      style: {
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      },
      delay
    })
  }
  
  return rays
})

// Generate scanning lines data
const scanningLines = computed(() => {
  const lineCount = 4
  const lines = []
  
  for (let i = 0; i < lineCount; i++) {
    const angle = (i * 90) + 45 // 45, 135, 225, 315 degrees
    const delay = `${0.8 + i * 0.2}s`
    
    lines.push({
      id: i,
      style: {
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      },
      delay
    })
  }
  
  return lines
})

// Animation timing
onMounted(() => {
  // Complete animation after 2 seconds
  setTimeout(() => {
    isAnimationComplete.value = true
  }, 2000)
})

// Cleanup timeout when component is unmounted
onUnmounted(() => {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout)
    redirectTimeout = null
  }
})

const handleRedirect = () => {
  // Check if we're still on the login page before redirecting
  if (router.currentRoute.value.name === 'Login') {
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/')
  }
}

const handleSubmit = async () => {
  try {
    const success = await session.login(form.value.email, form.value.password)
    
    if (success) {
      // Ensure we have fresh user data (re-fetch /users/me if stale)
      try {
        const freshUser = await authApi.ensureFreshUser()
        if (freshUser) {
          // session will pick up from auth storage on next sync
        }
      } catch (e) {
        // non-fatal
      }
      // Show success animation
      isLoginSuccessful.value = true
      
      // Redirect after showing welcome message
      redirectTimeout = setTimeout(() => {
        handleRedirect()
      }, 2500) // Show welcome for 2.5 seconds
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

</script>

<style scoped>
/* Custom gradient for radial background */
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}

/* Halogen glow animation */
@keyframes halogen-glow {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  30% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  70% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.animate-halogen-glow {
  animation: halogen-glow 1.5s ease-in-out forwards;
}

/* Ray appear animation */
@keyframes ray-appear {
  0% {
    opacity: 0;
    transform: scaleY(0);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform: scaleY(1);
  }
}

.animate-ray-appear {
  animation: ray-appear 0.8s ease-out forwards;
}

/* Scan line animation */
@keyframes scan-line {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
  100% {
    opacity: 0;
    transform: scaleX(1);
  }
}

.animate-scan-line {
  animation: scan-line 0.6s ease-out forwards;
}

/* Logo appear animation */
@keyframes logo-appear {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-logo-appear {
  animation: logo-appear 0.8s ease-out 1.2s forwards;
}

/* Title appear animation */
@keyframes title-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-title-appear {
  animation: title-appear 0.6s ease-out 1.4s forwards;
}

/* Subtitle appear animation */
@keyframes subtitle-appear {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-subtitle-appear {
  animation: subtitle-appear 0.6s ease-out 1.6s forwards;
}

/* Form appear animation */
@keyframes form-appear {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-form-appear {
  animation: form-appear 0.8s ease-out 1.8s forwards;
}

/* Form hide animation */
@keyframes form-hide {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.animate-form-hide {
  animation: form-hide 0.5s ease-in-out forwards;
}

/* Welcome message animations */
@keyframes welcome-appear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-welcome-appear {
  animation: welcome-appear 0.8s ease-out forwards;
}

/* Success pulse animation */
@keyframes success-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
}

.animate-success-pulse {
  animation: success-pulse 2s ease-in-out infinite;
}

/* Welcome content animation - all elements appear together */
@keyframes welcome-content {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-welcome-content {
  animation: welcome-content 0.6s ease-out forwards;
}

/* Ensure smooth transitions */
* {
  transition: opacity 0.3s ease;
}
</style>
