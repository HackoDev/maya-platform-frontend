<template>
  <div
    class="action-card relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/20 hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
    :class="colorClasses"
    :tabindex="0"
    role="button"
    :aria-label="description"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Background gradient overlay -->
    <div 
      class="absolute inset-0 opacity-5 transition-opacity duration-200 group-hover:opacity-10"
      :class="gradientClasses"
    ></div>
    
    <!-- Content -->
    <div class="relative z-10">
      <!-- Icon and Badge Row -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <!-- Icon -->
          <div 
            class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200"
            :class="iconBgClasses"
          >
            <component 
              :is="iconComponent" 
              class="h-6 w-6 transition-colors duration-200"
              :class="iconClasses"
            />
          </div>
          
          <!-- Default Badge (optional) -->
          <span 
            v-if="badge && !moderationStatus"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            :class="badgeClasses"
          >
            {{ badge }}
          </span>
        </div>
        
        <!-- Action Arrow -->
        <ChevronRightIcon 
          v-if="!isAction"
          class="h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
      
      <!-- Moderation Status Badge -->
      <div v-if="moderationStatusConfig" class="mb-3">
        <span 
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
          :class="moderationStatusConfig.classes"
        >
          <span class="mr-1">{{ moderationStatusConfig.icon }}</span>
          {{ moderationStatusConfig.text }}
        </span>
      </div>
      
      <!-- Progress Bar -->
      <div v-if="showProgress && completionPercentage !== undefined" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Заполнено
          </span>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ completionPercentage }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="progressBarClasses"
            :style="{ width: `${completionPercentage}%` }"
          ></div>
        </div>
      </div>
      
      <!-- Title and Description -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      
      <!-- Action Text -->
      <div class="mt-4">
        <span 
          class="text-sm font-medium transition-colors duration-200"
          :class="actionTextClasses"
        >
          {{ actionText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CpuChipIcon, 
  KeyIcon, 
  ArrowRightOnRectangleIcon,
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  title: string
  description: string
  icon: 'cpu' | 'key' | 'logout'
  route?: string
  color: 'purple' | 'green' | 'red'
  isAction?: boolean
  badge?: string
  actionText?: string
  // New props for questionnaire status
  moderationStatus?: 'draft' | 'pending' | 'approved' | 'rejected'
  completionPercentage?: number
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAction: false,
  actionText: 'Перейти',
  showProgress: false
})

const emit = defineEmits<{
  click: []
}>()

const router = useRouter()

// Icon mapping
const iconComponent = computed(() => {
  switch (props.icon) {
    case 'cpu':
      return CpuChipIcon
    case 'key':
      return KeyIcon
    case 'logout':
      return ArrowRightOnRectangleIcon
    default:
      return CpuChipIcon
  }
})

// Color-based styling
const colorClasses = computed(() => {
  switch (props.color) {
    case 'purple':
      return 'group border-purple-200 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600'
    case 'green':
      return 'group border-green-200 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600'
    case 'red':
      return 'group border-red-200 dark:border-red-700/50 hover:border-red-300 dark:hover:border-red-600'
    default:
      return 'group'
  }
})

const gradientClasses = computed(() => {
  switch (props.color) {
    case 'purple':
      return 'bg-gradient-to-br from-purple-500 to-blue-600'
    case 'green':
      return 'bg-gradient-to-br from-green-500 to-emerald-600'
    case 'red':
      return 'bg-gradient-to-br from-red-500 to-rose-600'
    default:
      return 'bg-gradient-to-br from-gray-500 to-gray-600'
  }
})

const iconBgClasses = computed(() => {
  switch (props.color) {
    case 'purple':
      return 'bg-purple-100 dark:bg-purple-900/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30'
    case 'green':
      return 'bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-800/30'
    case 'red':
      return 'bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-800/30'
    default:
      return 'bg-gray-100 dark:bg-gray-800'
  }
})

const iconClasses = computed(() => {
  switch (props.color) {
    case 'purple':
      return 'text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300'
    case 'green':
      return 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300'
    case 'red':
      return 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})

const badgeClasses = computed(() => {
  switch (props.color) {
    case 'purple':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'green':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'red':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
})

const actionTextClasses = computed(() => {
  switch (props.color) {
    case 'purple':
      return 'text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300'
    case 'green':
      return 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300'
    case 'red':
      return 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})

// Moderation status styling
const moderationStatusConfig = computed(() => {
  if (!props.moderationStatus) return null
  
  switch (props.moderationStatus) {
    case 'draft':
      return {
        text: 'Черновик',
        classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: '✏️'
      }
    case 'pending':
      return {
        text: 'На модерации',
        classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        icon: '⏳'
      }
    case 'approved':
      return {
        text: 'Одобрено',
        classes: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        icon: '✅'
      }
    case 'rejected':
      return {
        text: 'Отклонено',
        classes: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: '❌'
      }
    default:
      return null
  }
})

// Progress bar styling
const progressBarClasses = computed(() => {
  switch (props.color) {
    case 'purple':
      return 'bg-purple-500 dark:bg-purple-400'
    case 'green':
      return 'bg-green-500 dark:bg-green-400'
    case 'red':
      return 'bg-red-500 dark:bg-red-400'
    default:
      return 'bg-gray-500 dark:bg-gray-400'
  }
})

const handleClick = () => {
  if (props.isAction) {
    emit('click')
  } else if (props.route) {
    router.push(props.route)
  }
}
</script>

<style scoped>
.action-card {
  transform: translateZ(0); /* Optimize for hardware acceleration */
}
</style>