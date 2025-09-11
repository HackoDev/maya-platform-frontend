<template>
  <div class="skill-selector relative">
    <!-- Selected skills display -->
    <div v-if="selectedSkills.length > 0" class="mb-3">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skillKey in modelValue"
          :key="skillKey"
          class="skill-tag inline-flex items-center px-3 py-1 text-sm font-medium 
                 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
        >
          {{ getSkillLabel(skillKey) }}
          <button
            type="button"
            @click="removeSkill(skillKey)"
            class="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full 
                   text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            ×
          </button>
        </span>
      </div>
    </div>

    <!-- Input field -->
    <div class="relative">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
               rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
               placeholder-gray-500 dark:placeholder-gray-400 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @focus="showDropdown = true"
        @input="onSearchInput"
        @keydown="onKeyDown"
        autocomplete="off"
      >
      
      <!-- Dropdown icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon 
          class="h-4 w-4 text-gray-400"
          :class="{ 'rotate-180': showDropdown }"
        />
      </div>
    </div>

    <!-- Dropdown menu -->
    <div
      v-if="showDropdown && filteredOptions.length > 0"
      class="skill-dropdown absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 
             border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <div
        v-for="(option, index) in filteredOptions"
        :key="option.key"
        :class="[
          'skill-option px-4 py-2 cursor-pointer text-sm',
          {
            'bg-blue-50 dark:bg-blue-900': index === highlightedIndex,
            'hover:bg-gray-50 dark:hover:bg-gray-700': index !== highlightedIndex,
            'text-gray-400 dark:text-gray-500 cursor-not-allowed': isSkillSelected(option.key),
          },
        ]"
        @click="selectSkill(option)"
        @mouseenter="highlightedIndex = index"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-900 dark:text-white truncate">
              {{ option.label }}
            </div>
            <div v-if="option.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {{ option.description }}
            </div>
          </div>
          <div v-if="isSkillSelected(option.key)" class="ml-2 text-blue-600 dark:text-blue-400">
            ✓
          </div>
        </div>
      </div>
    </div>

    <!-- Click outside handler -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="showDropdown = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import type { MultiSkillSelectorProps, SkillOption } from '@/types/specialist-search'

interface Props {
  modelValue: string[]
  options: SkillOption[]
  placeholder?: string
  maxSelections?: number
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите навыки...',
  maxSelections: 10,
})

const emit = defineEmits<Emits>()

// Local state
const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(0)
const inputRef = ref<HTMLInputElement>()

// Computed
const selectedSkills = computed(() => {
  return props.options.filter(option => props.modelValue.includes(option.key))
})

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.options.slice(0, 20) // Show first 20 options when no search
  }

  const query = searchQuery.value.toLowerCase().trim()
  return props.options
    .filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query)
    )
    .slice(0, 10) // Limit search results
})

const canSelectMore = computed(() => {
  return props.modelValue.length < props.maxSelections
})

// Methods
const getSkillLabel = (skillKey: string): string => {
  const skill = props.options.find(option => option.key === skillKey)
  return skill ? skill.label : skillKey
}

const isSkillSelected = (skillKey: string): boolean => {
  return props.modelValue.includes(skillKey)
}

const selectSkill = (option: SkillOption): void => {
  if (isSkillSelected(option.key) || !canSelectMore.value) {
    return
  }

  const newValue = [...props.modelValue, option.key]
  emit('update:modelValue', newValue)
  
  // Clear search and close dropdown
  searchQuery.value = ''
  showDropdown.value = false
  highlightedIndex.value = 0
}

const removeSkill = (skillKey: string): void => {
  const newValue = props.modelValue.filter(key => key !== skillKey)
  emit('update:modelValue', newValue)
}

const onSearchInput = (): void => {
  highlightedIndex.value = 0
  if (!showDropdown.value) {
    showDropdown.value = true
  }
}

const onKeyDown = (event: KeyboardEvent): void => {
  if (!showDropdown.value) {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      event.preventDefault()
      showDropdown.value = true
      return
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredOptions.value.length - 1
      )
      break

    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break

    case 'Enter':
      event.preventDefault()
      if (filteredOptions.value[highlightedIndex.value]) {
        selectSkill(filteredOptions.value[highlightedIndex.value])
      }
      break

    case 'Escape':
      event.preventDefault()
      showDropdown.value = false
      searchQuery.value = ''
      inputRef.value?.blur()
      break

    case 'Backspace':
      if (!searchQuery.value && props.modelValue.length > 0) {
        // Remove last selected skill when backspace on empty input
        const lastSkill = props.modelValue[props.modelValue.length - 1]
        removeSkill(lastSkill)
      }
      break
  }
}

// Focus management
const focusInput = (): void => {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// Expose methods for parent component
defineExpose({
  focusInput,
})
</script>

<style scoped>
.skill-selector {
  position: relative;
}

.skill-dropdown {
  /* Custom scrollbar for better UX */
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f9fafb;
}

.skill-dropdown::-webkit-scrollbar {
  width: 6px;
}

.skill-dropdown::-webkit-scrollbar-track {
  background: #f9fafb;
}

.skill-dropdown::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.skill-dropdown::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark .skill-dropdown::-webkit-scrollbar-track {
  background: #374151;
}

.dark .skill-dropdown::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .skill-dropdown::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.skill-option {
  transition: background-color 0.15s ease-in-out;
}

.skill-tag {
  transition: all 0.15s ease-in-out;
}

.skill-tag button {
  transition: all 0.15s ease-in-out;
}

/* Focus states */
.skill-selector input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Animation for dropdown */
.skill-dropdown {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>