<template>
  <div class="profile-header bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-black bg-opacity-10">
      <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
    </div>
    
    <!-- Content -->
    <div class="relative container mx-auto px-4 py-8 lg:py-12">
      <div class="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
        <!-- Avatar Section -->
        <div class="flex-shrink-0">
          <div class="relative">
            <img
              v-if="basicInfo.avatarUrl"
              :src="basicInfo.avatarUrl"
              :alt="basicInfo.displayName"
              class="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl"
            />
            <div
              v-else
              class="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 backdrop-blur-sm
                     flex items-center justify-center text-white text-2xl sm:text-4xl lg:text-5xl font-bold
                     border-4 border-white/20 shadow-2xl"
            >
              {{ userInitials }}
            </div>
            
            <!-- Status Indicator -->
            <div class="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 lg:bottom-3 lg:right-3">
              <div
                class="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full border-2 sm:border-3 border-white flex items-center justify-center"
                :class="statusClasses"
              >
                <div class="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full" :class="statusDotClasses"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Info Section -->
        <div class="flex-1 text-center lg:text-left min-w-0 max-w-4xl">
          <!-- Name and Title -->
          <div class="mb-4 lg:mb-6">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words leading-tight">
              {{ basicInfo.displayName }}
            </h1>
            <p class="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed">
              {{ basicInfo.superpower }}
            </p>
          </div>

          <!-- Stats Row -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6 mb-4 lg:mb-6">
            <!-- Last Active -->
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-white/90 text-xs sm:text-sm">
                {{ lastActiveText }}
              </span>
            </div>
            
            <!-- Open to Offers Indicator -->
            <div v-if="basicInfo.isOpenToOffers" class="flex items-center space-x-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-white/90 text-xs sm:text-sm font-medium">
                Открыт к предложениям
              </span>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="mb-4 lg:mb-6">
            <span
              class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
              :class="statusBadgeClasses"
            >
              <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2" :class="statusDotClasses"></span>
              {{ statusText }}
            </span>
          </div>
        </div>

        <!-- Contact Actions -->
        <div class="flex-shrink-0 w-full lg:w-auto">
          <ContactButtons
            :contacts="contacts"
            :specialist-name="basicInfo.displayName"
            variant="header"
            class="justify-center lg:justify-end"
          />
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32">
      <div class="w-full h-full bg-white/5 rounded-full"></div>
    </div>
    <div class="absolute bottom-0 left-0 w-48 h-48 transform -translate-x-24 translate-y-24">
      <div class="w-full h-full bg-white/5 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileHeaderProps } from '@/types/specialist-profile-view'
import ContactButtons from '@/components/search/ContactButtons.vue'

interface Props {
  basicInfo: ProfileHeaderProps['basicInfo']
  contacts: ProfileHeaderProps['contacts']
}

const props = defineProps<Props>()

// Computed properties
const userInitials = computed(() => {
  return props.basicInfo.displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const lastActiveText = computed(() => {
  const lastActive = new Date(props.basicInfo.lastActive)
  const now = new Date()
  const diffMs = now.getTime() - lastActive.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 60) {
    return `активен ${diffMinutes} мин назад`
  } else if (diffHours < 24) {
    return `активен ${diffHours} ч назад`
  } else if (diffDays < 7) {
    return `активен ${diffDays} дн назад`
  } else {
    return `активен ${lastActive.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })}`
  }
})

const statusClasses = computed(() => {
  switch (props.basicInfo.status) {
    case 'available':
      return 'bg-green-500'
    case 'busy':
      return 'bg-yellow-500'
    case 'unavailable':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
})

const statusDotClasses = computed(() => {
  switch (props.basicInfo.status) {
    case 'available':
      return 'bg-green-400'
    case 'busy':
      return 'bg-yellow-400'
    case 'unavailable':
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
})

const statusBadgeClasses = computed(() => {
  switch (props.basicInfo.status) {
    case 'available':
      return 'bg-green-500/20 text-green-100 border border-green-400/30'
    case 'busy':
      return 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
    case 'unavailable':
      return 'bg-red-500/20 text-red-100 border border-red-400/30'
    default:
      return 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
  }
})

const statusText = computed(() => {
  switch (props.basicInfo.status) {
    case 'available':
      return 'Доступен для проектов'
    case 'busy':
      return 'Занят, ограниченная доступность'
    case 'unavailable':
      return 'Не принимает новые проекты'
    default:
      return 'Статус неизвестен'
  }
})
</script>

<style scoped>
/* Ensure gradient background covers full width */
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Enhanced glass morphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .profile-header {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  .profile-header .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

/* Status indicator animations */
.status-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Star rating animation */
.star-rating svg {
  transition: color 0.2s ease;
}

/* Contact buttons spacing override for header variant */
.contact-buttons-header {
  gap: 0.75rem;
}

/* Improved mobile spacing */
@media (max-width: 1024px) {
  .profile-header .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>