<template>
  <div class="neural-network-questionnaire-form">
    <!-- Progress Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Анкета нейросетевого специалиста
          </h1>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ store.getCompletionPercentage }}% завершено
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${store.getCompletionPercentage}%` }"
          ></div>
        </div>

        <!-- Block Navigation -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button
            v-for="block in blocks"
            :key="block.id"
            @click="currentBlock = block.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentBlock === block.id
                ? 'bg-blue-600 text-white'
                : store.getBlockValidationStatus(block.id.toString())
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            ]"
          >
            {{ block.id }}. {{ block.shortTitle }}
            <span v-if="store.getBlockValidationStatus(block.id.toString())" class="ml-1">✓</span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Block Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <!-- Block 1: Specializations -->
          <SpecializationsBlock
            v-if="currentBlock === 1"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />

          <!-- Block 2: Superpower -->
          <SuperpowerBlock
            v-if="currentBlock === 2"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />

          <!-- Block 3: Abilities -->
          <AbilitiesBlock
            v-if="currentBlock === 3"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />

          <!-- Block 4: Portfolio -->
          <PortfolioBlock
            v-if="currentBlock === 4"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />

          <!-- Block 5: Services -->
          <ServicesBlock
            v-if="currentBlock === 5"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />

          <!-- Block 6: Experience -->
          <ExperienceBlock
            v-if="currentBlock === 6"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />

          <!-- Block 7: Testimonials -->
          <TestimonialsBlock
            v-if="currentBlock === 7"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />

          <!-- Block 8: Contacts -->
          <ContactsBlock
            v-if="currentBlock === 8"
            :form-state="store.formState"
            @update="handleFormUpdate"
            @validate="handleBlockValidation"
          />
        </div>

        <!-- Navigation Footer -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between">
          <button
            @click="previousBlock"
            :disabled="currentBlock === 1"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Назад
          </button>

          <div class="flex space-x-3">
            <button
              v-if="store.formState.isDirty"
              @click="saveDraft"
              :disabled="store.isSaving"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50"
            >
              <span v-if="store.isSaving">Сохранение...</span>
              <span v-else>Сохранить черновик</span>
            </button>

            <button
              v-if="currentBlock === 8 && store.canSubmitProfile"
              @click="submitProfile"
              :disabled="store.isSaving"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <span v-if="store.isSaving">Отправка...</span>
              <span v-else>Отправить на проверку</span>
            </button>

            <button
              v-else
              @click="nextBlock"
              :disabled="currentBlock === 8"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее →
            </button>
          </div>
        </div>
      </div>

      <!-- Auto-save indicator -->
      <div v-if="store.formState.lastAutoSave" class="mt-4 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Последнее автосохранение: {{ formatDateTime(store.formState.lastAutoSave) }}
        </p>
      </div>

      <!-- Validation Errors -->
      <div v-if="store.validationErrors.length > 0" class="mt-6">
        <div class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Необходимо исправить ошибки:
          </h3>
          <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li v-for="error in store.validationErrors" :key="`${error.blockId}-${error.fieldId}`">
              Блок {{ error.blockId }}: {{ error.errorMessage }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile'
import SpecializationsBlock from './neural-network/SpecializationsBlock.vue'
import SuperpowerBlock from './neural-network/SuperpowerBlock.vue'
import AbilitiesBlock from './neural-network/AbilitiesBlock.vue'
import PortfolioBlock from './neural-network/PortfolioBlock.vue'
import ServicesBlock from './neural-network/ServicesBlock.vue'
import ExperienceBlock from './neural-network/ExperienceBlock.vue'
import TestimonialsBlock from './neural-network/TestimonialsBlock.vue'
import ContactsBlock from './neural-network/ContactsBlock.vue'

const store = useNeuralNetworkProfileStore()
const currentBlock = ref(1)

const blocks = [
  { id: 1, shortTitle: 'Кто ты?', title: 'Специализации' },
  { id: 2, shortTitle: 'О себе', title: 'Суперспособность' },
  { id: 3, shortTitle: 'Навыки', title: 'Что умеешь?' },
  { id: 4, shortTitle: 'Портфолио', title: 'Примеры работ' },
  { id: 5, shortTitle: 'Услуги', title: 'Цены и услуги' },
  { id: 6, shortTitle: 'Опыт', title: 'Опыт работы' },
  { id: 7, shortTitle: 'Отзывы', title: 'Отзывы и рекомендации' },
  { id: 8, shortTitle: 'Контакты', title: 'Способы связи' }
]

onMounted(() => {
  // Initialize form or load existing profile
  store.initializeForm()
  
  // Set current block to next incomplete block
  const nextIncomplete = store.getNextIncompleteBlock
  if (nextIncomplete) {
    currentBlock.value = nextIncomplete
  }
})

const handleFormUpdate = (blockId: string, fieldId: string, value: any) => {
  store.updateFormField(blockId, fieldId, value)
}

const handleBlockValidation = (blockId: string) => {
  store.validateBlock(blockId)
}

const previousBlock = () => {
  if (currentBlock.value > 1) {
    currentBlock.value--
  }
}

const nextBlock = () => {
  // Validate current block before moving to next
  const errors = store.validateBlock(currentBlock.value.toString())
  
  if (errors.length === 0 && currentBlock.value < 8) {
    currentBlock.value++
  }
}

const saveDraft = async () => {
  try {
    await store.saveDraft()
  } catch (error) {
    console.error('Error saving draft:', error)
    // TODO: Show error notification
  }
}

const submitProfile = async () => {
  try {
    await store.submitProfile()
    // TODO: Show success notification and redirect
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
</script>

<style scoped>
.neural-network-questionnaire-form {
  min-height: 100vh;
  background-color: #f9fafb;
}

@media (prefers-color-scheme: dark) {
  .neural-network-questionnaire-form {
    background-color: #111827;
  }
}
</style>