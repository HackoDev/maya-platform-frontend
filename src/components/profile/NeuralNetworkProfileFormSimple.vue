<template>
  <div class="neural-network-profile-form">
    <!-- Progress Header -->
    <div class="progress-header">
      <div class="header-content">
        <div class="header-top">
          <h1 class="form-title">Анкета специалиста</h1>
          <div class="progress-info">
            {{ completionPercentage }}% завершено
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${completionPercentage}%` }"
          ></div>
        </div>

        <!-- Step Navigation -->
        <div class="step-navigation">
          <button
            v-for="step in FORM_STEPS"
            :key="step.id"
            @click="setCurrentStep(step.id)"
            :class="getStepClass(step.id)"
          >
            {{ step.id }}. {{ step.title }}
            <span v-if="isStepCompleted(step.id)" class="checkmark">✓</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-content">
      <div class="content-container">
        <!-- Step Content Container -->
        <div class="step-content-container">
          <!-- Step 1: Specializations -->
          <SpecializationsStep
            v-if="currentStep === 1"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />

          <!-- Step 2: Superpower -->
          <SuperpowerStep
            v-if="currentStep === 2"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />

          <!-- Step 3: Skills -->
          <SkillsStep
            v-if="currentStep === 3"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />

          <!-- Step 4: Portfolio -->
          <PortfolioStep
            v-if="currentStep === 4"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />

          <!-- Step 5: Services -->
          <ServicesStep
            v-if="currentStep === 5"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />

          <!-- Step 6: Experience -->
          <ExperienceStep
            v-if="currentStep === 6"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />

          <!-- Step 7: Testimonials -->
          <TestimonialsStep
            v-if="currentStep === 7"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />

          <!-- Step 8: Contacts -->
          <ContactsStep
            v-if="currentStep === 8"
            :profile="profile"
            @update="handleUpdate"
            @complete="handleStepComplete"
          />
        </div>
      </div>
    </div>

    <!-- Navigation Footer -->
    <div class="form-footer">
      <div class="footer-content">
        <button
          @click="previousStep"
          :disabled="currentStep === 1"
          class="btn btn-secondary"
        >
          ← Назад
        </button>

        <div class="footer-actions">
          <button
            v-if="isDirty"
            @click="saveDraft"
            :disabled="isSaving"
            class="btn btn-secondary"
          >
            {{ isSaving ? 'Сохранение...' : 'Сохранить черновик' }}
          </button>

          <button
            v-if="currentStep === 8 && canSubmit"
            @click="submitProfile"
            :disabled="isSaving"
            class="btn btn-success"
          >
            {{ isSaving ? 'Отправка...' : 'Отправить на проверку' }}
          </button>

          <button
            v-else
            @click="nextStep"
            :disabled="currentStep === 8"
            class="btn btn-primary"
          >
            Далее →
          </button>
        </div>
      </div>
    </div>

    <!-- Auto-save indicator -->
    <div v-if="lastAutoSave" class="auto-save-indicator">
      <p>Последнее автосохранение: {{ formatDateTime(lastAutoSave) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile-simple'
import { FORM_STEPS } from '@/types/neural-network-profile-simple'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

interface Props {
  initialData?: any
}

interface Emits {
  (e: 'submit', data: any): void
  (e: 'save-draft', data: any): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// Import step components
import SpecializationsStep from './steps/SpecializationsStep.vue'
import SuperpowerStep from './steps/SuperpowerStep.vue'
import SkillsStep from './steps/SkillsStep.vue'
import PortfolioStep from './steps/PortfolioStep.vue'
import ServicesStep from './steps/ServicesStep.vue'
import ExperienceStep from './steps/ExperienceStep.vue'
import TestimonialsStep from './steps/TestimonialsStep.vue'
import ContactsStep from './steps/ContactsStep.vue'

const store = useNeuralNetworkProfileStore()
const isDirty = ref(false)
const lastAutoSave = ref<string | null>(null)

// Auto-save functionality
let autoSaveTimeout: number | null = null

const profile = computed(() => store.profile)
const currentStep = computed(() => store.currentStep)
const completionPercentage = computed(() => store.completionPercentage)
const canSubmit = computed(() => store.canSubmit)
const isSaving = computed(() => store.isSaving)

onMounted(async () => {
  // TODO: Get userId from auth store
  const userId = 'current-user-id'
  await initializeProfile(userId)
  
  // Set current step to next incomplete step
  const nextIncomplete = store.nextIncompleteStep
  if (nextIncomplete) {
    store.setCurrentStep(nextIncomplete)
  }
})

const initializeProfile = async (userId: string) => {
  try {
    await store.initializeProfile(userId)
  } catch (error) {
    console.error('Error initializing profile:', error)
  }
}

const handleUpdate = (updates: Partial<NeuralNetworkProfile>) => {
  store.updateProfile(updates)
  isDirty.value = true
  
  // Auto-save after 2 seconds of inactivity
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
  autoSaveTimeout = setTimeout(async () => {
    await saveDraft()
  }, 2000)
}

const handleStepComplete = (stepId: number) => {
  store.markStepCompleted(stepId)
  
  // Auto-advance to next step if not the last step
  if (stepId < 8) {
    nextStep()
  }
}

const setCurrentStep = (stepId: number) => {
  store.setCurrentStep(stepId)
}

const getStepClass = (stepId: number) => {
  const isCurrent = currentStep.value === stepId
  const isCompleted = isStepCompleted(stepId)
  const isRequired = FORM_STEPS.find(s => s.id === stepId)?.required || false
  
  return {
    'step-button': true,
    'step-current': isCurrent,
    'step-completed': isCompleted,
    'step-required': isRequired
  }
}

const isStepCompleted = (stepId: number) => {
  return store.completedSteps.has(stepId)
}

const previousStep = () => {
  if (currentStep.value > 1) {
    store.setCurrentStep(currentStep.value - 1)
  }
}

const nextStep = () => {
  if (currentStep.value < 8) {
    store.setCurrentStep(currentStep.value + 1)
  }
}

const saveDraft = async () => {
  if (!isDirty.value) return
  
  try {
    await store.saveProfile()
    isDirty.value = false
    lastAutoSave.value = new Date().toISOString()
    
    // Emit event for parent component
    emit('save-draft', store.profile)
  } catch (error) {
    console.error('Error saving draft:', error)
  }
}

const submitProfile = async () => {
  try {
    await store.submitProfile()
    // Emit event for parent component
    emit('submit', store.profile)
    console.log('Profile submitted successfully')
  } catch (error) {
    console.error('Error submitting profile:', error)
    // TODO: Show error notification
  }
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for profile changes to update dirty state
watch(() => store.profile, () => {
  isDirty.value = true
}, { deep: true })
</script>

<style scoped>
.neural-network-profile-form {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}

.progress-header {
  @apply bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10;
}

.header-content {
  @apply max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8;
}

.header-top {
  @apply flex items-center justify-between mb-4;
}

.form-title {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.progress-info {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.progress-bar {
  @apply w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4;
}

.progress-fill {
  @apply bg-blue-600 h-2 rounded-full transition-all duration-300;
}

.step-navigation {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2;
}

.step-button {
  @apply w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center relative;
}

.step-button:not(.step-current):not(.step-completed) {
  @apply bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300;
}

.step-button.step-current {
  @apply bg-blue-600 text-white;
}

.step-button.step-completed {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}

.step-button.step-required:not(.step-completed):not(.step-current) {
  @apply border border-red-300 dark:border-red-600;
}

.checkmark {
  @apply ml-1;
}

.form-content {
  @apply bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700;
}

.content-container {
  @apply max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8;
}

.step-content-container {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}


.form-footer {
  @apply bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700;
}

.footer-content {
  @apply max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center;
}

.footer-actions {
  @apply flex space-x-3;
}

.auto-save-indicator {
  @apply text-center py-2;
}

.auto-save-indicator p {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.btn {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 focus:ring-gray-500;
}

.btn-success {
  @apply text-white bg-green-600 hover:bg-green-700 focus:ring-green-500;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
