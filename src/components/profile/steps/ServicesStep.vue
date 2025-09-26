<template>
  <div class="services-step">
    <div class="step-header">
      <h2>Твои услуги и цены</h2>
      <p>Что предлагаешь клиентам. Можно выбрать готовые услуги или добавить свои (необязательно)</p>
    </div>

    <div class="step-content">
      <!-- Predefined Services -->
      <div class="predefined-services">
        <h3>Популярные услуги нейросетевых специалистов</h3>
        
        <div v-if="dataLoading" class="loading-state">
          <div class="text-gray-500">Загрузка услуг...</div>
        </div>
        
        <div v-else-if="availableServices.length > 0" class="services-grid">
          <div
            v-for="service in availableServices.filter(s => s)"
            :key="service.id"
            class="service-container"
          >
            <label
              class="service-item"
              :class="{ selected: isServiceSelected(service.id) }"
            >
              <input
                type="checkbox"
                :checked="isServiceSelected(service.id)"
                @change="toggleService(service.id)"
                class="sr-only"
              />
              <div class="checkbox-indicator">
                <svg
                  v-if="isServiceSelected(service.id)"
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="content">
                <div class="name">{{ service.name }}</div>
                <div v-if="service.description" class="description">{{ service.description }}</div>
                <div v-if="service.price" class="price">{{ service.price }}</div>
              </div>
            </label>

            <!-- Custom Price Input - отдельный блок под label -->
            <div v-if="isServiceSelected(service.id)" class="service-customization-block">
              <div class="customization-header">
                <h4 class="customization-title">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Настройка услуги: {{ service.name }}
                </h4>
              </div>
              
              <div class="customization-fields">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ваша цена (руб)
                  </label>
                  <input
                    :value="getServicePrice(service.id)"
                    @input="updateServicePrice(service.id, ($event.target as HTMLInputElement).value || '0')"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Дополнительное описание
                  </label>
                  <input
                    :value="getServiceDescription(service.id)"
                    @input="updateServiceDescription(service.id, ($event.target as HTMLInputElement).value)"
                    type="text"
                    placeholder="Уточните особенности вашей услуги..."
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <p class="text-gray-500 dark:text-gray-400">Нет доступных услуг для выбора</p>
        </div>
      </div>

      <!-- Custom Services -->
      <div class="custom-services mt-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Дополнительные услуги</h3>
        
        <div v-if="customServices.length > 0" class="space-y-4 mb-4">
          <div
            v-for="(service, index) in customServices"
            :key="service.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-3">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white">
                Услуга #{{ index + 1 }}
              </h5>
              <button
                @click="removeCustomService(index)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Service Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Название услуги
                </label>
                <input
                  v-model="service.name"
                  type="text"
                  placeholder="Аудит нейросетевой стратегии"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @input="updateCustomServices"
                />
              </div>

              <!-- Price Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Тип цены
                </label>
                <select
                  v-model="service.priceType"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @change="updateCustomServices"
                >
                  <option value="fixed">Фиксированная</option>
                  <option value="hourly">За час</option>
                  <option value="project">За проект</option>
                  <option value="negotiable">По договоренности</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Описание услуги
              </label>
              <textarea
                v-model="service.description"
                rows="2"
                placeholder="Подробно опишите, что включает в себя услуга..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none"
                @input="updateCustomServices"
              ></textarea>
            </div>

            <!-- Price -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ getPriceLabel(service.priceType) }}
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-if="service.priceType !== 'negotiable'"
                  v-model="service.price"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  @input="updateCustomServices"
                />
                <input
                  v-else
                  v-model="service.price"
                  type="text"
                  placeholder="По договоренности"
                  readonly
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm"
                />
                <span v-if="service.priceType !== 'negotiable'" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getPriceSuffix(service.priceType) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="addCustomService"
          class="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mt-4"
          type="button"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить свою услугу
        </button>
      </div>

      <!-- Services Summary -->
      <div v-if="totalServices > 0" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mt-8">
        <h4 class="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
          📋 Итого услуг: {{ totalServices }}
        </h4>
        <div class="text-sm text-green-800 dark:text-green-300">
          Отлично! Клиенты смогут выбрать подходящую услугу из вашего списка.
        </div>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mt-6">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Советы по ценообразованию:
        </h4>
        <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Изучите цены конкурентов в своей нише</li>
          <li>• Указывайте цены "от" для гибкости в переговорах</li>
          <li>• Предлагайте пакеты услуг для увеличения среднего чека</li>
          <li>• Не занижайте цены — это может сигнализировать о низком качестве</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNeuralNetworkProfileStore } from '@/stores/neural-network-profile-simple'
import type { NeuralNetworkProfile, ServiceItem } from '@/types/neural-network-profile-simple'

interface Props {
  profile: NeuralNetworkProfile | null
}

