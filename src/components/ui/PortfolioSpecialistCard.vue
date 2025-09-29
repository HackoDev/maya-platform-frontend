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

    <!-- Portfolio Info -->
    <div class="portfolio-info mb-4">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ portfolio.title }}</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ portfolio.description }}</p>
      
      <div v-if="portfolio.tools && portfolio.tools.length" class="mt-2">
        <div class="flex flex-wrap gap-1">
          <!-- <span 
            v-for="(tool, index) in portfolio.tools.slice(0, 3)" 
            :key="index"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
          >
            {{ tool }}
          </span> -->
          <!-- <span 
            v-if="portfolio.tools.length > 3"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            +{{ portfolio.tools.length - 3 }}
          </span> -->
        </div>
      </div>
    </div>

    <!-- Skills and Specializations -->
    <div class="specialist-skills mb-4">
      <div class="flex flex-wrap gap-2">
        <!-- Specializations -->
        <span
          v-for="specialization in limitedSpecializations"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PortfolioCase } from '@/types/specialist-profile-view'
import type { SpecialistProfile } from '@/types/specialist-search'

interface ExtendedPortfolioCase extends PortfolioCase {
  specialistId?: string
}

interface Props {
  portfolio: ExtendedPortfolioCase
  specialist: SpecialistProfile
}

const props = defineProps<Props>()
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

const limitedSpecializations = computed(() => {
  return props.specialist.specializations.slice(0, 2)
})

const hasMoreSkills = computed(() => {
  const totalSkills = props.specialist.specializations.length + props.specialist.abilities.length
  const shownSkills = props.specialist.specializations.length + limitedAbilities.value.length
  return totalSkills > shownSkills
})

const remainingSkillsCount = computed(() => {
  const totalSkills = props.specialist.specializations.length + props.specialist.abilities.length
  const shownSkills = limitedSpecializations.value.length + limitedAbilities.value.length
  return totalSkills - shownSkills
})

// Methods
const viewProfile = (): void => {
  // Navigate to profile view page
  router.push({
    name: 'SpecialistProfile',
    params: { id: props.specialist.id }
  })
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
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