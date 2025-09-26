<template>
  <div class="experience-step">
    <div class="step-header">
      <h2>С кем работал и что делал?</h2>
      <p>Опишите свой опыт работы с клиентами — это повысит доверие (необязательно)</p>
    </div>

    <div class="step-content">
      <!-- Experience Entries -->
      <div v-if="experience.length > 0" class="experience-list">
        <div
          v-for="(entry, index) in experience"
          :key="entry.id"
          class="experience-item"
        >
          <div class="item-header">
            <h4>Проект #{{ index + 1 }}</h4>
            <button
              @click="removeExperience(index)"
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
              <!-- Client -->
              <div class="form-group">
                <label>Клиент / Компания</label>
                <input
                  v-model="entry.client"
                  type="text"
                  placeholder="ООО Стоматология или Иван И."
                  class="form-input"
                  @input="updateExperience"
                />
              </div>

              <!-- Year -->
              <div class="form-group">
                <label>Год</label>
                <input
                  v-model="entry.year"
                  type="text"
                  placeholder="2023"
                  class="form-input"
                  @input="updateExperience"
                />
              </div>
            </div>

            <!-- Task -->
            <div class="form-group">
              <label>Что делал</label>
              <textarea
                v-model="entry.task"
                rows="2"
                placeholder="Создавал нейроассистента для записи клиентов в стоматологию..."
                class="form-textarea"
                @input="updateExperience"
              ></textarea>
            </div>

            <!-- Result -->
            <div class="form-group">
              <label>Результат</label>
              <textarea
                v-model="entry.result"
                rows="2"
                placeholder="Увеличили количество записей на 40%, автоматизировали 80% обращений..."
                class="form-textarea"
                @input="updateExperience"
              ></textarea>
            </div>

            <div class="form-grid">
              <!-- Tools -->
              <div class="form-group">
                <label>Инструменты</label>
                <input
                  v-model="entry.tools"
                  type="text"
                  placeholder="ChatGPT, Telegram Bot API, Make.com"
                  class="form-input"
                  @input="updateExperience"
                />
              </div>

              <!-- Duration -->
              <div class="form-group">
                <label>Длительность проекта</label>
                <input
                  v-model="entry.duration"
                  type="text"
                  placeholder="2 недели"
                  class="form-input"
                  @input="updateExperience"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Entry Button -->
      <div class="add-section">
        <button
          @click="addExperience"
          :disabled="experience.length >= 20"
          class="add-button"
          type="button"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить проект ({{ experience.length }}/20)
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="experience.length === 0" class="empty-state">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3>Пока нет опыта работы</h3>
        <p>Добавьте информацию о ваших проектах для повышения доверия</p>
      </div>

      <!-- Experience Summary -->
      <div v-if="experience.length > 0" class="summary-section">
        <div class="summary-card">
          <h4>💼 Добавлено проектов: {{ experience.length }}</h4>
          <p>Отлично! Ваш опыт поможет клиентам понять уровень экспертности.</p>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <h4>💡 Советы по описанию опыта:</h4>
        <ul class="tips-list">
          <li><strong>Конкретность:</strong> указывайте измеримые результаты (проценты, цифры)</li>
          <li><strong>Актуальность:</strong> начинайте с самых недавних проектов</li>
          <li><strong>Релевантность:</strong> выбирайте проекты, близкие к вашим услугам</li>
          <li><strong>Честность:</strong> не приукрашивайте результаты, клиенты это оценят</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NeuralNetworkProfile, ExperienceItem } from '@/types/neural-network-profile-simple'

interface Props {
  profile: NeuralNetworkProfile | null
}

interface Emits {
  (e: 'update', updates: Partial<NeuralNetworkProfile>): void
  (e: 'complete', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const experience = computed({
  get: () => props.profile?.experience || [],
  set: (value) => emit('update', { experience: value })
})

const addExperience = () => {
  const newEntry: ExperienceItem = {
    id: Date.now().toString(),
    client: '',
    task: '',
    result: '',
    tools: '',
    duration: '',
    year: new Date().getFullYear().toString()
  }
  
  experience.value = [...experience.value, newEntry]
}

const removeExperience = (index: number) => {
  const updated = experience.value.filter((_, i) => i !== index)
  experience.value = updated
}

const updateExperience = () => {
  // Trigger reactivity update
  experience.value = [...experience.value]
}


</script>

<style scoped>
.experience-step {
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

.experience-list {
  @apply space-y-6 mb-4;
}

.experience-item {
  @apply border border-gray-200 dark:border-gray-600 rounded-lg p-6;
}

.item-header {
  @apply flex justify-between items-start mb-4;
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

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none;
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

.summary-section {
  @apply mb-4;
}

.summary-card {
  @apply p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg;
}

.summary-card h4 {
  @apply text-sm font-medium text-green-900 dark:text-green-200 mb-2;
}

.summary-card p {
  @apply text-sm text-green-800 dark:text-green-300;
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
