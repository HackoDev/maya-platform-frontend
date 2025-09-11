<template>
  <div class="portfolio-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 4. Примеры работ / портфолио
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Покажи свои лучшие кейсы
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Залей ссылки или прикрепи визуалы. Это поможет клиентам оценить качество ваших работ (необязательно)
      </p>
    </div>

    <div class="space-y-6">
      <!-- Portfolio Cases -->
      <div v-if="portfolio.length > 0" class="space-y-4">
        <div
          v-for="(portfolioCase, index) in portfolio"
          :key="portfolioCase.id"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Кейс #{{ index + 1 }}
            </h4>
            <button
              @click="removeCase(index)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Название кейса
              </label>
              <input
                v-model="portfolioCase.title"
                type="text"
                placeholder="Нейроассистент для стоматологии"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @input="updatePortfolio"
              />
            </div>

            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Тип кейса
              </label>
              <select
                v-model="portfolioCase.type"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @change="updatePortfolio"
              >
                <option value="text">Текстовое описание</option>
                <option value="link">Ссылка</option>
                <option value="visual">Визуал/Скриншот</option>
                <option value="bot">Чат-бот</option>
                <option value="landing">Лендинг</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание проекта
            </label>
            <textarea
              v-model="portfolioCase.description"
              rows="3"
              placeholder="Кратко опишите суть проекта, что делали..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
              @input="updatePortfolio"
            ></textarea>
          </div>

          <!-- Content -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ getContentLabel(portfolioCase.type) }}
            </label>
            <input
              v-if="portfolioCase.type === 'link' || portfolioCase.type === 'bot' || portfolioCase.type === 'landing'"
              v-model="portfolioCase.content"
              type="url"
              :placeholder="getContentPlaceholder(portfolioCase.type)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              @input="updatePortfolio"
            />
            <textarea
              v-else-if="portfolioCase.type === 'text'"
              v-model="portfolioCase.content"
              rows="3"
              placeholder="Подробное описание результата..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
              @input="updatePortfolio"
            ></textarea>
            <div
              v-else-if="portfolioCase.type === 'visual'"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Загрузка файлов будет реализована позже
              </p>
              <input
                v-model="portfolioCase.content"
                type="url"
                placeholder="Пока можете вставить ссылку на изображение"
                class="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @input="updatePortfolio"
              />
            </div>
          </div>

          <!-- Result & Tools -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Результат
              </label>
              <input
                v-model="portfolioCase.result"
                type="text"
                placeholder="Увеличил конверсию на 30%"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                @input="updatePortfolio"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Инструменты (через запятую)
              </label>
              <input
                :value="portfolioCase.tools?.join(', ') || ''"
                @input="updateCaseTools(index, ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="ChatGPT, Midjourney, Tilda"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Case Button -->
      <div class="text-center">
        <button
          @click="addCase"
          :disabled="portfolio.length >= 10"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить кейс ({{ portfolio.length }}/10)
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="portfolio.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Пока нет кейсов
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Добавьте примеры своих работ, чтобы показать экспертность
        </p>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h4 class="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">
          💡 Советы по оформлению кейсов:
        </h4>
        <ul class="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
          <li>• Указывайте конкретные результаты (цифры, метрики)</li>
          <li>• Показывайте скриншоты или ссылки на работающие решения</li>
          <li>• Описывайте задачу и ваше решение кратко, но понятно</li>
          <li>• Лучше 2-3 качественных кейса, чем 10 поверхностных</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NeuralNetworkFormState, PortfolioCase } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const portfolio = computed({
  get: () => props.formState.portfolio,
  set: (value) => emit('update', 'portfolio', 'cases', value)
})

const addCase = () => {
  const newCase: PortfolioCase = {
    id: Date.now().toString(),
    title: '',
    description: '',
    type: 'text',
    content: '',
    result: '',
    tools: [],
    createdAt: new Date().toISOString()
  }
  
  const updated = [...portfolio.value, newCase]
  portfolio.value = updated
}

const removeCase = (index: number) => {
  const updated = portfolio.value.filter((_, i) => i !== index)
  portfolio.value = updated
}

const updatePortfolio = () => {
  // Trigger reactivity update
  portfolio.value = [...portfolio.value]
}

const updateCaseTools = (index: number, toolsString: string) => {
  const tools = toolsString.split(',').map(tool => tool.trim()).filter(tool => tool.length > 0)
  portfolio.value[index].tools = tools
  updatePortfolio()
}

const getContentLabel = (type: string): string => {
  switch (type) {
    case 'link': return 'Ссылка на проект'
    case 'visual': return 'Изображение/Скриншот'
    case 'bot': return 'Ссылка на бота'
    case 'landing': return 'Ссылка на лендинг'
    case 'text': return 'Описание результата'
    default: return 'Контент'
  }
}

const getContentPlaceholder = (type: string): string => {
  switch (type) {
    case 'link': return 'https://example.com/project'
    case 'bot': return 'https://t.me/your_bot'
    case 'landing': return 'https://example.tilda.ws'
    default: return 'https://example.com'
  }
}

// Watch for changes and validate
watch(() => props.formState.portfolio, () => {
  // Portfolio is optional, so just emit validation
  emit('validate', '4')
}, { deep: true })
</script>