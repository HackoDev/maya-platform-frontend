<template>
  <div class="services-block">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Блок 5. Твои услуги и цены
      </h2>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Что предлагаешь клиентам
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Можно выбрать готовые услуги или добавить свои (необязательно)
      </p>
    </div>

    <div class="space-y-8">
      <!-- Predefined Services -->
      <div>
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Популярные услуги нейросетевых специалистов
        </h4>
        
        <div class="space-y-4">
          <div
            v-for="(service, key) in predefinedServices"
            :key="key"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600': service.selected }"
          >
            <div class="flex items-start justify-between">
              <label class="flex items-start cursor-pointer flex-1">
                <input
                  type="checkbox"
                  :checked="service.selected"
                  @change="updatePredefinedService(key, 'selected', ($event.target as HTMLInputElement).checked)"
                  class="mt-1 mr-3"
                />
                <div class="flex-1">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ service.name }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ service.description }}
                  </div>
                  <div class="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                    от {{ formatPrice(service.basePrice) }} руб
                  </div>
                </div>
              </label>
            </div>

            <!-- Custom Price Input -->
            <div v-if="service.selected" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ваша цена (руб)
                </label>
                <input
                  :value="service.customPrice || service.basePrice"
                  @input="updatePredefinedService(key, 'customPrice', parseInt(($event.target as HTMLInputElement).value) || service.basePrice)"
                  type="number"
                  min="0"
                  step="1000"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Дополнительное описание
                </label>
                <input
                  :value="service.description"
                  @input="updatePredefinedService(key, 'description', ($event.target as HTMLInputElement).value)"
                  type="text"
                  placeholder="Уточните особенности вашей услуги..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Services -->
      <div>
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Дополнительные услуги
        </h4>

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
                  type="number"
                  min="0"
                  step="100"
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

        <!-- Add Custom Service Button -->
        <button
          @click="addCustomService"
          class="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Добавить свою услугу
        </button>
      </div>

      <!-- Services Summary -->
      <div v-if="totalServices > 0" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h4 class="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
          📋 Итого услуг: {{ totalServices }}
        </h4>
        <div class="text-sm text-green-800 dark:text-green-300">
          Отлично! Клиенты смогут выбрать подходящую услугу из вашего списка.
        </div>
      </div>

      <!-- Tips -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
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
import { ref, computed, watch } from 'vue'
import type { NeuralNetworkFormState, CustomService } from '@/types/neural-network-profile'

interface Props {
  formState: NeuralNetworkFormState
}

interface Emits {
  (e: 'update', blockId: string, fieldId: string, value: any): void
  (e: 'validate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const predefinedServices = computed(() => props.formState.services.predefinedServices)
const customServices = computed(() => props.formState.services.customServices)

const totalServices = computed(() => {
  const selectedPredefined = Object.values(predefinedServices.value).filter(s => s.selected).length
  const customCount = customServices.value.length
  return selectedPredefined + customCount
})

const updatePredefinedService = (serviceKey: string, field: string, value: any) => {
  const updated = { ...predefinedServices.value }
  ;(updated as any)[serviceKey] = { ...updated[serviceKey as keyof typeof updated], [field]: value }
  
  // Handle special case for negotiable price type
  if (field === 'priceType' && value === 'negotiable') {
    ;(updated as any)[serviceKey].price = 'По договоренности'
  }
  
  emit('update', 'services', `predefinedServices.${serviceKey}`, (updated as any)[serviceKey])
  emit('validate', '5')
}

const addCustomService = () => {
  const newService: CustomService = {
    id: Date.now().toString(),
    name: '',
    description: '',
    price: 0,
    priceType: 'fixed'
  }
  
  const updated = [...customServices.value, newService]
  emit('update', 'services', 'customServices', updated)
}

const removeCustomService = (index: number) => {
  const updated = customServices.value.filter((_, i) => i !== index)
  emit('update', 'services', 'customServices', updated)
}

const updateCustomServices = () => {
  // Trigger reactivity update
  emit('update', 'services', 'customServices', [...customServices.value])
  emit('validate', '5')
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU')
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

// Watch for changes and validate
watch(() => props.formState.services, () => {
  // Services are optional, so just emit validation
  emit('validate', '5')
}, { deep: true })
</script>