<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div class="p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" :class="iconBgClass">
            <span class="text-white text-xl">{{ icon }}</span>
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-1">
              {{ title }}
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ formattedValue }}
            </dd>
          </dl>
        </div>
        <div class="flex-shrink-0">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      </div>
      
      <!-- Progress bar for visual appeal -->
      <div class="mt-4">
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            class="h-1.5 rounded-full transition-all duration-1000 ease-out" 
            :class="progressBarClass"
            :style="{ width: progressWidth }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number | string
  icon: string
  iconBgClass?: string
  maxValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  iconBgClass: 'bg-gradient-to-r from-blue-500 to-purple-600',
  maxValue: 100
})

const iconBgClass = computed(() => props.iconBgClass)

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('ru-RU')
  }
  return props.value
})

const progressWidth = computed(() => {
  if (typeof props.value === 'number' && props.maxValue > 0) {
    const percentage = Math.min((props.value / props.maxValue) * 100, 100)
    return `${percentage}%`
  }
  return '100%'
})

const progressBarClass = computed(() => {
  if (props.iconBgClass.includes('green')) {
    return 'bg-gradient-to-r from-green-400 to-green-600'
  } else if (props.iconBgClass.includes('purple')) {
    return 'bg-gradient-to-r from-purple-400 to-purple-600'
  } else if (props.iconBgClass.includes('blue')) {
    return 'bg-gradient-to-r from-blue-400 to-blue-600'
  }
  return 'bg-gradient-to-r from-gray-400 to-gray-600'
})
</script>