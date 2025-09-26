<template>
  <div class="superpower-step">
    <div class="step-header">
      <h2>Коротко о себе</h2>
      <p>Твоя суперспособность или фишка (до 200 символов)</p>
    </div>

    <div class="step-content">
      <!-- Text Area -->
      <div class="textarea-container">
        <textarea
          :value="profile?.superpower || ''"
          @input="updateSuperpower(($event.target as HTMLTextAreaElement).value)"
          :placeholder="placeholder"
          rows="4"
          maxlength="200"
          class="textarea"
          :class="{ 
            'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500': validationError,
            'border-green-300 dark:border-green-600': isValid && (profile?.superpower?.length || 0) > 0
          }"
        ></textarea>
        
        <!-- Character Counter -->
        <div class="character-counter">
          {{ characterCount }}/200
        </div>
      </div>

      <!-- Character Counter Bar -->
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :class="getCounterBarColor()"
          :style="{ width: `${(characterCount / 200) * 100}%` }"
        ></div>
      </div>

      <!-- Validation Error -->
      <div v-if="validationError" class="validation-error">
        <p>{{ validationError }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="isValid && (profile?.superpower?.length || 0) > 0" class="success-message">
        <p>✓ Отлично! Ваше описание соответствует требованиям</p>
      </div>

      <!-- Examples -->
      <div class="examples-section">
        <h4>💡 Примеры хороших описаний:</h4>
        <ul class="examples-list">
          <li>"Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте."</li>
          <li>"Помогаю бизнесу автоматизировать продажи через AI-воронки. Увеличиваю конверсию в 2-3 раза."</li>
          <li>"Специализируюсь на обучении нейросетям. За 5 лет обучил 500+ предпринимателей."</li>
        </ul>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <h4>⚡ Советы для создания цепляющего описания:</h4>
        <ul class="tips-list">
          <li>Укажите конкретный результат, который вы даете клиентам</li>
          <li>Используйте цифры и метрики, если они есть</li>
          <li>Избегайте общих фраз типа "качественно и быстро"</li>
          <li>Покажите свою уникальность и экспертность</li>
        </ul>
      </div>

      <!-- Public Links Section -->
      <div class="public-links-section">
        <div class="section-header">
          <h3>🔗 Публичные ссылки</h3>
          <p>Добавьте ссылки на ваши сервисы, сайты, соцсети и другие ресурсы</p>
        </div>

        <!-- Links List -->
        <div class="links-list">
          <div 
            v-for="link in profile?.publicLinks || []" 
            :key="link.id"
            class="link-item"
          >
            <div class="link-content">
              <div class="link-header">
                <h4 class="link-title">{{ link.title }}</h4>
                <div class="link-actions">
                  <button 
                    @click="editLink(link)"
                    class="btn-edit"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="removeLink(link.id)"
                    class="btn-remove"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <a 
                :href="link.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="link-url"
              >
                {{ link.url }}
              </a>
            </div>
          </div>

          <!-- Add Link Button -->
          <button 
            @click="showAddLinkForm = true"
            class="add-link-btn"
            v-if="!showAddLinkForm"
          >
            ➕ Добавить ссылку
          </button>

          <!-- Add/Edit Link Form -->
          <div v-if="showAddLinkForm" class="link-form">
            <h4>{{ editingLink ? 'Редактировать ссылку' : 'Добавить ссылку' }}</h4>
            
            <div class="form-group">
              <label for="link-title">Название *</label>
              <input
                id="link-title"
                v-model="linkForm.title"
                type="text"
                placeholder="Например: Мой сайт, Telegram канал, GitHub"
                class="form-input"
                :class="{ 'error': linkFormErrors.title }"
              />
              <span v-if="linkFormErrors.title" class="error-text">{{ linkFormErrors.title }}</span>
            </div>

            <div class="form-group">
              <label for="link-url">URL *</label>
              <input
                id="link-url"
                v-model="linkForm.url"
                type="url"
                placeholder="https://example.com"
                class="form-input"
                :class="{ 'error': linkFormErrors.url }"
              />
              <span v-if="linkFormErrors.url" class="error-text">{{ linkFormErrors.url }}</span>
            </div>


            <div class="form-actions">
              <button @click="saveLink" class="btn btn-primary" :disabled="!isLinkFormValid">
                {{ editingLink ? 'Сохранить' : 'Добавить' }}
              </button>
              <button @click="cancelLinkForm" class="btn btn-secondary">
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { NeuralNetworkProfile, PublicLinkItem } from '@/types/neural-network-profile-simple'

interface Props {
  profile: NeuralNetworkProfile | null
}

interface Emits {
  (e: 'update', updates: Partial<NeuralNetworkProfile>): void
  (e: 'complete', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const validationError = ref('')
const placeholder = 'Создаю нейроассистентов, которые отвечают вместо вас и приносят клиентов на автопилоте.'

// Public links state
const showAddLinkForm = ref(false)
const editingLink = ref<PublicLinkItem | null>(null)
const linkForm = ref({
  title: '',
  url: ''
})
const linkFormErrors = ref({
  title: '',
  url: ''
})

const characterCount = computed(() => {
  return props.profile?.superpower?.length || 0
})

const isValid = computed(() => {
  const text = props.profile?.superpower || ''
  return text.length >= 10 && text.length <= 200 && text.trim().length > 0
})

// Link form validation
const isLinkFormValid = computed(() => {
  return linkForm.value.title.trim().length > 0 && 
         linkForm.value.url.trim().length > 0 &&
         isValidUrl(linkForm.value.url)
})

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const getCounterBarColor = () => {
  const count = characterCount.value
  if (count === 0) return 'bg-gray-300'
  if (count < 10) return 'bg-red-400'
  if (count <= 150) return 'bg-green-400'
  if (count <= 180) return 'bg-yellow-400'
  return 'bg-red-400'
}

const updateSuperpower = (value: string) => {
  emit('update', { superpower: value })
  validateStep()
}

const validateStep = () => {
  validationError.value = ''
  const text = (props.profile?.superpower || '').trim()
  
  if (!text) {
    validationError.value = 'Поле обязательно для заполнения'
  } else if (text.length < 10) {
    validationError.value = 'Минимум 10 символов'
  } else if (text.length > 200) {
    validationError.value = 'Максимум 200 символов'
  }
}

// Public links methods

const editLink = (link: PublicLinkItem) => {
  editingLink.value = link
  linkForm.value = {
    title: link.title,
    url: link.url
  }
  showAddLinkForm.value = true
}

const removeLink = (linkId: string) => {
  const currentLinks = props.profile?.publicLinks || []
  const updatedLinks = currentLinks.filter(link => link.id !== linkId)
  emit('update', { publicLinks: updatedLinks })
}

const saveLink = () => {
  if (!isLinkFormValid.value) {
    validateLinkForm()
    return
  }

  const currentLinks = props.profile?.publicLinks || []
  
  if (editingLink.value) {
    // Update existing link
    const updatedLinks = currentLinks.map(link => 
      link.id === editingLink.value!.id 
        ? { ...link, ...linkForm.value }
        : link
    )
    emit('update', { publicLinks: updatedLinks })
  } else {
    // Add new link
    const newLink: PublicLinkItem = {
      id: Date.now().toString(),
      ...linkForm.value
    }
    emit('update', { publicLinks: [...currentLinks, newLink] })
  }
  
  cancelLinkForm()
}

const cancelLinkForm = () => {
  showAddLinkForm.value = false
  editingLink.value = null
  resetLinkForm()
}

const resetLinkForm = () => {
  linkForm.value = {
    title: '',
    url: ''
  }
  linkFormErrors.value = {
    title: '',
    url: ''
  }
}

const validateLinkForm = () => {
  linkFormErrors.value = {
    title: '',
    url: ''
  }

  if (!linkForm.value.title.trim()) {
    linkFormErrors.value.title = 'Название обязательно'
  }

  if (!linkForm.value.url.trim()) {
    linkFormErrors.value.url = 'URL обязателен'
  } else if (!isValidUrl(linkForm.value.url)) {
    linkFormErrors.value.url = 'Введите корректный URL'
  }
}


// Watch for changes and validate
watch(() => props.profile?.superpower, validateStep)
</script>

<style scoped>
.superpower-step {
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

.textarea-container {
  @apply relative mb-4;
}

.textarea {
  @apply w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none;
}

.character-counter {
  @apply absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-1 rounded;
}

.progress-bar {
  @apply w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4;
}

.progress-fill {
  @apply h-2 rounded-full transition-all duration-300;
}

.validation-error {
  @apply p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md mb-4;
}

.validation-error p {
  @apply text-sm text-red-600 dark:text-red-400;
}

.success-message {
  @apply p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md mb-4;
}

.success-message p {
  @apply text-sm text-green-600 dark:text-green-400;
}

.examples-section {
  @apply p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4;
}

.examples-section h4 {
  @apply text-sm font-medium text-blue-900 dark:text-blue-200 mb-2;
}

.examples-list {
  @apply text-sm text-blue-800 dark:text-blue-300 space-y-1;
}

.examples-list li {
  @apply list-disc list-inside;
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

.btn-secondary {
  @apply text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Public Links Styles */
.public-links-section {
  @apply mt-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg;
}

.section-header {
  @apply mb-4;
}

.section-header h3 {
  @apply text-lg font-semibold text-gray-900 dark:text-white mb-1;
}

.section-header p {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.links-list {
  @apply space-y-3;
}

.link-item {
  @apply bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4;
}

.link-content {
  @apply space-y-2;
}

.link-header {
  @apply flex items-center justify-between;
}

.link-title {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.link-actions {
  @apply flex space-x-2;
}

.btn-edit, .btn-remove {
  @apply p-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors;
}

.link-url {
  @apply text-sm text-blue-600 dark:text-blue-400 hover:underline break-all;
}


.add-link-btn {
  @apply w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors;
}

.link-form {
  @apply bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4;
}

.link-form h4 {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.form-group {
  @apply space-y-1;
}

.form-group label {
  @apply block text-xs font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white;
}

.form-input.error {
  @apply border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500;
}

.error-text {
  @apply text-xs text-red-600 dark:text-red-400;
}

.form-actions {
  @apply flex space-x-2;
}
</style>
