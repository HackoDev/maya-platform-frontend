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
            <!-- Open to Offers Indicator -->
            <div class="flex items-center space-x-2">
              <svg 
                v-if="basicInfo.isOpenToOffers"
                class="w-4 h-4 sm:w-5 sm:h-5 text-green-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg 
                v-else
                class="w-4 h-4 sm:w-5 sm:h-5 text-red-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span 
                class="text-xs sm:text-sm font-medium"
                :class="basicInfo.isOpenToOffers ? 'text-white/90' : 'text-red-200'"
              >
                {{ offersStatusText }}
              </span>
            </div>
          </div>

          <!-- Status Badge - скрыт, так как теперь используется только isOpenToOffers -->
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

const offersStatusText = computed(() => {
  return props.basicInfo.isOpenToOffers ? 'Открыт к предложениям' : 'Временно не беру работу'
})

const statusClasses = computed(() => {
  // Используем isOpenToOffers вместо status
  return props.basicInfo.isOpenToOffers ? 'bg-green-500' : 'bg-red-500'
})

const statusDotClasses = computed(() => {
  // Используем isOpenToOffers вместо status
  return props.basicInfo.isOpenToOffers ? 'bg-green-400' : 'bg-red-400'
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