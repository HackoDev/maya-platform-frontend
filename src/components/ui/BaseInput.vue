<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500 dark:text-red-400">*</span>
    </label>

    <input
      :id="inputId"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      v-bind="$attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >

    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ 
        error ? Array.isArray(error) ? error.join(' ') : error : ''
      }}
      <!-- {{ error ? Array.isArray(error) ? error.join(', ') : error : '' }} -->
    </p>

    <p v-if="hint && !error && error?.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { generateId } from '@/utils'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string | string[]
  hint?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = generateId()

const inputClasses = computed(() => {
  const baseClasses =
    'block w-full border rounded-md shadow-sm focus:outline-none transition-colors'

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  }

  const stateClasses = props.error
    ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-blue-500 dark:focus:ring-blue-500'

  const disabledClasses = props.disabled
    ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'

  return [baseClasses, sizeClasses[props.size], stateClasses, disabledClasses].join(' ')
})
</script>
