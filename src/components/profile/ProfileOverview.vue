<template>
  <div class="profile-overview bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Обзор профиля
    </h2>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Specializations Count -->
      <div class="text-center">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {{ specializations.length }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Специализаций
          </div>
        </div>
      </div>

      <!-- Abilities Count -->
      <div class="text-center">
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {{ abilities.length }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Навыков
          </div>
        </div>
      </div>

      <!-- Services Count -->
      <div class="text-center">
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {{ services.length }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Услуг
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Overview -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Ключевые навыки
      </h3>
      <div class="flex flex-wrap gap-2">
        <!-- Top Specializations -->
        <span
          v-for="specialization in topSpecializations"
          :key="`spec-${specialization}`"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium 
                 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                 rounded-lg transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
        >
          {{ specialization }}
        </span>
        
        <!-- Top Abilities -->
        <span
          v-for="ability in topAbilities"
          :key="`ability-${ability}`"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium 
                 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 
                 rounded-lg transition-colors hover:bg-green-200 dark:hover:bg-green-800"
        >
          {{ ability }}
        </span>
        
        <!-- Show More Button -->
        <button
          v-if="hasMoreSkills"
          @click="showAllSkills = !showAllSkills"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium 
                 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 
                 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {{ showAllSkills ? 'Скрыть' : `+${remainingSkillsCount} еще` }}
        </button>
      </div>
    </div>

    <!-- Services Overview -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Услуги и цены
      </h3>
      <div class="space-y-3">
        <div
          v-for="service in topServices"
          :key="service.name"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ service.name }}
            </h4>
            <p v-if="service.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {{ service.description }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <span class="text-lg font-bold text-purple-600 dark:text-purple-400">
              {{ formatPrice(service) }}
            </span>
          </div>
        </div>
        
        <!-- Show More Services -->
        <button
          v-if="hasMoreServices"
          @click="showAllServices = !showAllServices"
          class="w-full py-3 text-sm font-medium text-blue-600 dark:text-blue-400 
                 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {{ showAllServices ? 'Скрыть дополнительные услуги' : `Показать еще ${remainingServicesCount} услуг` }}
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="border-t border-gray-200 dark:border-gray-600 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Быстрые действия
      </h3>
      <div class="flex flex-wrap gap-3">
        <button
          @click="scrollToSection('services')"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          Посмотреть услуги
        </button>
        
        <button
          @click="scrollToSection('portfolio')"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 
                 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 
                 rounded-lg transition-colors focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Портфолио
        </button>

        <button
          @click="scrollToSection('contacts')"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 
                 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 
                 rounded-lg transition-colors focus:outline-none focus:ring-2 
                 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Связаться
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProfileOverviewProps, ServiceDetails } from '@/types/specialist-profile-view'

interface Props {
  basicInfo: ProfileOverviewProps['basicInfo']
  specializations: ProfileOverviewProps['specializations']
  abilities: ProfileOverviewProps['abilities']
  services: ProfileOverviewProps['services']
}

const props = defineProps<Props>()

// Local state
const showAllSkills = ref(false)
const showAllServices = ref(false)

// Computed properties for skills
const topSpecializations = computed(() => {
  return showAllSkills.value ? props.specializations : props.specializations.slice(0, 3)
})

const topAbilities = computed(() => {
  return showAllSkills.value ? props.abilities : props.abilities.slice(0, 4)
})

const hasMoreSkills = computed(() => {
  return props.specializations.length > 3 || props.abilities.length > 4
})

const remainingSkillsCount = computed(() => {
  const totalSkills = props.specializations.length + props.abilities.length
  const shownSkills = Math.min(3, props.specializations.length) + Math.min(4, props.abilities.length)
  return totalSkills - shownSkills
})

// Computed properties for services
const topServices = computed(() => {
  return showAllServices.value ? props.services : props.services.slice(0, 3)
})

const hasMoreServices = computed(() => {
  return props.services.length > 3
})

const remainingServicesCount = computed(() => {
  return props.services.length - 3
})

// Methods
const formatPrice = (service: ServiceDetails): string => {
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

const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/* Enhanced hover effects */
.profile-overview .rounded-lg:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Stats cards animation */
.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: scale(1.02);
}

/* Skill tags hover effects */
.skill-tag {
  transition: all 0.2s ease;
}

.skill-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Service cards hover effects */
.service-card {
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.service-card:hover {
  border-left-color: theme('colors.purple.500');
  background-color: theme('colors.purple.50');
}

.dark .service-card:hover {
  background-color: theme('colors.purple.900/30');
  border-left-color: theme('colors.purple.400');
}

/* Button animations */
.action-button {
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .profile-overview {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-actions button {
    width: 100%;
    justify-content: center;
  }
}
</style>