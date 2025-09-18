<template>
  <div class="testimonials-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Отзывы клиентов
      </h2>
      <div v-if="testimonials.photos.length > 0" class="text-sm text-gray-500 dark:text-gray-400">
        {{ testimonials.photos.length }} {{ testimonials.photos.length === 1 ? 'отзыв' : 'отзывов' }}
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="testimonials.photos.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-600 dark:text-gray-300">Пока нет опубликованных отзывов</p>
    </div>

    <!-- Photos grid - 3 per row -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="photo in testimonials.photos"
        :key="photo.id"
        class="group relative bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
        @click="openPhoto(photo)"
      >
        <!-- Photo -->
        <div class="aspect-[4/3] bg-gray-100 dark:bg-gray-600 relative overflow-hidden">
          <img
            :src="photo.url"
            :alt="photo.title || 'Отзыв клиента'"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <!-- Overlay on hover -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
        
        <!-- Card content -->
        <div class="p-3">
          <!-- Title -->
          <p class="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 mb-2">
            {{ photo.title }}
          </p>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div
      v-if="selectedPhoto"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn"
      @click="closeModal"
    >
      <div class="relative max-w-4xl sm:max-w-5xl lg:max-w-6xl max-h-[95vh] mx-4" @click.stop>
        <!-- Close button -->
        <button
          @click="closeModal"
          class="absolute -top-16 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Modal content -->
        <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl animate-scaleIn">
          <!-- Image -->
          <div class="relative">
            <img
              :src="selectedPhoto.url"
              :alt="selectedPhoto.title || 'Отзыв клиента'"
              class="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>

          <!-- Image info -->
          <div v-if="selectedPhoto.title" class="p-4 border-t border-gray-200 dark:border-gray-600">
            <p class="text-gray-700 dark:text-gray-200">
              {{ selectedPhoto.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { TestimonialsSectionProps, TestimonialPhoto } from '@/types/specialist-profile-view'

interface Props {
  testimonials: TestimonialsSectionProps['testimonials']
}

defineProps<Props>()

// Modal state
const selectedPhoto = ref<TestimonialPhoto | null>(null)


// Photo click handler
const openPhoto = (photo: TestimonialPhoto) => {
  selectedPhoto.value = photo
}

// Close modal
const closeModal = () => {
  selectedPhoto.value = null
}

// Keyboard event handler
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedPhoto.value) {
    closeModal()
  }
}

// Add/remove keyboard event listener
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}
</style>