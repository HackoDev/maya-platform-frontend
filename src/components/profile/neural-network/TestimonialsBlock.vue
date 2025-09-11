<template>
  <div class="testimonials-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 7. Отзывы/рекомендации
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Что говорят клиенты
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Вы можете прикрепить ссылку на диск, сайт или другой ресурс с файлами (необязательно)
      </p>
    </div>

    <div class="space-y-8">
      <!-- Text Testimonials -->
      <div>
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Текстовые отзывы
        </h4>

        <div v-if="testimonials.textTestimonials.length > 0" class="space-y-4 mb-4">
          <div
            v-for="(testimonial, index) in testimonials.textTestimonials"
            :key="testimonial.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-3">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white">
                Отзыв #{{ index + 1 }}
              </h5>
              <button
                @click="removeTestimonial(index)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- Client Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Имя клиента
                </label>
                <input
                  v-model="testimonial.clientName"
                  type="text"
                  placeholder="Иван Петров"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @input="updateTestimonials"
                />
              </div>

              <!-- Client Position -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Должность/Компания
                </label>
                <input
                  v-model="testimonial.clientPosition"
                  type="text"
                  placeholder="CEO, TechStartup"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @input="updateTestimonials"
                />
              </div>
            </div>

            <!-- Testimonial Text -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Текст отзыва
              </label>
              <textarea
                v-model="testimonial.testimonialText"
                rows="4"
                placeholder="Отличный специалист! Помог автоматизировать наши продажи..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
                @input="updateTestimonials"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Rating -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Оценка (1-5)
                </label>
                <select
                  v-model="testimonial.rating"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @change="updateTestimonials"
                >
                  <option :value="undefined">Не указана</option>
                  <option :value="5">⭐⭐⭐⭐⭐ (5)</option>
                  <option :value="4">⭐⭐⭐⭐ (4)</option>
                  <option :value="3">⭐⭐⭐ (3)</option>
                  <option :value="2">⭐⭐ (2)</option>
                  <option :value="1">⭐ (1)</option>
                </select>
              </div>

              <!-- Project Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Тип проекта
                </label>
                <input
                  v-model="testimonial.projectType"
                  type="text"
                  placeholder="Нейроассистент"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @input="updateTestimonials"
                />
              </div>

              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Дата
                </label>
                <input
                  v-model="testimonial.date"
                  type="text"
                  placeholder="2023"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @input="updateTestimonials"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          @click="addTestimonial"
          :disabled="testimonials.textTestimonials.length >= 10"
          class="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить отзыв ({{ testimonials.textTestimonials.length }}/10)
        </button>
      </div>

      <!-- External Links -->
      <div>
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Ссылки на внешние ресурсы с отзывами
        </h4>

        <div v-if="testimonials.externalLinks.length > 0" class="space-y-2 mb-4">
          <div
            v-for="(link, index) in testimonials.externalLinks"
            :key="index"
            class="flex items-center space-x-2"
          >
            <input
              v-model="testimonials.externalLinks[index]"
              type="url"
              placeholder="https://drive.google.com/folder/reviews или https://example.com/testimonials"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              @input="updateTestimonials"
            />
            <button
              @click="removeExternalLink(index)"
              class="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="addExternalLink"
          :disabled="testimonials.externalLinks.length >= 5"
          class="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить ссылку ({{ testimonials.externalLinks.length }}/5)
        </button>
      </div>

      <!-- File Upload Placeholder -->
      <div>
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Файлы с отзывами
        </h4>
        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Загрузка файлов
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Функция загрузки файлов будет добавлена позже
          </p>
        </div>
      </div>

      <!-- Testimonials Summary -->
      <div v-if="totalTestimonials > 0" class="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <h4 class="text-sm font-medium text-purple-900 dark:text-purple-200 mb-2">
          💬 Всего отзывов: {{ totalTestimonials }}
        </h4>
        <div class="text-sm text-purple-800 dark:text-purple-300">
          <span v-if="testimonials.textTestimonials.length > 0">
            Текстовых: {{ testimonials.textTestimonials.length }}
          </span>
          <span v-if="testimonials.externalLinks.length > 0" class="ml-4">
            Ссылок: {{ testimonials.externalLinks.length }}
          </span>
          <span v-if="testimonials.files.length > 0" class="ml-4">
            Файлов: {{ testimonials.files.length }}
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="totalTestimonials === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Пока нет отзывов
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Добавьте отзывы клиентов для повышения доверия
        </p>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Советы по работе с отзывами:
        </h4>
        <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Всегда спрашивайте отзыв после успешного завершения проекта</li>
          <li>• Лучше один подробный отзыв, чем пять коротких "всё хорошо"</li>
          <li>• Используйте Google Drive или Яндекс.Диск для хранения скриншотов отзывов</li>
          <li>• Отзывы с конкретными результатами работают лучше общих похвал</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { NeuralNetworkFormState, TestimonialEntry } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const testimonials = computed(() => props.formState.testimonials)

const totalTestimonials = computed(() => {
  return testimonials.value.textTestimonials.length + 
         testimonials.value.externalLinks.length + 
         testimonials.value.files.length
})

const addTestimonial = () => {
  const newTestimonial: TestimonialEntry = {
    id: Date.now().toString(),
    clientName: '',
    clientPosition: '',
    testimonialText: '',
    rating: undefined,
    projectType: '',
    date: ''
  }
  
  const updated = [...testimonials.value.textTestimonials, newTestimonial]
  emit('update', 'testimonials', 'textTestimonials', updated)
}

const removeTestimonial = (index: number) => {
  const updated = testimonials.value.textTestimonials.filter((_, i) => i !== index)
  emit('update', 'testimonials', 'textTestimonials', updated)
}

const addExternalLink = () => {
  const updated = [...testimonials.value.externalLinks, '']
  emit('update', 'testimonials', 'externalLinks', updated)
}

const removeExternalLink = (index: number) => {
  const updated = testimonials.value.externalLinks.filter((_, i) => i !== index)
  emit('update', 'testimonials', 'externalLinks', updated)
}

const updateTestimonials = () => {
  // Trigger reactivity update by emitting the current data
  emit('update', 'testimonials', 'textTestimonials', [...testimonials.value.textTestimonials])
  emit('update', 'testimonials', 'externalLinks', [...testimonials.value.externalLinks])
}

// Watch for changes and validate
watch(() => props.formState.testimonials, () => {
  // Testimonials are optional, so just emit validation
  emit('validate', '7')
}, { deep: true })
</script>