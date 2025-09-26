<template>
  <div class="testimonials-step">
    <div class="step-header">
      <h2>Отзывы/рекомендации</h2>
      <p>Загрузите фотографии отзывов, рекомендаций и благодарностей от ваших клиентов</p>
    </div>

    <div class="step-content">
      <!-- Photo Gallery -->
      <div v-if="testimonials.length > 0" class="testimonials-gallery">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.id"
          class="testimonial-item group"
        >
          <!-- Photo Preview -->
          <div class="photo-preview">
            <img
              v-if="testimonial.url"
              :src="testimonial.url"
              :alt="testimonial.title || `Отзыв ${index + 1}`"
              class="testimonial-image"
            />
            <div v-else class="placeholder-image">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Photo Info -->
          <div class="photo-info">
            <div class="photo-header">
              <span class="photo-title">Отзыв #{{ index + 1 }}</span>
              <div class="photo-actions">
                <!-- Uploading indicator -->
                <div v-if="uploadingFiles.has(testimonial.id)" class="uploading-indicator">
                  <div class="spinner"></div>
                  <span>Загрузка...</span>
                </div>
                <button
                  v-else
                  @click="removeTestimonial(index)"
                  class="remove-button"
                  type="button"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Title Input -->
            <input
              v-model="testimonial.title"
              type="text"
              placeholder="Название отзыва"
              class="title-input"
              @input="updateTestimonials"
              :disabled="uploadingFiles.has(testimonial.id)"
            />
          </div>
        </div>
      </div>

      <!-- Upload Area -->
      <div class="upload-section">
        <div class="upload-area">
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            @change="handleFileUpload"
            class="hidden"
          />
          
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <h3>Загрузить скриншоты отзывов</h3>
          
          <p class="upload-description">
            Перетащите файлы сюда или нажмите для выбора
          </p>
          
          <button
            @click="fileInput?.click()"
            :disabled="testimonials.length >= 20"
            class="upload-button"
            type="button"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Выбрать файлы ({{ testimonials.length }}/20)
          </button>
          
          <p class="upload-info">
            Поддерживаются: JPG, PNG, WebP. Максимум 5MB на файл
          </p>
        </div>
      </div>

      <!-- Summary -->
      <div v-if="testimonials.length > 0" class="summary-section">
        <div class="summary-card">
          <h4>📸 Загружено отзывов: {{ testimonials.length }}</h4>
          <p>Фотографий: {{ testimonials.length }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="testimonials.length === 0" class="empty-state">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3>Пока нет отзывов</h3>
        <p>Загрузите скриншоты отзывов клиентов для повышения доверия</p>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <h4>💡 Советы по работе с отзывами:</h4>
        <ul class="tips-list">
          <li>Делайте скриншоты отзывов из мессенджеров, соцсетей, email</li>
          <li>Обрезайте лишнее, оставляйте только текст отзыва</li>
          <li>Лучше 3-5 качественных отзывов, чем 20 размытых</li>
          <li>Отзывы с конкретными результатами работают лучше общих похвал</li>
          <li>Можно добавить краткое описание к каждому отзыву</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NeuralNetworkProfile, TestimonialItem } from '@/types/neural-network-profile-simple'
import { portfoliosApi } from '@/services/portfoliosApiClient'

interface Props {
  profile: NeuralNetworkProfile | null
}

interface Emits {
  (e: 'update', updates: Partial<NeuralNetworkProfile>): void
  (e: 'complete', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const uploadingFiles = ref<Set<string>>(new Set())

const testimonials = computed({
  get: () => props.profile?.testimonials || [],
  set: (value) => emit('update', { testimonials: value })
})

const addTestimonial = async (file: File) => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    alert('Неподдерживаемый формат файла. Используйте JPG, PNG или WebP.')
    return
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert('Файл слишком большой. Максимальный размер: 5MB.')
    return
  }

