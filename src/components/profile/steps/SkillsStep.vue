<template>
  <div class="skills-step">
    <div class="step-header">
      <h2>Что ты умеешь?</h2>
      <p>Отметь то, что делаешь, чтобы клиенту было понятно, с чем ты можешь помочь</p>
    </div>

    <div class="step-content">
      <!-- Available Skills -->
      <div v-if="dataLoading" class="loading-state">
        <div class="text-gray-500">Загрузка навыков...</div>
      </div>
      
      <div v-else class="skills-grid">
        <label
          v-for="skill in availableSkills"
          :key="skill.id"
          class="skill-item"
          :class="{ selected: isSelected(skill.id) }"
        >
          <input
            type="checkbox"
            :checked="isSelected(skill.id)"
            @change="toggleSkill(skill.id)"
            class="sr-only"
          />
          <div class="checkbox-indicator">
            <svg
              v-if="isSelected(skill.id)"
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
            <div class="name">{{ skill.name }}</div>
            <div v-if="skill.description" class="description">{{ skill.description }}</div>
            <div v-if="skill.tags && skill.tags.length > 0" class="tags">
              Инструменты: {{ skill.tags.join(', ') }}
            </div>
          </div>
        </label>
      </div>

      <!-- Custom Skills -->
      <div class="custom-section">
        <h3>Дополнительные навыки</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Если не нашли подходящих выше, добавьте свои
        </p>
        
        <div class="custom-items">
          <div
            v-for="(_, index) in customSkills"
            :key="index"
            class="custom-item"
          >
            <input
              v-model="customSkills[index]"
              type="text"
              placeholder="Например: Настройка интеграций с CRM..."
              class="custom-input"
              @input="updateCustomSkills"
            />
            <button
              @click="removeCustomSkill(index)"
              class="remove-button"
              type="button"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button
            @click="addCustomSkill"
            class="add-button"
            type="button"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Добавить навык
          </button>
        </div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="validation-error">
        <p>{{ validationError }}</p>
      </div>

      <!-- Selection Summary -->
      <div class="selection-summary">
        <div class="summary-card">
          <h4>📊 Выбрано навыков: {{ totalSelected }}</h4>
          <div v-if="totalSelected > 0" class="text-xs text-gray-600 dark:text-gray-400">
            Отлично! Клиенты смогут лучше понять, с чем вы можете помочь.
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <h4>💡 Рекомендации по выбору навыков:</h4>
        <ul class="tips-list">
          <li>Выбирайте только те навыки, которыми действительно владеете</li>
          <li>Лучше указать меньше навыков, но качественно их выполнять</li>
          <li>Если есть портфолио по навыку — обязательно добавьте его в следующем блоке</li>
          <li>Сочетайте технические и консультационные навыки для большей привлекательности</li>
        </ul>
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

const availableSkills = computed(() => store.availableSkills)
const dataLoading = computed(() => store.dataLoading)

const customSkills = computed({
  get: () => props.profile?.customSkills || [],
  set: (value) => emit('update', { customSkills: value })
})

const totalSelected = computed(() => {
  const selectedCount = props.profile?.skills.length || 0
  const customCount = props.profile?.customSkills.length || 0
  return selectedCount + customCount
})

const isValid = computed(() => {
  return totalSelected.value > 0
})

const isSelected = (id: number) => {
  return props.profile?.skills.includes(id) || false
}

const toggleSkill = (id: number) => {
  const current = props.profile?.skills || []
  const updated = current.includes(id)
    ? current.filter(s => s !== id)
    : [...current, id]
  
  emit('update', { skills: updated })
  validateStep()
}

const addCustomSkill = () => {
  const current = props.profile?.customSkills || []
  emit('update', { customSkills: [...current, ''] })
}

const removeCustomSkill = (index: number) => {
  const current = props.profile?.customSkills || []
  const updated = current.filter((_, i) => i !== index)
  emit('update', { customSkills: updated })
  validateStep()
}

const updateCustomSkills = () => {
  // Emit the updated customSkills array
  emit('update', { customSkills: customSkills.value })
  validateStep()
}

const validateStep = () => {
  validationError.value = ''
  
  if (totalSelected.value === 0) {
    validationError.value = 'Выберите хотя бы один навык'
  }
}


// Watch for changes and validate
watch(() => props.profile?.skills, validateStep)
watch(() => props.profile?.customSkills, validateStep)
</script>

<style scoped>
.skills-step {
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

.skills-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-8;
}

.skill-item {
  @apply relative flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.skill-item.selected {
  @apply bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600;
}

.checkbox-indicator {
  @apply flex-shrink-0 w-5 h-5 border-2 rounded transition-colors mr-3 mt-0.5;
}

.skill-item:not(.selected) .checkbox-indicator {
  @apply border-gray-300 dark:border-gray-500;
}

.skill-item.selected .checkbox-indicator {
  @apply bg-green-600 border-green-600 flex items-center justify-center;
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

.tags {
  @apply text-xs text-blue-600 dark:text-blue-400 mt-1;
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
  @apply flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-sm;
}

.remove-button {
  @apply px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300;
}

.add-button {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300;
}

.validation-error {
  @apply p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md mb-4;
}

.validation-error p {
  @apply text-sm text-red-600 dark:text-red-400;
}

.selection-summary {
  @apply mb-4;
}

.summary-card {
  @apply p-4 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.summary-card h4 {
  @apply text-sm font-medium text-gray-900 dark:text-white mb-2;
}

.tips-section {
  @apply p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4;
}

.tips-section h4 {
  @apply text-sm font-medium text-blue-900 dark:text-blue-200 mb-2;
}

.tips-list {
  @apply text-sm text-blue-800 dark:text-blue-300 space-y-1;
}

.tips-list li {
  @apply list-disc list-inside;
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
