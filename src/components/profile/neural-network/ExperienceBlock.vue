<template>
  <div class="experience-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 6. С кем работал и что делал?
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Опыт работы с клиентами
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Опишите свой опыт работы с клиентами — это повысит доверие (необязательно)
      </p>
    </div>

    <div class="space-y-6">
      <!-- Experience Entries -->
      <div v-if="experience.length > 0" class="space-y-4">
        <div
          v-for="(entry, index) in experience"
          :key="entry.id"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Проект #{{ index + 1 }}
            </h4>
            <button
              @click="removeEntry(index)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Client -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Клиент / Компания
              </label>
              <input
                v-model="entry.client"
                type="text"
                placeholder="ООО Стоматология или Иван И."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @input="updateExperience"
              />
            </div>

            <!-- Year -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Год
              </label>
              <input
                v-model="entry.year"
                type="text"
                placeholder="2023"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @input="updateExperience"
              />
            </div>
          </div>

          <!-- Task -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Что делал
            </label>
            <textarea
              v-model="entry.task"
              rows="2"
              placeholder="Создавал нейроассистента для записи клиентов в стоматологию..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
              @input="updateExperience"
            ></textarea>
          </div>

          <!-- Result -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Результат
            </label>
            <textarea
              v-model="entry.result"
              rows="2"
              placeholder="Увеличили количество записей на 40%, автоматизировали 80% обращений..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
              @input="updateExperience"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <!-- Tools -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Инструменты (через запятую)
              </label>
              <input
                :value="entry.tools?.join(', ') || ''"
                @input="updateEntryTools(index, ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="ChatGPT, Telegram Bot API, Make.com"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            <!-- Duration -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Длительность проекта
              </label>
              <input
                v-model="entry.duration"
                type="text"
                placeholder="2 недели"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @input="updateExperience"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Add Entry Button -->
      <div class="text-center">
        <button
          @click="addEntry"
          :disabled="experience.length >= 20"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить проект ({{ experience.length }}/20)
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="experience.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Пока нет опыта работы
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Добавьте информацию о ваших проектах для повышения доверия
        </p>
      </div>

      <!-- Experience Summary -->
      <div v-if="experience.length > 0" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h4 class="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
          💼 Добавлено проектов: {{ experience.length }}
        </h4>
        <div class="text-sm text-green-800 dark:text-green-300">
          Отлично! Ваш опыт поможет клиентам понять уровень экспертности.
        </div>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h4 class="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">
          💡 Советы по описанию опыта:
        </h4>
        <ul class="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
          <li>• <strong>Конкретность:</strong> указывайте измеримые результаты (проценты, цифры)</li>
          <li>• <strong>Актуальность:</strong> начинайте с самых недавних проектов</li>
          <li>• <strong>Релевантность:</strong> выбирайте проекты, близкие к вашим услугам</li>
          <li>• <strong>Честность:</strong> не приукрашивайте результаты, клиенты это оценят</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { NeuralNetworkFormState, ExperienceEntry } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const experience = computed({
  get: () => props.formState.experience,
  set: (value) => emit('update', 'experience', 'entries', value)
})

const addEntry = () => {
  const newEntry: ExperienceEntry = {
    id: Date.now().toString(),
    client: '',
    task: '',
    tools: [],
    result: '',
    duration: '',
    year: new Date().getFullYear().toString()
  }
  
  const updated = [...experience.value, newEntry]
  experience.value = updated
}

const removeEntry = (index: number) => {
  const updated = experience.value.filter((_, i) => i !== index)
  experience.value = updated
}

const updateExperience = () => {
  // Trigger reactivity update
  experience.value = [...experience.value]
}

const updateEntryTools = (index: number, toolsString: string) => {
  const tools = toolsString.split(',').map(tool => tool.trim()).filter(tool => tool.length > 0)
  experience.value[index].tools = tools
  updateExperience()
}

// Watch for changes and validate
watch(() => props.formState.experience, () => {
  // Experience is optional, so just emit validation
  emit('validate', '6')
}, { deep: true })
</script>