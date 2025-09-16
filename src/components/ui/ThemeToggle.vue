<template>
  <div class="theme-toggle" :class="containerClasses">
    <!-- Button Variant -->
    <button
      v-if="variant === 'button'"
      type="button"
      :class="buttonClasses"
      :aria-label="buttonAriaLabel"
      :title="buttonTitle"
      @click="handleButtonClick"
      @keydown.enter="handleButtonClick"
      @keydown.space.prevent="handleButtonClick"
    >
      <component :is="currentIcon" :class="iconClasses" aria-hidden="true" />
      <span v-if="showLabel" :class="labelClasses">{{ currentLabel }}</span>
    </button>

    <!-- Dropdown Variant -->
    <div v-else-if="variant === 'dropdown'" class="relative">
      <button
        type="button"
        :class="dropdownButtonClasses"
        :aria-label="dropdownAriaLabel"
        :aria-expanded="isDropdownOpen"
        :aria-haspopup="true"
        @click="toggleDropdown"
        @keydown.enter="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.escape="closeDropdown"
      >
        <component :is="currentIcon" :class="iconClasses" aria-hidden="true" />
        <span v-if="showLabel" :class="labelClasses">{{ currentLabel }}</span>
        <ChevronDownIcon
          :class="[
            'ml-2 h-4 w-4 transition-transform duration-200',
            isDropdownOpen ? 'rotate-180' : '',
          ]"
          aria-hidden="true"
        />
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isDropdownOpen"
          :class="dropdownMenuClasses"
          role="menu"
          @click.stop
        >
          <button
            v-for="option in themeOptions"
            :key="option.value"
            type="button"
            :class="getDropdownItemClasses(option.value)"
            role="menuitem"
            @click="handleThemeSelect(option.value)"
          >
            <component :is="getThemeIcon(option.value)" class="h-4 w-4" aria-hidden="true" />
            <span>{{ option.label }}</span>
            <CheckIcon
              v-if="themeStore.currentTheme === option.value"
              class="ml-auto h-4 w-4 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </Transition>
    </div>

    <!-- Switch Variant -->
    <label v-else-if="variant === 'switch'" :class="switchLabelClasses">
      <span v-if="showLabel" :class="switchTextClasses">
        {{ isDarkMode ? 'Dark' : 'Light' }}
      </span>
      <div class="relative">
        <input
          type="checkbox"
          :checked="isDarkMode"
          :aria-label="switchAriaLabel"
          class="sr-only"
          @change="handleSwitchToggle"
        />
        <div :class="switchTrackClasses">
          <div :class="switchThumbClasses">
            <component
              :is="isDarkMode ? MoonIcon : SunIcon"
              class="h-3 w-3 text-white"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeToggleProps, ThemeMode } from '@/types/theme'
import { THEME_OPTIONS } from '@/types/theme'

// Icons - these would typically be imported from a library like Heroicons
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

// Props
const props = withDefaults(defineProps<ThemeToggleProps>(), {
  variant: 'button',
  size: 'md',
  showLabel: false,
  position: 'right',
})

// Store
const themeStore = useThemeStore()

// Local state
const isDropdownOpen = ref(false)

// Computed properties
const currentIcon = computed(() => getThemeIcon(themeStore.currentTheme))
const currentLabel = computed(() => {
  const option = THEME_OPTIONS.find(opt => opt.value === themeStore.currentTheme)
  return option?.label || 'Theme'
})

const isDarkMode = computed(() => themeStore.isDarkMode)

// Theme options for dropdown
const themeOptions = THEME_OPTIONS

// CSS Classes
const containerClasses = computed(() => ({
  'theme-toggle': true,
  [`theme-toggle--${props.variant}`]: true,
  [`theme-toggle--${props.size}`]: true,
}))

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  }
  return sizes[props.size]
})

const buttonClasses = computed(() => [
  'theme-toggle-button',
  'inline-flex items-center justify-center',
  'rounded-md border border-transparent',
  'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
  'dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  'dark:focus:ring-offset-gray-800',
  'transition-all duration-200 ease-in-out',
  sizeClasses.value,
  props.showLabel ? 'px-3 space-x-2' : '',
])

const iconClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }
  return [
    sizes[props.size],
    'transition-all duration-300 ease-in-out',
  ]
})

const labelClasses = computed(() => [
  'font-medium',
  props.size === 'sm' ? 'text-sm' : 'text-base',
])

const dropdownButtonClasses = computed(() => [
  ...buttonClasses.value,
  'px-3 py-2',
])

const dropdownMenuClasses = computed(() => [
  'absolute z-10 mt-2 w-56 origin-top-right',
  'bg-white dark:bg-gray-800',
  'border border-gray-200 dark:border-gray-700',
  'rounded-md shadow-lg ring-1 ring-black ring-opacity-5',
  'focus:outline-none',
  props.position === 'left' ? 'left-0' : 'right-0',
])

const getDropdownItemClasses = (themeValue: ThemeMode) => [
  'flex items-center w-full px-4 py-2 text-left',
  'text-gray-700 dark:text-gray-300',
  'hover:bg-gray-100 dark:hover:bg-gray-700',
  'focus:bg-gray-100 dark:focus:bg-gray-700',
  'focus:outline-none',
  'transition-colors duration-150',
  'space-x-3',
  themeStore.currentTheme === themeValue
    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
    : '',
]

const switchLabelClasses = computed(() => [
  'flex items-center cursor-pointer',
  props.showLabel ? 'space-x-3' : '',
])

const switchTextClasses = computed(() => [
  'text-sm font-medium text-gray-700 dark:text-gray-300',
])

const switchTrackClasses = computed(() => [
  'relative inline-flex h-6 w-11 items-center rounded-full',
  'transition-colors duration-200 ease-in-out',
  'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
  'dark:focus-within:ring-offset-gray-800',
  isDarkMode.value
    ? 'bg-blue-600 dark:bg-blue-500'
    : 'bg-gray-200 dark:bg-gray-600',
])

const switchThumbClasses = computed(() => [
  'inline-flex h-5 w-5 items-center justify-center',
  'transform rounded-full bg-white shadow-lg ring-0',
  'transition-transform duration-200 ease-in-out',
  isDarkMode.value ? 'translate-x-6' : 'translate-x-1',
])

// Methods
const getThemeIcon = (theme: ThemeMode) => {
  switch (theme) {
    case 'light':
      return SunIcon
    case 'dark':
      return MoonIcon
    case 'system':
      return ComputerDesktopIcon
    default:
      return SunIcon
  }
}

const handleButtonClick = () => {
  if (props.variant === 'button') {
    themeStore.cycleTheme()
  }
}

const handleThemeSelect = (theme: ThemeMode) => {
  themeStore.setTheme(theme)
  closeDropdown()
}

const handleSwitchToggle = () => {
  themeStore.toggleTheme()
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// ARIA labels
const buttonAriaLabel = computed(() => {
  return `Switch to ${getNextTheme()} theme`
})

const buttonTitle = computed(() => {
  return `Current theme: ${currentLabel.value}. Click to cycle themes.`
})

const dropdownAriaLabel = computed(() => {
  return `Current theme: ${currentLabel.value}. Click to open theme menu.`
})

const switchAriaLabel = computed(() => {
  return `Toggle between light and dark theme. Currently ${isDarkMode.value ? 'dark' : 'light'}.`
})

const getNextTheme = (): string => {
  switch (themeStore.currentTheme) {
    case 'light':
      return 'dark'
    case 'dark':
      return 'system'
    case 'system':
      return 'light'
    default:
      return 'dark'
  }
}

// Click outside handler for dropdown
const handleClickOutside = (event: Event) => {
  if (isDropdownOpen.value) {
    const target = event.target as HTMLElement
    const dropdown = target.closest('.theme-toggle')
    if (!dropdown) {
      closeDropdown()
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-toggle-button {
  /* Additional custom styling can go here */
}

.theme-toggle--sm .theme-toggle-button {
  @apply px-2 py-2;
}

.theme-toggle--md .theme-toggle-button {
  @apply px-2.5 py-2.5;
}

.theme-toggle--lg .theme-toggle-button {
  @apply px-3 py-3;
}
</style>