  // Check if we've reached the limit
  if (testimonials.value.length >= 20) {
    alert('Максимальное количество фотографий: 20.')
    return
  }

  const fileId = Date.now().toString()
  const fileName = file.name.replace(/\.[^/.]+$/, '') // Remove file extension

  // Create temporary testimonial item with local URL
  const tempTestimonial: TestimonialItem = {
    id: fileId,
    url: URL.createObjectURL(file),
    title: fileName
  }

  // Add to testimonials immediately for UI feedback
  testimonials.value = [...testimonials.value, tempTestimonial]
  
  // Mark as uploading
  uploadingFiles.value.add(fileId)

  try {
    // Upload to server
    const attachment = await portfoliosApi.uploadAttachment({
      title: fileName,
      type: 'testimonial',
      file: file
    })

    // Update testimonial with server response
    const updatedTestimonials = testimonials.value.map(testimonial => 
      testimonial.id === fileId 
        ? {
            ...testimonial,
            id: attachment.id,
            url: attachment.url,
            title: attachment.title
          }
        : testimonial
    )
    
    testimonials.value = updatedTestimonials
    
    // Trigger update event for auto-save
    emit('update', { testimonials: updatedTestimonials })
    
  } catch (error) {
    console.error('Error uploading testimonial:', error)
    
    // Remove failed upload from testimonials
    const filteredTestimonials = testimonials.value.filter(t => t.id !== fileId)
    testimonials.value = filteredTestimonials
    
    alert('Ошибка загрузки файла. Попробуйте еще раз.')
  } finally {
    // Remove from uploading set
    uploadingFiles.value.delete(fileId)
  }
}

const removeTestimonial = (index: number) => {
  const updated = testimonials.value.filter((_, i) => i !== index)
  testimonials.value = updated
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    // Process files sequentially to avoid overwhelming the server
    for (const file of Array.from(target.files)) {
      await addTestimonial(file)
    }
    // Reset input
    target.value = ''
  }
}

const updateTestimonials = () => {
  // Trigger reactivity update
  testimonials.value = [...testimonials.value]
}

</script>

<style scoped>
.testimonials-step {
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

.testimonials-gallery {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4;
}

.testimonial-item {
  @apply relative border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden;
}

.photo-preview {
  @apply aspect-[4/3] bg-gray-100 dark:bg-gray-700 flex items-center justify-center;
}

.testimonial-image {
  @apply w-full h-full object-cover;
}

.placeholder-image {
  @apply text-gray-400;
}

.photo-info {
  @apply p-3;
}

.photo-header {
  @apply flex justify-between items-start mb-2;
}

.photo-title {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.photo-actions {
  @apply flex items-center;
}

.uploading-indicator {
  @apply flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-xs;
}

.spinner {
  @apply w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin;
}

.remove-button {
  @apply text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 opacity-0 transition-opacity;
}

.group:hover .remove-button {
  @apply opacity-100;
}

.title-input {
  @apply w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}

.upload-section {
  @apply mb-4;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors;
}

.upload-area h3 {
  @apply text-lg font-medium text-gray-900 dark:text-white mb-2;
}

.upload-description {
  @apply text-sm text-gray-500 dark:text-gray-400 mb-4;
}

.upload-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.upload-info {
  @apply text-xs text-gray-400 dark:text-gray-500 mt-2;
}

.summary-section {
  @apply mb-4;
}

.summary-card {
  @apply p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg;
}

.summary-card h4 {
  @apply text-sm font-medium text-purple-900 dark:text-purple-200 mb-2;
}

.summary-card p {
  @apply text-sm text-purple-800 dark:text-purple-300;
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
  @apply p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4;
}

.tips-section h4 {
  @apply text-sm font-medium text-blue-900 dark:text-blue-200 mb-2;
}

.tips-list {
  @apply text-sm text-blue-800 dark:text-blue-300 space-y-1;
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
