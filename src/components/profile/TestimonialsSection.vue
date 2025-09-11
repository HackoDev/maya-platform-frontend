<template>
  <div class="testimonials-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Отзывы клиентов
    </h2>
    
    <div class="space-y-6">
      <div
        v-for="testimonial in testimonials.textTestimonials"
        :key="testimonial.id"
        class="testimonial-card bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
      >
        <div class="flex items-start space-x-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {{ testimonial.clientName }}
            </h3>
            <p v-if="testimonial.clientPosition" class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {{ testimonial.clientPosition }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              {{ testimonial.testimonialText }}
            </p>
          </div>
          <div v-if="testimonial.rating" class="flex">
            <span
              v-for="star in 5"
              :key="star"
              class="text-yellow-400 text-sm"
            >
              {{ star <= testimonial.rating! ? '★' : '☆' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TestimonialsSectionProps } from '@/types/specialist-profile-view'

interface Props {
  testimonials: TestimonialsSectionProps['testimonials']
}

const props = defineProps<Props>()
</script>