<template>
  <div class="neural-network-profile-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with test data controls -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Анкета нейросетевого специалиста
          </h1>
          
          <!-- Test Data Controls -->
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">Тестовые данные:</span>
            <button
              @click="loadTestData('empty')"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                currentTestData === 'empty'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              Пустая
            </button>
            <button
              @click="loadTestData('partial')"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                currentTestData === 'partial'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              Частичная
            </button>
            <button
              @click="loadTestData('full')"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                currentTestData === 'full'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              Полная
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Component -->
    <NeuralNetworkProfileFormSimple
      :initial-data="currentProfile"
      @submit="handleSubmit"
      @save-draft="handleSaveDraft"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NeuralNetworkProfileFormSimple from '@/components/profile/NeuralNetworkProfileFormSimple.vue'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile-simple'
import { createTestProfile, createEmptyProfile, createPartialProfile } from '@/utils/testData'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

const store = useNeuralNetworkProfileStore()
const currentProfile = ref<NeuralNetworkProfile | null>(null)
const currentTestData = ref<'empty' | 'partial' | 'full'>('empty')

// Load test data
const loadTestData = (type: 'empty' | 'partial' | 'full') => {
  currentTestData.value = type
  
  switch (type) {
    case 'empty':
      currentProfile.value = createEmptyProfile()
      break
    case 'partial':
      currentProfile.value = createPartialProfile()
      break
    case 'full':
      currentProfile.value = createTestProfile()
      break
  }
  
  // Update store with new data
  if (currentProfile.value) {
    store.updateProfile(currentProfile.value)
  }
}

// Handle form submission
const handleSubmit = (data: NeuralNetworkProfile) => {
  console.log('Profile submitted:', data)
  // Here you would typically send data to backend
  alert('Анкета успешно отправлена! (Это тестовая версия)')
}

// Handle draft saving
const handleSaveDraft = (data: NeuralNetworkProfile) => {
  console.log('Draft saved:', data)
  // Here you would typically save draft to backend
  console.log('Черновик сохранен!')
}

// Initialize with empty profile
onMounted(() => {
  loadTestData('empty')
})
</script>