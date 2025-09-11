<template>
  <div class="services-section bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Услуги и цены
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="service in services"
        :key="service.name"
        class="service-card bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ service.name }}
        </h3>
        <p v-if="service.description" class="text-gray-600 dark:text-gray-400 mb-4">
          {{ service.description }}
        </p>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-purple-600 dark:text-purple-400">
            {{ formatPrice(service) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServicesSectionProps, ServiceDetails } from '@/types/specialist-profile-view'

interface Props {
  services: ServicesSectionProps['services']
  specialistName: ServicesSectionProps['specialistName']
  contacts: ServicesSectionProps['contacts']
}

const props = defineProps<Props>()

const formatPrice = (service: ServiceDetails): string => {
  if (typeof service.price === 'string') {
    return service.price
  }

  const formattedPrice = service.price.toLocaleString('ru-RU')

  switch (service.priceType) {
    case 'hourly':
      return `${formattedPrice} ₽/час`
    case 'project':
      return `${formattedPrice} ₽/проект`
    case 'fixed':
      return `${formattedPrice} ₽`
    case 'negotiable':
      return 'Договорная'
    default:
      return `${formattedPrice} ₽`
  }
}
</script>