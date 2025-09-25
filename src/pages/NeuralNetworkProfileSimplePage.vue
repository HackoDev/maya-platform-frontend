<template>
  <div class="neural-network-profile-simple-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Simple header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Упрощенная анкета нейросетевого специалиста
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Тестовая страница для проверки новой упрощенной формы
        </p>
      </div>
    </div>

    <!-- Form Component -->
    <NeuralNetworkProfileFormSimple
      :initial-data="testProfile"
      @submit="handleSubmit"
      @save-draft="handleSaveDraft"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NeuralNetworkProfileFormSimple from '@/components/profile/NeuralNetworkProfileFormSimple.vue'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile-simple'
import { createTestProfile } from '@/utils/testData'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

const store = useNeuralNetworkProfileStore()
const testProfile = ref<NeuralNetworkProfile | null>(null)

// Handle form submission
const handleSubmit = (data: NeuralNetworkProfile) => {
  console.log('Profile submitted:', data)
  alert('Анкета успешно отправлена! (Это тестовая версия)')
}

// Handle draft saving
const handleSaveDraft = (data: NeuralNetworkProfile) => {
  console.log('Draft saved:', data)
  console.log('Черновик сохранен!')
}

// Initialize with test profile
onMounted(() => {
  testProfile.value = createTestProfile()
  if (testProfile.value) {
    store.updateProfile(testProfile.value)
  }
})
</script>

