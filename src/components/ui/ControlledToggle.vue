<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-checked="internalValue"
    :aria-describedby="ariaDescribedby"
    role="switch"
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="toggleClasses"
    @click="handleToggleClick"
    @keydown.space.prevent="handleToggleClick"
    @keydown.enter.prevent="handleToggleClick"
  >
    <span class="sr-only">{{ srText }}</span>
    <span
      :class="internalValue ? 'translate-x-5' : 'translate-x-0'"
      class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
    >
      <!-- Off state icon -->
      <span
        :class="internalValue ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'"
        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
        aria-hidden="true"
      >
        <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
          <path 
            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
          />
        </svg>
      </span>
      <!-- On state icon -->
      <span
        :class="internalValue ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'"
        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
        aria-hidden="true"
      >
        <svg class="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
          <path 
            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.707a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" 
          />
        </svg>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface ControlledToggleProps {
  modelValue: boolean
  disabled?: boolean
  confirmationRequired?: boolean
  srText?: string
  ariaDescribedby?: string
}

export interface ControlledToggleEmits {
  (e: 'toggle-requested', newValue: boolean): void
}

export interface ControlledToggleExposed {
  updateValue: (newValue: boolean) => void
  getCurrentValue: () => boolean
}

const props = withDefaults(defineProps<ControlledToggleProps>(), {
  disabled: false,
  confirmationRequired: true,
  srText: 'Toggle setting',
  ariaDescribedby: undefined,
})

const emit = defineEmits<ControlledToggleEmits>()

// Internal reactive state for the toggle
const internalValue = ref(props.modelValue)

// Watch for external prop changes and sync internal state
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
}, { immediate: true })

// Computed class for toggle background color
const toggleClasses = computed(() => {
  return internalValue.value ? 'bg-green-500' : 'bg-gray-300'
})

// Handle click events with prevention of default toggle behavior
const handleToggleClick = (event: Event) => {
  if (props.disabled) return

  // Prevent default toggle behavior
  event.preventDefault()
  event.stopPropagation()

  // Calculate intended new value
  const intendedValue = !internalValue.value

  if (props.confirmationRequired) {
    // Emit custom event with intended value for confirmation flow
    emit('toggle-requested', intendedValue)
  } else {
    // Direct update for non-confirmation scenarios
    updateValue(intendedValue)
  }
}

// Programmatically update toggle state (called after confirmation)
const updateValue = (newValue: boolean) => {
  internalValue.value = newValue
}

// Get current toggle value
const getCurrentValue = () => internalValue.value

// Expose methods for parent component access
defineExpose<ControlledToggleExposed>({
  updateValue,
  getCurrentValue,
})
</script>