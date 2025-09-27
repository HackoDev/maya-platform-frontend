<template>
  <div class="specializations-step">
    <div class="step-header">
      <h2>Кто ты?</h2>
      <p>Выберите области вашей экспертизы (можно выбрать несколько)</p>
    </div>

    <div class="step-content">
      <!-- Available Specializations -->
      <div v-if="dataLoading" class="loading-state">
        <div class="text-gray-500">Загрузка специализаций...</div>
      </div>
      
      <div v-else class="specializations-grid">
        <label
          v-for="spec in availableSpecializations"
          :key="spec.id"
          class="specialization-item"
          :class="{ selected: isSelected(spec.id) }"
        >
          <input
            type="checkbox"
            :checked="isSelected(spec.id)"
            @change="toggleSpecialization(spec.id)"
            class="sr-only"
          />
          <div class="checkbox-indicator">
            <svg
              v-if="isSelected(spec.id)"
              class="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="content">
            <div class="name">{{ spec.name }}</div>
            <div v-if="spec.description" class="description">{{ spec.description }}</div>
          </div>
        </label>
      </div>

      <!-- Custom Specializations -->
      <div class="custom-section">
        <h3>Дополнительные специализации</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Если не нашли подходящих выше, добавьте свои
        </p>
        
        <div class="custom-items">
          <div
            v-for="(_, index) in customSpecializations"
            :key="index"
            class="custom-item"
          >
            <input
              :value="customSpecializations[index]"
              type="text"
              placeholder="Введите специализацию..."
              class="custom-input"
              @input="onCustomChange(index, $event)"
            />
            <button
              @click="removeCustomSpecialization(index)"
              class="remove-button"
              type="button"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button
            @click="addCustomSpecialization"
            class="add-button"
            type="button"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить специализацию
          </button>
        </div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="validation-error">
        <p>{{ validationError }}</p>
      </div>

      <!-- Selection Summary -->
      <div class="selection-summary">
        <p>Выбрано: {{ totalSelected }} специализаций</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile-simple'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

interface Props {
  profile: NeuralNetworkProfile | null
}

interface Emits {
  (e: 'update', updates: Partial<NeuralNetworkProfile>): void
  (e: 'complete', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useNeuralNetworkProfileStore()
const validationError = ref('')

const availableSpecializations = computed(() => store.availableSpecializations)
const dataLoading = computed(() => store.dataLoading)

const customSpecializations = computed({
  get: () => props.profile?.customSpecializations || [],
  set: (value) => emit('update', { customSpecializations: value })
})

const totalSelected = computed(() => {
  const selectedCount = props.profile?.specializations.length || 0
  const customCount = props.profile?.customSpecializations.length || 0
  return selectedCount + customCount
})


const isSelected = (id: number) => {
  if (!props.profile?.specializations) return false
  return props.profile.specializations.some(spec => spec.id === id)
}

const toggleSpecialization = (id: number) => {
  const current = props.profile?.specializations || []
  const isSelected = current.some(spec => spec.id === id)
  
  if (isSelected) {
    // Remove specialization object
    const updated = current.filter(spec => spec.id !== id)
    emit('update', { specializations: updated })
  } else {
    // Add specialization object
    const spec = availableSpecializations.value.find(s => s && s.id === id)
    if (spec) {
      const updated = [...current, spec]
      emit('update', { specializations: updated })
    }
  }
  validateStep()
}

const addCustomSpecialization = () => {
  const current = props.profile?.customSpecializations || []
  emit('update', { customSpecializations: [...current, ''] })
}

const removeCustomSpecialization = (index: number) => {
  const current = props.profile?.customSpecializations || []
  const updated = current.filter((_, i) => i !== index)
  emit('update', { customSpecializations: updated })
  validateStep()
}

const onCustomChange = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const current = props.profile?.customSpecializations || []
  const updated = [...current]
  updated[index] = target.value
  emit('update', { customSpecializations: updated })
  validateStep()
}

const validateStep = () => {
  validationError.value = ''
  
  if (totalSelected.value === 0) {
    validationError.value = 'Выберите хотя бы одну специализацию'
  }
}


// Watch for changes and validate
watch(() => props.profile?.specializations, validateStep)
watch(() => props.profile?.customSpecializations, validateStep)
</script>

<style scoped>
.specializations-step {
  @apply w-full p-6;
}

.step-header {
  @apply mb-4;
}

.step-header h2 {
  @apply text-2xl font-bold text-gray-900 dark:text-white mb-2;
}

.step-header p {
  @apply text-gray-600 dark:text-gray-400;
}

.specializations-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-8;
}

.specialization-item {
  @apply relative flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.specialization-item.selected {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600;
}

.checkbox-indicator {
  @apply flex-shrink-0 w-5 h-5 border-2 rounded transition-colors mr-3 mt-0.5;
}

.specialization-item:not(.selected) .checkbox-indicator {
  @apply border-gray-300 dark:border-gray-500;
}

.specialization-item.selected .checkbox-indicator {
  @apply bg-blue-600 border-blue-600 flex items-center justify-center;
}

.content {
  @apply flex-1;
}

.name {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.description {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}

.custom-section {
  @apply mb-4;
}

.custom-section h3 {
  @apply text-lg font-medium text-gray-900 dark:text-white mb-2;
}

.custom-items {
  @apply space-y-3;
}

.custom-item {
  @apply flex items-center space-x-2;
}

.custom-input {
  @apply flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm;
}

.remove-button {
  @apply px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300;
}

.add-button {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300;
}

.validation-error {
  @apply p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md mb-4;
}

.validation-error p {
  @apply text-sm text-red-600 dark:text-red-400;
}

.selection-summary {
  @apply text-sm text-gray-500 dark:text-gray-400 mb-4;
}

.step-actions {
  @apply flex justify-end;
}

.btn {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-colors;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.loading-state {
  @apply text-center py-8;
}
</style>
