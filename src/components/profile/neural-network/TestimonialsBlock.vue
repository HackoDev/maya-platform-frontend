<template>
  <div class="testimonials-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 7. Отзывы/рекомендации
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Скриншоты отзывов клиентов
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Загрузите фотографии отзывов, рекомендаций и благодарностей от ваших клиентов
      </p>
    </div>

    <div class="space-y-6">
      <!-- Photo Gallery -->
      <div v-if="testimonials.photos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div
          v-for="(photo, index) in testimonials.photos"
          :key="photo.id"
          class="relative group border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
        >
          <!-- Photo Preview -->
          <div class="aspect-[4/3] bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <img
              v-if="photo.url"
              :src="photo.url"
              :alt="photo.title || `Отзыв ${index + 1}`"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Photo Info -->
          <div class="p-3">
            <div class="flex justify-between items-start mb-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                Отзыв #{{ index + 1 }}
              </span>
              <button
                @click="removePhoto(index)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Title Input -->
            <input
              v-model="photo.title"
              type="text"
              placeholder="Название отзыва"
              class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              @input="updateTestimonials"
            />
          </div>
        </div>
      </div>

      <!-- Upload Area -->
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
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
        
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Загрузить скриншоты отзывов
        </h3>
        
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        
        <button
          @click="fileInput?.click()"
          :disabled="testimonials.photos.length >= 20"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Выбрать файлы ({{ testimonials.photos.length }}/20)
        </button>
        
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Поддерживаются: JPG, PNG, WebP. Максимум 5MB на файл
        </p>
      </div>

      <!-- Drag and Drop Zone -->
      <div
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        class="hidden md:block"
      >
        <!-- This will be handled by the upload area above -->
      </div>

      <!-- Summary -->
      <div v-if="testimonials.photos.length > 0" class="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <h4 class="text-sm font-medium text-purple-900 dark:text-purple-200 mb-2">
          📸 Загружено отзывов: {{ testimonials.photos.length }}
        </h4>
        <div class="text-sm text-purple-800 dark:text-purple-300">
          <span v-if="testimonials.photos.length > 0">
            Фотографий: {{ testimonials.photos.length }}
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="testimonials.photos.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Пока нет отзывов
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Загрузите скриншоты отзывов клиентов для повышения доверия
        </p>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Советы по работе с отзывами:
        </h4>
        <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Делайте скриншоты отзывов из мессенджеров, соцсетей, email</li>
          <li>• Обрезайте лишнее, оставляйте только текст отзыва</li>
          <li>• Лучше 3-5 качественных отзывов, чем 20 размытых</li>
          <li>• Отзывы с конкретными результатами работают лучше общих похвал</li>
          <li>• Можно добавить краткое описание к каждому отзыву</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { NeuralNetworkFormState, TestimonialPhoto } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()

const testimonials = computed(() => props.formState.testimonials)

const addPhoto = (file: File) => {
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
  if (testimonials.value.photos.length >= 20) {
    alert('Максимальное количество фотографий: 20.')
    return
  }

  // Create testimonial photo
  const newPhoto: TestimonialPhoto = {
    id: Date.now().toString(),
    url: URL.createObjectURL(file),
    title: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
  }

  const updated = [...testimonials.value.photos, newPhoto]
  emit('update', 'testimonials', 'photos', updated)
}

const removePhoto = (index: number) => {
  const updated = testimonials.value.photos.filter((_, i) => i !== index)
  emit('update', 'testimonials', 'photos', updated)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    Array.from(target.files).forEach(file => {
      addPhoto(file)
    })
    // Reset input
    target.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    Array.from(event.dataTransfer.files).forEach(file => {
      addPhoto(file)
    })
  }
}


const updateTestimonials = () => {
  // Trigger reactivity update by emitting the current data
  emit('update', 'testimonials', 'photos', [...testimonials.value.photos])
}

// Watch for changes and validate
watch(() => props.formState.testimonials, () => {
  // Testimonials are optional, so just emit validation
  emit('validate', '7')
}, { deep: true })
</script>