interface Emits {
  (e: 'update', updates: Partial<NeuralNetworkProfile>): void
  (e: 'complete', stepId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useNeuralNetworkProfileStore()

const availableServices = computed(() => store.availableServices)
const dataLoading = computed(() => store.dataLoading)

const customServices = computed({
  get: () => props.profile?.customServices || [],
  set: (value) => emit('update', { customServices: value })
})

const totalServices = computed(() => {
  const selectedCount = props.profile?.services?.length || 0
  const customCount = props.profile?.customServices?.length || 0
  return selectedCount + customCount
})

const isServiceSelected = (serviceId: number) => {
  if (!props.profile?.services) return false
  return props.profile.services.includes(serviceId)
}

const toggleService = (serviceId: number) => {
  if (!props.profile) return
  
  const isSelected = isServiceSelected(serviceId)
  
  if (isSelected) {
    // Remove service ID and its options
    const updatedServices = props.profile.services.filter(id => id !== serviceId)
    const updatedServiceOptions = { ...props.profile.serviceOptions }
    delete updatedServiceOptions[serviceId]
    emit('update', { services: updatedServices, serviceOptions: updatedServiceOptions })
  } else {
    // Add service ID and initialize its options
    const updatedServices = [...(props.profile.services || []), serviceId]
    const service = availableServices.value.find(s => s && s.id === serviceId)
    const updatedServiceOptions = {
      ...props.profile.serviceOptions,
      [serviceId]: {
        customPrice: service?.price || '0',
        customDescription: service?.description || ''
      }
    }
    emit('update', { services: updatedServices, serviceOptions: updatedServiceOptions })
  }
}


const getServicePrice = (serviceId: number) => {
  // If custom price is set, return it
  if (props.profile?.serviceOptions?.[serviceId]?.customPrice) {
    return props.profile.serviceOptions[serviceId].customPrice
  }
  
  // Otherwise return the original service price
  const service = availableServices.value.find(s => s && s.id === serviceId)
  return service?.price || '0'
}

const getServiceDescription = (serviceId: number) => {
  // If custom description is set, return it
  if (props.profile?.serviceOptions?.[serviceId]?.customDescription) {
    return props.profile.serviceOptions[serviceId].customDescription
  }
  
  // Otherwise return the original service description
  const service = availableServices.value.find(s => s && s.id === serviceId)
  return service?.description || ''
}

const updateServicePrice = (serviceId: number, price: string) => {
  if (!props.profile) return
  
  const updatedServiceOptions = {
    ...props.profile.serviceOptions,
    [serviceId]: {
      ...props.profile.serviceOptions?.[serviceId],
      customPrice: price
    }
  }
  emit('update', { serviceOptions: updatedServiceOptions })
}

const updateServiceDescription = (serviceId: number, description: string) => {
  if (!props.profile) return
  
  const updatedServiceOptions = {
    ...props.profile.serviceOptions,
    [serviceId]: {
      ...props.profile.serviceOptions?.[serviceId],
      customDescription: description
    }
  }
  emit('update', { serviceOptions: updatedServiceOptions })
}

const addCustomService = () => {
  const newService: ServiceItem = {
    id: Date.now().toString(),
    name: '',
    description: '',
    price: '0',
    priceType: 'fixed'
  }
  
  customServices.value = [...customServices.value, newService]
}

const removeCustomService = (index: number) => {
  const updated = customServices.value.filter((_, i) => i !== index)
  customServices.value = updated
}

const updateCustomServices = () => {
  // Trigger reactivity update
  customServices.value = [...customServices.value]
}

const getPriceLabel = (priceType: string): string => {
  switch (priceType) {
    case 'fixed': return 'Цена (руб)'
    case 'hourly': return 'Цена за час (руб)'
    case 'project': return 'Цена за проект (руб)'
    case 'negotiable': return 'Цена'
    default: return 'Цена (руб)'
  }
}


const getPriceSuffix = (priceType: string): string => {
  switch (priceType) {
    case 'hourly': return 'руб/час'
    case 'project': return 'руб/проект'
    default: return 'руб'
  }
}
</script>

<style scoped>
.services-step {
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

.predefined-services {
  @apply mb-8;
}

.predefined-services h3 {
  @apply text-lg font-medium text-gray-900 dark:text-white mb-4;
}

.services-grid {
  @apply space-y-4 mb-8;
}

.service-container {
  @apply w-full;
}

.service-item {
  @apply relative flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.service-customization-block {
  @apply mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg;
}

.customization-header {
  @apply mb-4;
}

.customization-title {
  @apply flex items-center text-sm font-medium text-blue-900 dark:text-blue-200;
}

.customization-fields {
  @apply space-y-4;
}

.service-item.selected {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600;
}

.checkbox-indicator {
  @apply flex-shrink-0 w-5 h-5 border-2 rounded transition-colors mr-3 mt-0.5;
}

.service-item:not(.selected) .checkbox-indicator {
  @apply border-gray-300 dark:border-gray-500;
}

.service-item.selected .checkbox-indicator {
  @apply bg-blue-600 border-blue-600 flex items-center justify-center;
}

.content {
  @apply flex-1;
}

.name {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.description {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}

.price {
  @apply text-xs font-medium text-green-600 dark:text-green-400 mt-1;
}

/* Старые стили удалены - теперь используются inline Tailwind классы */

.step-actions {
  @apply flex justify-end;
}

.btn {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-colors;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.loading-state {
  @apply text-center py-8;
}
</style>
