<template>
  <div class="neural-network-profile-form">
    <!-- Progress Header -->
    <div class="progress-header">
      <div class="header-content">
        <div class="header-top">
          <h1 class="form-title">Анкета специалиста</h1>
          <div class="header-right">
            <div class="progress-info">
              {{ completionPercentage }}% завершено
            </div>
            <!-- Save Status Indicator -->
            <div class="save-status">
              <div v-if="isSaving" class="save-indicator saving">
                <div class="spinner"></div>
                <span>Сохранение...</span>
              </div>
              <div v-else-if="profile?.status === null" class="save-indicator not-created">
                <span class="info-icon">ℹ</span>
                <span>Анкета еще не создана</span>
              </div>
              <div v-else-if="profile?.status === 'published'" class="save-indicator published">
                <span class="checkmark">✓</span>
                <span>Опубликована</span>
              </div>
              <div v-else-if="profile?.status === 'archived'" class="save-indicator archived">
                <span class="archive-icon">📦</span>
                <span>Архивирована</span>
              </div>
              <div v-else-if="profile?.status === 'draft'" class="save-indicator draft">
                <span class="draft-icon">📝</span>
                <span>Черновик</span>
              </div>
              <div v-else class="save-indicator draft">
                <span class="draft-icon">📝</span>
                <span>Черновик</span>
              </div>
            </div>
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
            <div class="step-content">
              <div class="step-number">{{ step.id }}</div>
              <div class="step-title">{{ step.title }}</div>
              <span v-if="isStepCompleted(step.id)" class="step-checkmark">✓</span>
            </div>
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
          <div v-if="currentStep === 8 && profile?.readyForReview" class="text-sm text-blue-700 dark:text-blue-300">
            Ваша анкета проходит модерацию, пожалуйста подождите.
          </div>
          <button
            v-else-if="currentStep === 8 && canSubmit"
            @click="markReadyForReview"
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
const isAutoSaving = ref(false)

// Auto-save functionality
let autoSaveTimeout: number | null = null
// Accumulate partial changes for steps 1 and 2
const pendingPartial = ref<Partial<NeuralNetworkProfile>>({})

const profile = computed(() => store.profile)
const currentStep = computed(() => store.currentStep)
const completionPercentage = computed(() => store.completionPercentage)
const canSubmit = computed(() => store.canSubmit)
const isSaving = computed(() => store.isSaving || isAutoSaving.value)

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
    // Если профиль не найден (status === null), создаем пустой профиль
    if (store.profile?.status === null) {
      // Профиль еще не создан, показываем это в UI
      console.log('Profile not created yet')
    }
  } catch (error) {
    console.error('Error initializing profile:', error)
  }
}

const handleUpdate = (updates: Partial<NeuralNetworkProfile>) => {
  store.updateProfile(updates)
  isDirty.value = true
  
  // Collect partial updates for all steps
  const partialKeysForAllSteps: (keyof NeuralNetworkProfile)[] = [
    // Step 1: Specializations
    'specializations',
    'customSpecializations',
    // Step 2: Superpower
    'superpower',
    'publicLinks',
    // Step 3: Skills
    'skills',
    'customSkills',
    // Step 4: Portfolio
    'portfolio',
    // Step 5: Services
    'services',
    'customServices',
    'serviceOptions',
    // Step 6: Experience
    'experience',
    // Step 7: Testimonials
    'testimonials',
    // Step 8: Contacts
    'customContacts',
  ]
  const partialToSave: Partial<NeuralNetworkProfile> = {}
  partialKeysForAllSteps.forEach((key) => {
    if (key in updates) {
      // @ts-expect-error index signature
      partialToSave[key] = updates[key]
    }
  })
  // Merge into pendingPartial
  Object.assign(pendingPartial.value, partialToSave)
  
  // Auto-save after 2 seconds of inactivity
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
  autoSaveTimeout = setTimeout(async () => {
    // If we have partial data, send only those fields
    if (Object.keys(pendingPartial.value).length > 0) {
      try {
        isAutoSaving.value = true
        await store.savePartial({ ...pendingPartial.value })
        pendingPartial.value = {}
        lastAutoSave.value = new Date().toISOString()
      } catch (e) {
        console.error('Error during partial auto-save:', e)
      } finally {
        isAutoSaving.value = false
      }
    } else {
      // Fallback to full draft save if no partial data
      await saveDraft()
    }
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

const markReadyForReview = async () => {
  try {
    isAutoSaving.value = true
    await store.savePartial({ readyForReview: true })
  } catch (error) {
    console.error('Error setting readyForReview:', error)
  } finally {
    isAutoSaving.value = false
  }
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

.header-right {
  @apply flex flex-col items-end space-y-2;
}

.progress-info {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.save-status {
  @apply flex items-center;
}

.save-indicator {
  @apply flex items-center space-x-2 text-sm;
}

.save-indicator.saving {
  @apply text-blue-600 dark:text-blue-400;
}

.save-indicator.published {
  @apply text-green-600 dark:text-green-400;
}

.save-indicator.not-created {
  @apply text-gray-500 dark:text-gray-400;
}

.save-indicator.draft {
  @apply text-orange-600 dark:text-orange-400;
}

.save-indicator.archived {
  @apply text-purple-600 dark:text-purple-400;
}

.spinner {
  @apply w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin;
}

.info-icon, .draft-icon, .archive-icon {
  @apply text-sm;
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
  @apply w-full px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 text-center relative border;
}

.step-content {
  @apply flex items-center justify-center space-x-1;
}

.step-number {
  @apply text-xs font-semibold;
}

.step-title {
  @apply text-xs leading-tight;
}

.step-checkmark {
  @apply absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs;
}

.step-button:not(.step-current):not(.step-completed) {
  @apply bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700;
}

.step-button.step-current {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-700/50 dark:text-blue-100 border-blue-400 dark:border-blue-500 shadow-md transform scale-105 relative;
}

.step-button.step-current::after {
  content: '';
  @apply absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 rounded-full;
}

.step-button.step-current.step-completed::after {
  @apply bg-green-500;
}

.step-button.step-completed {
  @apply bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200 border-green-300 dark:border-green-600;
}

.step-button.step-required:not(.step-completed):not(.step-current) {
  @apply border-red-300 dark:border-red-600;
}

.step-button:hover:not(.step-current) {
  @apply shadow-sm;
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
