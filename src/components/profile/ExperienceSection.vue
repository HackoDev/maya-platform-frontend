<template>
  <div class="experience-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Опыт работы
    </h2>
    
    <div class="space-y-6">
      <div
        v-for="exp in experience"
        :key="exp.id"
        class="experience-card bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ exp.client }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ exp.task }}
        </p>
        <div class="text-sm text-green-600 dark:text-green-400">
          {{ exp.result }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExperienceSectionProps } from '@/types/specialist-profile-view'

interface Props {
  experience: ExperienceSectionProps['experience']
}

const props = defineProps<Props>()
</script>