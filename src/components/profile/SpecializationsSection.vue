<template>
  <div class="specializations-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Специализации и навыки
    </h2>

    <!-- Specializations -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Основные специализации
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="specialization in specializations"
          :key="specialization"
          class="specialization-card flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 
                 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 
                 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ specialization }}
            </h4>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {{ getSpecializationDescription(specialization) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Abilities -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Практические навыки
      </h3>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="ability in abilities"
          :key="ability"
          class="ability-tag inline-flex items-center px-4 py-2 text-sm font-medium 
                 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 
                 rounded-full border border-green-200 dark:border-green-800 
                 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors cursor-default"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ ability }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpecializationsSectionProps } from '@/types/specialist-profile-view'

interface Props {
  specializations: SpecializationsSectionProps['specializations']
  abilities: SpecializationsSectionProps['abilities']
}

const props = defineProps<Props>()

// Method to get description for specializations
const getSpecializationDescription = (specialization: string): string => {
  const descriptions: Record<string, string> = {
    'Нейроассистенты (AI-боты)': 'Создание умных чат-ботов и виртуальных помощников',
    'Нейроворонки (продажи + автоматизация)': 'Автоматизация процессов продаж с помощью ИИ',
    'Контент с помощью нейросетей': 'Генерация текстового и визуального контента',
    'Визуалы (обложки, графика, Reels)': 'Создание графического контента через AI',
    'Обработка аудио и видео': 'Работа с мультимедийным контентом',
    'Базы промптов': 'Создание библиотек промптов для различных задач',
    'Настройка чат-ботов': 'Конфигурация и настройка чат-ботов',
    'Обучение других нейросетям': 'Консультации и обучение работе с ИИ'
  }
  
  return descriptions[specialization] || 'Экспертиза в данной области'
}
</script>

<style scoped>
/* Card hover effects */
.specialization-card {
  transition: all 0.2s ease;
}

.specialization-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.ability-tag {
  transition: all 0.2s ease;
}

.ability-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.15);
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .specialization-card {
    padding: 1rem;
  }
  
  .ability-tag {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}

/* Animation for section reveal */
.specializations-section {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus states for accessibility */
.specialization-card:focus-within,
.ability-tag:focus-within {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
</style>