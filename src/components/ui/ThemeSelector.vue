<template>
  <div 
    class="grid grid-cols-1 md:grid-cols-3 gap-4"
    role="radiogroup"
    aria-label="Выбор темы интерфейса"
  >
    <div
      v-for="theme in themeOptions"
      :key="theme.value"
      @click="handleThemeSelect(theme.value)"
      class="cursor-pointer group border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      :class="[
        isSelected(theme.value)
          ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 dark:ring-blue-400/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
      ]"
      tabindex="0"
      role="radio"
      :aria-checked="isSelected(theme.value)"
      :aria-label="`Выбрать ${theme.label.toLowerCase()}`"
      @keydown.enter="handleThemeSelect(theme.value)"
      @keydown.space.prevent="handleThemeSelect(theme.value)"
    >
      <!-- Theme Preview -->
      <div
        class="h-24 relative"
        :class="getPreviewClasses(theme.value)"
      >
        <!-- Mock mini interface -->
        <div class="absolute inset-2 flex flex-col space-y-1">
          <!-- Header bar -->
          <div 
            class="h-2 rounded-sm opacity-80"
            :class="getPreviewElementClasses(theme.value, 'header')"
          ></div>
          
          <!-- Content lines -->
          <div class="flex-1 space-y-1">
            <div 
              class="h-1 w-3/4 rounded-sm opacity-60"
              :class="getPreviewElementClasses(theme.value, 'text')"
            ></div>
            <div 
              class="h-1 w-1/2 rounded-sm opacity-40"
              :class="getPreviewElementClasses(theme.value, 'text')"
            ></div>
            <div 
              class="h-1 w-2/3 rounded-sm opacity-40"
              :class="getPreviewElementClasses(theme.value, 'text')"
            ></div>
          </div>
          
          <!-- Button -->
          <div 
            class="h-2 w-1/3 rounded-sm ml-auto"
            :class="getPreviewElementClasses(theme.value, 'button')"
          ></div>
        </div>

        <!-- Selection indicator -->
        <div
          v-if="isSelected(theme.value)"
          class="absolute top-2 right-2 w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center"
        >
          <CheckIcon class="w-3 h-3 text-white" />
        </div>
      </div>

      <!-- Theme info -->
      <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <component :is="theme.icon" class="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ theme.label }}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ theme.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/types/theme'
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

interface ThemeOption {
  value: ThemeMode
  label: string
  description: string
  icon: any
}

// Emits
const emit = defineEmits<{
  themeChanged: [theme: ThemeMode]
}>()

const themeStore = useThemeStore()

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Светлая тема',
    description: 'Классический светлый интерфейс',
    icon: SunIcon,
  },
  {
    value: 'dark',
    label: 'Темная тема',
    description: 'Стильный темный интерфейс',
    icon: MoonIcon,
  },
  {
    value: 'system',
    label: 'Системная тема',
    description: 'Следует настройкам системы',
    icon: ComputerDesktopIcon,
  },
]

const isSelected = (theme: ThemeMode): boolean => {
  return themeStore.currentTheme === theme
}

const handleThemeSelect = (theme: ThemeMode): void => {
  themeStore.setTheme(theme)
  emit('themeChanged', theme)
}

const getPreviewClasses = (theme: ThemeMode): string => {
  switch (theme) {
    case 'light':
      return 'bg-white'
    case 'dark':
      return 'bg-gray-900'
    case 'system':
      // Show current system preference
      return themeStore.systemIsDark ? 'bg-gray-900' : 'bg-white'
    default:
      return 'bg-white'
  }
}

const getPreviewElementClasses = (theme: ThemeMode, element: 'header' | 'text' | 'button'): string => {
  const isDark = theme === 'dark' || (theme === 'system' && themeStore.systemIsDark)
  
  switch (element) {
    case 'header':
      return isDark ? 'bg-gray-700' : 'bg-gray-200'
    case 'text':
      return isDark ? 'bg-gray-600' : 'bg-gray-300'
    case 'button':
      return 'bg-blue-500'
    default:
      return isDark ? 'bg-gray-600' : 'bg-gray-300'
  }
}
</script>