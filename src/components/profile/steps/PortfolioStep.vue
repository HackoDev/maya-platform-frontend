<template>
  <div class="portfolio-step">
    <div class="step-header">
      <h2>Примеры работ / портфолио</h2>
      <p>Покажи свои лучшие кейсы. Залей ссылки или прикрепи визуалы (необязательно)</p>
    </div>

    <div class="step-content">
      <!-- Portfolio Cases -->
      <div v-if="portfolio.length > 0" class="portfolio-cases">
        <div
          v-for="(item, index) in portfolio"
          :key="item.id"
          class="portfolio-item"
        >
          <div class="item-header">
            <h4>Кейс #{{ index + 1 }}</h4>
            <button
              @click="removePortfolioItem(index)"
              class="remove-button"
              type="button"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="item-content">
            <div class="form-grid">
              <!-- Title -->
              <div class="form-group">
                <label>Название кейса</label>
                <input
                  v-model="item.title"
                  type="text"
                  placeholder="Нейроассистент для стоматологии"
                  class="form-input"
                  @input="updatePortfolio"
                />
              </div>

              <!-- Type -->
              <div class="form-group">
                <label>Тип кейса</label>
                <select
                  v-model="item.type"
                  class="form-select"
                  @change="updatePortfolio"
                >
                  <option value="text">Текстовое описание</option>
                  <option value="link">Ссылка</option>
                  <option value="image">Визуал/Скриншот</option>
                  <option value="bot">Чат-бот</option>
                  <option value="landing">Лендинг</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label>Описание проекта</label>
              <textarea
                v-model="item.description"
                rows="3"
                placeholder="Кратко опишите суть проекта, что делали..."
                class="form-textarea"
                @input="updatePortfolio"
              ></textarea>
            </div>

            <!-- Content -->
            <div class="form-group">
              <label>{{ getContentLabel(item.type) }}</label>
              <input
                v-if="item.type === 'link' || item.type === 'bot' || item.type === 'landing'"
                v-model="item.content"
                type="url"
                :placeholder="getContentPlaceholder(item.type)"
                class="form-input"
                @input="updatePortfolio"
              />
              <textarea
                v-else-if="item.type === 'text'"
                v-model="item.content"
                rows="3"
                placeholder="Подробное описание результата..."
                class="form-textarea"
                @input="updatePortfolio"
              ></textarea>
              <div
                v-else-if="item.type === 'image'"
                class="image-upload-placeholder"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Загрузка файлов будет реализована позже
                </p>
                <input
                  v-model="item.content"
                  type="url"
                  placeholder="Пока можете вставить ссылку на изображение"
                  class="form-input mt-2"
                  @input="updatePortfolio"
                />
              </div>
            </div>

            <!-- Result & Tools -->
            <div class="form-grid">
              <div class="form-group">
                <label>Результат</label>
                <input
                  v-model="item.result"
                  type="text"
                  placeholder="Увеличил конверсию на 30%"
                  class="form-input"
                  @input="updatePortfolio"
                />
              </div>
              <div class="form-group">
                <label>Инструменты</label>
                <input
                  v-model="item.tools"
                  type="text"
                  placeholder="ChatGPT, Midjourney, Tilda"
                  class="form-input"
                  @input="updatePortfolio"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Case Button -->
      <div class="add-section">
        <button
          @click="addPortfolioItem"
          :disabled="portfolio.length >= 10"
          class="add-button"
          type="button"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить кейс ({{ portfolio.length }}/10)
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="portfolio.length === 0" class="empty-state">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3>Пока нет кейсов</h3>
        <p>Добавьте примеры своих работ, чтобы показать экспертность</p>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <h4>💡 Советы по оформлению кейсов:</h4>
        <ul class="tips-list">
          <li>Указывайте конкретные результаты (цифры, метрики)</li>
          <li>Показывайте скриншоты или ссылки на работающие решения</li>
          <li>Описывайте задачу и ваше решение кратко, но понятно</li>
          <li>Лучше 2-3 качественных кейса, чем 10 поверхностных</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NeuralNetworkProfile, PortfolioItem } from '@/types/neural-network-profile-simple'

interface Props {
  profile: NeuralNetworkProfile | null
}

interface Emits {
  (e: 'update', updates: Partial<NeuralNetworkProfile>): void
  (e: 'complete', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const portfolio = computed({
  get: () => props.profile?.portfolio || [],
  set: (value) => emit('update', { portfolio: value })
})

const addPortfolioItem = () => {
  const newItem: PortfolioItem = {
    id: Date.now().toString(),
    title: '',
    description: '',
    type: 'text',
    content: '',
    result: '',
    tools: ''
  }
  
  portfolio.value = [...portfolio.value, newItem]
}

const removePortfolioItem = (index: number) => {
  const updated = portfolio.value.filter((_, i) => i !== index)
  portfolio.value = updated
}

const updatePortfolio = () => {
  // Trigger reactivity update
  portfolio.value = [...portfolio.value]
}


const getContentLabel = (type: string): string => {
  switch (type) {
    case 'link': return 'Ссылка на проект'
    case 'image': return 'Изображение/Скриншот'
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

</script>

<style scoped>
.portfolio-step {
  @apply w-full p-6;
}

.step-header {
  @apply mb-4;
}

.step-header h2 {
  @apply text-2xl font-bold text-gray-900 dark:text-white mb-2;
}

.step-header p {
  @apply text-gray-600 dark:text-gray-400;
}

.portfolio-cases {
  @apply space-y-6 mb-4;
}

.portfolio-item {
  @apply border border-gray-200 dark:border-gray-600 rounded-lg p-6;
}

.item-header {
  @apply flex justify-between items-center mb-4;
}

.item-header h4 {
  @apply text-lg font-medium text-gray-900 dark:text-white;
}

.remove-button {
  @apply text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-4;
}

.form-group {
  @apply mb-4;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm;
}

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none;
}

.image-upload-placeholder {
  @apply border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center;
}

.add-section {
  @apply text-center mb-4;
}

.add-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.empty-state {
  @apply text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4;
}

.empty-state h3 {
  @apply text-lg font-medium text-gray-900 dark:text-white mb-2;
}

.empty-state p {
  @apply text-gray-500 dark:text-gray-400;
}

.tips-section {
  @apply p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4;
}

.tips-section h4 {
  @apply text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2;
}

.tips-list {
  @apply text-sm text-yellow-800 dark:text-yellow-300 space-y-1;
}

.tips-list li {
  @apply list-disc list-inside;
}

.step-actions {
  @apply flex justify-end;
}

.btn {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-colors;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style>
