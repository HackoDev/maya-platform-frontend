<template>
  <div class="neural-network-profile-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Анкета нейросетевого специалиста
        </h1>
      </div>
    </div> -->

    <NeuralNetworkProfileFormSimple
      @submit="handleSubmit"
      @save-draft="handleSaveDraft"
    />
  </div>
</template>

<script setup lang="ts">
import NeuralNetworkProfileFormSimple from '@/components/profile/NeuralNetworkProfileFormSimple.vue'
import type { NeuralNetworkProfile } from '@/types/neural-network-profile-simple'

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
</script>