<template>
  <div class="specialist-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
              rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer"
       @click="viewProfile">
    <!-- Header with Avatar and Basic Info -->
    <div class="specialist-header flex items-start space-x-4 mb-4">
      <!-- Avatar -->
      <div class="specialist-avatar flex-shrink-0">
        <img
          v-if="specialist.avatarUrl"
          :src="specialist.avatarUrl"
          :alt="specialist.displayName"
          class="w-16 h-16 rounded-full object-cover"
        >
        <div
          v-else
          class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                 flex items-center justify-center text-white text-xl font-bold"
        >
          {{ initials }}
        </div>
      </div>

      <!-- Basic Info -->
      <div class="specialist-info flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="min-w-0 flex-1">
            <h3 class="specialist-name text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ specialist.displayName }}
            </h3>
          </div>
        </div>
        
        <!-- Superpower -->
        <p class="specialist-superpower text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {{ specialist.superpower }}
        </p>
      </div>
    </div>

    <!-- Skills and Specializations -->
    <div class="specialist-skills mb-4">
      <div class="flex flex-wrap gap-2">
        <!-- Specializations -->
        <span
          v-for="specialization in specialist.specializations"
          :key="`spec-${specialization}`"
          class="inline-flex items-center px-2 py-1 text-xs font-medium 
                 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md"
        >
          {{ specialization }}
        </span>
        
        <!-- Abilities (limited to first 2) -->
        <span
          v-for="ability in limitedAbilities"
          :key="`ability-${ability}`"
          class="inline-flex items-center px-2 py-1 text-xs font-medium 
                 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md"
        >
          {{ ability }}
        </span>
        
        <!-- Show more indicator -->
        <span
          v-if="hasMoreSkills"
          class="inline-flex items-center px-2 py-1 text-xs font-medium 
                 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
        >
          +{{ remainingSkillsCount }} еще
        </span>
      </div>
    </div>

    <!-- Services -->
    <div class="specialist-services mb-4">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Услуги:</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="service in limitedServices"
          :key="service.name"
          class="inline-flex items-center px-2 py-1 text-xs font-medium 
                 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md"
        >
          {{ service.name }} — {{ formatPrice(service) }}
        </span>
        
        <!-- Show more services indicator -->
        <span
          v-if="hasMoreServices"
          class="inline-flex items-center px-2 py-1 text-xs font-medium 
                 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
        >
          +{{ remainingServicesCount }} услуг
        </span>
      </div>
    </div>

    <!-- Metadata Row -->
    <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
      <div class="flex items-center space-x-4">
      </div>
      <div class="text-xs">
        {{ lastActiveText }}
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
      <div class="flex items-center space-x-2">
        <button
          @click.stop="viewProfile"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 
                 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40 
                 dark:hover:bg-blue-900/60 rounded-md transition-colors focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Профиль
        </button>
        
        <button
          @click.stop="viewProfileModal"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 
                 bg-gray-50 hover:bg-gray-100 dark:text-gray-200 dark:bg-gray-600 
                 dark:hover:bg-gray-500 rounded-md transition-colors focus:outline-none 
                 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Быстрый просмотр
        </button>
      </div>
      
      <div class="flex items-center space-x-1">
        <ContactButtons
          :contacts="specialist.contacts"
          :specialist-name="specialist.displayName"
          size="xs"
          :show-save="false"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { SpecialistProfile } from '@/types/specialist-search'
import ContactButtons from './ContactButtons.vue'

interface Props {
  specialist: SpecialistProfile
}

interface Emits {
  (e: 'view-profile', specialist: SpecialistProfile): void
  (e: 'view-profile-modal', specialist: SpecialistProfile): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// Computed properties
const initials = computed(() => {
  return props.specialist.displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const limitedAbilities = computed(() => {
  return props.specialist.abilities.slice(0, 2)
})

const limitedServices = computed(() => {
  return props.specialist.services.slice(0, 2)
})

const hasMoreSkills = computed(() => {
  const totalSkills = props.specialist.specializations.length + props.specialist.abilities.length
  const shownSkills = props.specialist.specializations.length + limitedAbilities.value.length
  return totalSkills > shownSkills
})

const remainingSkillsCount = computed(() => {
  const totalSkills = props.specialist.specializations.length + props.specialist.abilities.length
  const shownSkills = props.specialist.specializations.length + limitedAbilities.value.length
  return totalSkills - shownSkills
})

const hasMoreServices = computed(() => {
  return props.specialist.services.length > 2
})

const remainingServicesCount = computed(() => {
  return props.specialist.services.length - 2
})

const lastActiveText = computed(() => {
  const lastActive = new Date(props.specialist.lastActive)
  const now = new Date()
  const diffMs = now.getTime() - lastActive.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 60) {
    return `${diffMinutes} мин назад`
  } else if (diffHours < 24) {
    return `${diffHours} ч назад`
  } else if (diffDays < 7) {
    return `${diffDays} дн назад`
  } else {
    return lastActive.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }
})

// Methods
const formatPrice = (service: SpecialistProfile['services'][0]): string => {
  if (typeof service.price === 'string') {
    return service.price
  }

  const formattedPrice = service.price.toLocaleString('ru-RU')

  switch (service.priceType) {
    case 'hourly':
      return `${formattedPrice} ₽/час`
    case 'project':
      return `${formattedPrice} ₽/проект`
    case 'fixed':
      return `${formattedPrice} ₽`
    case 'negotiable':
      return 'Договорная'
    default:
      return `${formattedPrice} ₽`
  }
}

const viewProfile = (): void => {
  // Navigate to profile view page
  router.push(`/specialist/${props.specialist.id}`)
  
  // Also emit event for parent components
  // emit('view-profile', props.specialist)
}

const viewProfileModal = (): void => {
  // Emit event to open modal
  emit('view-profile-modal', props.specialist)
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Hover effects */
.specialist-card {
  transition: all 0.2s ease-in-out;
}

.specialist-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.dark .specialist-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Avatar gradient variations */
.specialist-avatar div {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.specialist-avatar div:nth-child(odd) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.specialist-avatar div:nth-child(even) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* Status badge animations */
.specialist-info span {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .specialist-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .specialist-header .specialist-info {
    margin-top: 1rem;
  }
  
  .specialist-skills {
    justify-content: center;
  }
}
</style>